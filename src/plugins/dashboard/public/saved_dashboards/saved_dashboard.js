"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const public_1 = require("../../../../plugins/saved_objects/public");
const saved_dashboard_references_1 = require("./saved_dashboard_references");
const dashboard_constants_1 = require("../dashboard_constants");
// Used only by the savedDashboards service, usually no reason to change this
function createSavedDashboardClass(services) {
    const SavedObjectClass = public_1.createSavedObjectClass(services);
    class SavedDashboard extends SavedObjectClass {
        constructor(id) {
            super({
                type: SavedDashboard.type,
                mapping: SavedDashboard.mapping,
                searchSource: SavedDashboard.searchSource,
                extractReferences: saved_dashboard_references_1.extractReferences,
                injectReferences: saved_dashboard_references_1.injectReferences,
                // if this is null/undefined then the SavedObject will be assigned the defaults
                id,
                // default values that will get assigned if the doc is new
                defaults: {
                    title: '',
                    hits: 0,
                    description: '',
                    panelsJSON: '[]',
                    optionsJSON: JSON.stringify({
                        // for BWC reasons we can't default dashboards that already exist without this setting to true.
                        useMargins: !id,
                        hidePanelTitles: false,
                    }),
                    version: 1,
                    timeRestore: false,
                    timeTo: undefined,
                    timeFrom: undefined,
                    refreshInterval: undefined,
                },
            });
            this.showInRecentlyAccessed = true;
            this.getFullPath = () => `/app/kibana#${dashboard_constants_1.createDashboardEditUrl(String(this.id))}`;
        }
        getQuery() {
            return this.searchSource.getOwnField('query') || { query: '', language: 'kuery' };
        }
        getFilters() {
            return this.searchSource.getOwnField('filter') || [];
        }
    }
    // save these objects with the 'dashboard' type
    SavedDashboard.type = 'dashboard';
    // if type:dashboard has no mapping, we push this mapping into ES
    SavedDashboard.mapping = {
        title: 'text',
        hits: 'integer',
        description: 'text',
        panelsJSON: 'text',
        optionsJSON: 'text',
        version: 'integer',
        timeRestore: 'boolean',
        timeTo: 'keyword',
        timeFrom: 'keyword',
        refreshInterval: {
            type: 'object',
            properties: {
                display: { type: 'keyword' },
                pause: { type: 'boolean' },
                section: { type: 'integer' },
                value: { type: 'integer' },
            },
        },
    };
    SavedDashboard.fieldOrder = ['title', 'description'];
    SavedDashboard.searchSource = true;
    // Unfortunately this throws a typescript error without the casting.  I think it's due to the
    // convoluted way SavedObjects are created.
    return SavedDashboard;
}
exports.createSavedDashboardClass = createSavedDashboardClass;
