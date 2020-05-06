"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @name SavedVis
 *
 * @extends SavedObject.
 *
 * NOTE: It's a type of SavedObject, but specific to visualizations.
 */
const public_1 = require("../../../../plugins/saved_objects/public");
// @ts-ignore
const vis_update_state_1 = require("../legacy/vis_update_state");
const saved_visualization_references_1 = require("./saved_visualization_references");
const public_2 = require("../../../../plugins/discover/public");
const services_1 = require("../services");
exports.convertToSerializedVis = async (savedVis) => {
    const { visState } = savedVis;
    const searchSource = savedVis.searchSource && (await getSearchSource(savedVis.searchSource, savedVis.savedSearchId));
    const indexPattern = searchSource && searchSource.getField('index') ? searchSource.getField('index').id : undefined;
    const aggs = indexPattern ? visState.aggs || [] : visState.aggs;
    return {
        id: savedVis.id,
        title: savedVis.title,
        type: visState.type,
        description: savedVis.description,
        params: visState.params,
        uiState: JSON.parse(savedVis.uiStateJSON || '{}'),
        data: {
            indexPattern,
            aggs,
            searchSource,
            savedSearchId: savedVis.savedSearchId,
        },
    };
};
exports.convertFromSerializedVis = (vis) => {
    return {
        id: vis.id,
        title: vis.title,
        description: vis.description,
        visState: {
            type: vis.type,
            aggs: vis.data.aggs,
            params: vis.params,
        },
        uiStateJSON: JSON.stringify(vis.uiState),
        searchSource: vis.data.searchSource,
        savedSearchId: vis.data.savedSearchId,
    };
};
const getSearchSource = async (inputSearchSource, savedSearchId) => {
    const search = services_1.getSearch();
    const searchSource = inputSearchSource.createCopy
        ? inputSearchSource.createCopy()
        : search.searchSource.create({ ...inputSearchSource.fields });
    if (savedSearchId) {
        const savedSearch = await public_2.createSavedSearchesLoader({
            search,
            savedObjectsClient: services_1.getSavedObjects().client,
            indexPatterns: services_1.getIndexPatterns(),
            chrome: services_1.getChrome(),
            overlays: services_1.getOverlays(),
        }).get(savedSearchId);
        searchSource.setParent(savedSearch.searchSource);
    }
    searchSource.setField('size', 0);
    return searchSource;
};
function createSavedVisClass(services) {
    const SavedObjectClass = public_1.createSavedObjectClass(services);
    class SavedVis extends SavedObjectClass {
        constructor(opts = {}) {
            if (typeof opts !== 'object') {
                opts = { id: opts };
            }
            const visState = !opts.type ? null : { type: opts.type };
            // Gives our SavedWorkspace the properties of a SavedObject
            super({
                type: SavedVis.type,
                mapping: SavedVis.mapping,
                searchSource: SavedVis.searchSource,
                extractReferences: saved_visualization_references_1.extractReferences,
                injectReferences: saved_visualization_references_1.injectReferences,
                id: opts.id || '',
                indexPattern: opts.indexPattern,
                defaults: {
                    title: '',
                    visState,
                    uiStateJSON: '{}',
                    description: '',
                    savedSearchId: opts.savedSearchId,
                    version: 1,
                },
                afterESResp: async (savedObject) => {
                    const savedVis = savedObject;
                    savedVis.visState = await vis_update_state_1.updateOldState(savedVis.visState);
                    if (savedVis.savedSearchId && savedVis.searchSource) {
                        savedObject.searchSource = await getSearchSource(savedVis.searchSource, savedVis.savedSearchId);
                    }
                    return savedVis;
                },
            });
            this.showInRecentlyAccessed = true;
            this.getFullPath = () => {
                return `/app/kibana#/visualize/edit/${this.id}`;
            };
        }
    }
    SavedVis.type = 'visualization';
    SavedVis.mapping = {
        title: 'text',
        visState: 'json',
        uiStateJSON: 'text',
        description: 'text',
        savedSearchId: 'keyword',
        version: 'integer',
    };
    // Order these fields to the top, the rest are alphabetical
    SavedVis.fieldOrder = ['title', 'description'];
    SavedVis.searchSource = true;
    return SavedVis;
}
exports.createSavedVisClass = createSavedVisClass;
