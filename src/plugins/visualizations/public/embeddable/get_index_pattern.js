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
const public_1 = require("../../../../plugins/data/public");
const services_1 = require("../services");
async function getIndexPattern(savedVis) {
    if (savedVis.visState.type !== 'metrics') {
        return savedVis.searchSource.getField('index');
    }
    const savedObjectsClient = services_1.getSavedObjects().client;
    const defaultIndex = services_1.getUISettings().get('defaultIndex');
    if (savedVis.visState.params.index_pattern) {
        const indexPatternObjects = await savedObjectsClient.find({
            type: 'index-pattern',
            fields: ['title', 'fields'],
            search: `"${savedVis.visState.params.index_pattern}"`,
            searchFields: ['title'],
        });
        const [indexPattern] = indexPatternObjects.savedObjects.map(public_1.indexPatterns.getFromSavedObject);
        return indexPattern;
    }
    const savedObject = await savedObjectsClient.get('index-pattern', defaultIndex);
    return public_1.indexPatterns.getFromSavedObject(savedObject);
}
exports.getIndexPattern = getIndexPattern;
