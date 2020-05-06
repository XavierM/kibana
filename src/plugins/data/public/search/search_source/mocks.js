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
const mocks_1 = require("../../../../../core/public/mocks");
const search_source_1 = require("./search_source");
exports.searchSourceInstanceMock = {
    setPreferredSearchStrategyId: jest.fn(),
    setFields: jest.fn().mockReturnThis(),
    setField: jest.fn().mockReturnThis(),
    getId: jest.fn(),
    getFields: jest.fn(),
    getField: jest.fn(),
    getOwnField: jest.fn(),
    create: jest.fn().mockReturnThis(),
    createCopy: jest.fn().mockReturnThis(),
    createChild: jest.fn().mockReturnThis(),
    setParent: jest.fn(),
    getParent: jest.fn().mockReturnThis(),
    fetch: jest.fn().mockResolvedValue({}),
    onRequestStart: jest.fn(),
    getSearchRequestBody: jest.fn(),
    destroy: jest.fn(),
    history: [],
    serialize: jest.fn(),
};
exports.searchSourceMock = {
    create: jest.fn().mockReturnValue(exports.searchSourceInstanceMock),
    fromJSON: jest.fn().mockReturnValue(exports.searchSourceInstanceMock),
};
exports.createSearchSourceMock = (fields) => new search_source_1.SearchSource(fields, {
    search: jest.fn(),
    legacySearch: {
        esClient: {
            search: jest.fn(),
            msearch: jest.fn(),
        },
    },
    uiSettings: mocks_1.uiSettingsServiceMock.createStartContract(),
    injectedMetadata: mocks_1.injectedMetadataServiceMock.createStartContract(),
});
