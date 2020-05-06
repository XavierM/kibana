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
exports.saveAsMock = jest.fn();
jest.doMock('@elastic/filesaver', () => ({
    saveAs: exports.saveAsMock,
}));
jest.doMock('lodash', () => ({
    ...jest.requireActual('lodash'),
    debounce: (func) => {
        function debounced(...args) {
            return func.apply(this, args);
        }
        return debounced;
    },
}));
exports.findObjectsMock = jest.fn();
jest.doMock('../../lib/find_objects', () => ({
    findObjects: exports.findObjectsMock,
}));
exports.fetchExportObjectsMock = jest.fn();
jest.doMock('../../lib/fetch_export_objects', () => ({
    fetchExportObjects: exports.fetchExportObjectsMock,
}));
exports.fetchExportByTypeAndSearchMock = jest.fn();
jest.doMock('../../lib/fetch_export_by_type_and_search', () => ({
    fetchExportByTypeAndSearch: exports.fetchExportByTypeAndSearchMock,
}));
exports.extractExportDetailsMock = jest.fn();
jest.doMock('../../lib/extract_export_details', () => ({
    extractExportDetails: exports.extractExportDetailsMock,
}));
jest.doMock('./components/header', () => ({
    Header: () => 'Header',
}));
exports.getSavedObjectCountsMock = jest.fn();
jest.doMock('../../lib/get_saved_object_counts', () => ({
    getSavedObjectCounts: exports.getSavedObjectCountsMock,
}));
exports.getRelationshipsMock = jest.fn();
jest.doMock('../../lib/get_relationships', () => ({
    getRelationships: exports.getRelationshipsMock,
}));
