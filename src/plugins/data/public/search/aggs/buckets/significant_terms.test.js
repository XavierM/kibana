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
const agg_configs_1 = require("../agg_configs");
const test_helpers_1 = require("../test_helpers");
const bucket_agg_types_1 = require("./bucket_agg_types");
const significant_terms_1 = require("./significant_terms");
const mocks_1 = require("../../../field_formats/mocks");
const mocks_2 = require("../../../../../../../src/core/public/mocks");
describe('Significant Terms Agg', () => {
    describe('order agg editor UI', () => {
        describe('convert include/exclude from old format', () => {
            let aggTypesDependencies;
            beforeEach(() => {
                aggTypesDependencies = {
                    getInternalStartServices: () => ({
                        fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
                        notifications: mocks_2.notificationServiceMock.createStartContract(),
                    }),
                };
            });
            const getAggConfigs = (params = {}) => {
                const indexPattern = {
                    id: '1234',
                    title: 'logstash-*',
                    fields: {
                        getByName: () => field,
                        filter: () => [field],
                    },
                };
                const field = {
                    name: 'field',
                    indexPattern,
                };
                return new agg_configs_1.AggConfigs(indexPattern, [
                    {
                        id: 'test',
                        type: bucket_agg_types_1.BUCKET_TYPES.SIGNIFICANT_TERMS,
                        schema: 'segment',
                        params,
                    },
                ], {
                    typesRegistry: test_helpers_1.mockAggTypesRegistry([
                        significant_terms_1.getSignificantTermsBucketAgg(aggTypesDependencies),
                    ]),
                    fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
                });
            };
            const testSerializeAndWrite = (aggs) => {
                const [agg] = aggs.aggs;
                const { [bucket_agg_types_1.BUCKET_TYPES.SIGNIFICANT_TERMS]: params } = agg.toDsl();
                expect(params.field).toBe('field');
                expect(params.include).toBe('404');
                expect(params.exclude).toBe('400');
            };
            test('should generate correct label', () => {
                const aggConfigs = getAggConfigs({
                    size: 'SIZE',
                    field: {
                        name: 'FIELD',
                    },
                });
                const label = aggConfigs.aggs[0].makeLabel();
                expect(label).toBe('Top SIZE unusual terms in FIELD');
            });
            test('should doesnt do anything with string type', () => {
                const aggConfigs = getAggConfigs({
                    include: '404',
                    exclude: '400',
                    field: {
                        name: 'field',
                        type: 'string',
                    },
                });
                testSerializeAndWrite(aggConfigs);
            });
            test('should converts object to string type', () => {
                const aggConfigs = getAggConfigs({
                    include: {
                        pattern: '404',
                    },
                    exclude: {
                        pattern: '400',
                    },
                    field: {
                        name: 'field',
                        type: 'string',
                    },
                });
                testSerializeAndWrite(aggConfigs);
            });
        });
    });
});
