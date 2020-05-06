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
const filters_1 = require("../filters");
const filters_2 = require("./filters");
const agg_configs_1 = require("../../agg_configs");
const test_helpers_1 = require("../../test_helpers");
const mocks_1 = require("../../../../../../../core/public/mocks");
const mocks_2 = require("../../../../field_formats/mocks");
describe('AggConfig Filters', () => {
    describe('filters', () => {
        let aggTypesDependencies;
        beforeEach(() => {
            const { uiSettings } = mocks_1.coreMock.createSetup();
            aggTypesDependencies = {
                uiSettings,
                getInternalStartServices: () => ({
                    fieldFormats: mocks_2.fieldFormatsServiceMock.createStartContract(),
                    notifications: mocks_1.notificationServiceMock.createStartContract(),
                }),
            };
        });
        const getAggConfigs = () => {
            const field = {
                name: 'bytes',
            };
            const indexPattern = {
                id: '1234',
                title: 'logstash-*',
                fields: {
                    getByName: () => field,
                    filter: () => [field],
                },
            };
            return new agg_configs_1.AggConfigs(indexPattern, [
                {
                    type: 'filters',
                    schema: 'segment',
                    params: {
                        filters: [
                            { input: { query: 'type:apache', language: 'lucene' } },
                            { input: { query: 'type:nginx', language: 'lucene' } },
                        ],
                    },
                },
            ], {
                typesRegistry: test_helpers_1.mockAggTypesRegistry([filters_1.getFiltersBucketAgg(aggTypesDependencies)]),
                fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
            });
        };
        test('should return a filters filter', () => {
            const aggConfigs = getAggConfigs();
            const filter = filters_2.createFilterFilters(aggConfigs.aggs[0], 'type:nginx');
            expect(filter.query.bool.must[0].query_string.query).toBe('type:nginx');
            expect(filter.meta).toHaveProperty('index', '1234');
            expect(filter.meta).toHaveProperty('alias', 'type:nginx');
        });
    });
});
