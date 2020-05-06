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
const mocks_1 = require("./field_formats/mocks");
const mocks_2 = require("./search/mocks");
const mocks_3 = require("./query/mocks");
const autocompleteMock = {
    getValueSuggestions: jest.fn(),
    getQuerySuggestions: jest.fn(),
    hasQuerySuggestions: jest.fn(),
};
const createSetupContract = () => {
    const querySetupMock = mocks_3.queryServiceMock.createSetupContract();
    return {
        autocomplete: autocompleteMock,
        search: mocks_2.searchSetupMock,
        fieldFormats: mocks_1.fieldFormatsServiceMock.createSetupContract(),
        query: querySetupMock,
    };
};
const createStartContract = () => {
    const queryStartMock = mocks_3.queryServiceMock.createStartContract();
    return {
        actions: {
            createFiltersFromValueClickAction: jest.fn().mockResolvedValue(['yes']),
            createFiltersFromRangeSelectAction: jest.fn(),
        },
        autocomplete: autocompleteMock,
        search: mocks_2.searchStartMock,
        fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
        query: queryStartMock,
        ui: {
            IndexPatternSelect: jest.fn(),
            SearchBar: jest.fn(),
        },
        indexPatterns: {
            ensureDefaultIndexPattern: jest.fn(),
            make: () => ({
                fieldsFetcher: {
                    fetchForWildcard: jest.fn(),
                },
            }),
            get: jest.fn().mockReturnValue(Promise.resolve({})),
            clearCache: jest.fn(),
        },
    };
};
var mocks_4 = require("./search/mocks");
exports.createSearchSourceMock = mocks_4.createSearchSourceMock;
var aggs_1 = require("./search/aggs");
exports.getCalculateAutoTimeExpression = aggs_1.getCalculateAutoTimeExpression;
exports.dataPluginMock = {
    createSetupContract,
    createStartContract,
};
