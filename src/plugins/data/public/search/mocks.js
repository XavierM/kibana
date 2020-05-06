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
const mocks_1 = require("./aggs/mocks");
const filter_1 = require("./aggs/param_types/filter");
const mocks_2 = require("./search_source/mocks");
exports.createSearchSourceMock = mocks_2.createSearchSourceMock;
const searchSetupMock = {
    aggs: mocks_1.searchAggsSetupMock(),
    registerSearchStrategyContext: jest.fn(),
    registerSearchStrategyProvider: jest.fn(),
};
exports.searchSetupMock = searchSetupMock;
const searchStartMock = {
    aggs: mocks_1.searchAggsStartMock(),
    setInterceptor: jest.fn(),
    search: jest.fn(),
    searchSource: mocks_2.searchSourceMock,
    __LEGACY: {
        AggConfig: jest.fn(),
        AggType: jest.fn(),
        aggTypeFieldFilters: new filter_1.AggTypeFieldFilters(),
        FieldParamType: jest.fn(),
        MetricAggType: jest.fn(),
        parentPipelineAggHelper: jest.fn(),
        siblingPipelineAggHelper: jest.fn(),
        esClient: {
            search: jest.fn(),
            msearch: jest.fn(),
        },
    },
};
exports.searchStartMock = searchStartMock;
