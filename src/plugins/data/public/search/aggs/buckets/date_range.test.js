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
const mocks_1 = require("../../../../../../../src/core/public/mocks");
const date_range_1 = require("./date_range");
const agg_configs_1 = require("../agg_configs");
const test_helpers_1 = require("../test_helpers");
const bucket_agg_types_1 = require("./bucket_agg_types");
const mocks_2 = require("../../../field_formats/mocks");
describe('date_range params', () => {
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
    const getAggConfigs = (params = {}, hasIncludeTypeMeta = true) => {
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
            typeMeta: hasIncludeTypeMeta
                ? {
                    aggs: {
                        date_range: {
                            bytes: {
                                time_zone: 'defaultTimeZone',
                            },
                        },
                    },
                }
                : undefined,
        };
        return new agg_configs_1.AggConfigs(indexPattern, [
            {
                id: bucket_agg_types_1.BUCKET_TYPES.DATE_RANGE,
                type: bucket_agg_types_1.BUCKET_TYPES.DATE_RANGE,
                schema: 'buckets',
                params,
            },
        ], {
            typesRegistry: test_helpers_1.mockAggTypesRegistry([date_range_1.getDateRangeBucketAgg(aggTypesDependencies)]),
            fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
        });
    };
    describe('getKey', () => {
        test('should return object', () => {
            const aggConfigs = getAggConfigs();
            const dateRange = aggConfigs.aggs[0];
            const bucket = { from: 'from-date', to: 'to-date', key: 'from-dateto-date' };
            expect(dateRange.getKey(bucket)).toEqual({ from: 'from-date', to: 'to-date' });
        });
    });
    describe('time_zone', () => {
        test('should use the specified time_zone', () => {
            const aggConfigs = getAggConfigs({
                time_zone: 'Europe/Minsk',
                field: 'bytes',
            });
            const dateRange = aggConfigs.aggs[0];
            const params = dateRange.toDsl()[bucket_agg_types_1.BUCKET_TYPES.DATE_RANGE];
            expect(params.time_zone).toBe('Europe/Minsk');
        });
        test('should use the fixed time_zone from the index pattern typeMeta', () => {
            const aggConfigs = getAggConfigs({
                field: 'bytes',
            });
            const dateRange = aggConfigs.aggs[0];
            const params = dateRange.toDsl()[bucket_agg_types_1.BUCKET_TYPES.DATE_RANGE];
            expect(params.time_zone).toBe('defaultTimeZone');
        });
        test('should use the Kibana time_zone if no parameter specified', () => {
            aggTypesDependencies = {
                ...aggTypesDependencies,
                uiSettings: {
                    ...aggTypesDependencies.uiSettings,
                    get: () => 'kibanaTimeZone',
                },
            };
            const aggConfigs = getAggConfigs({
                field: 'bytes',
            }, false);
            const dateRange = aggConfigs.aggs[0];
            const params = dateRange.toDsl()[bucket_agg_types_1.BUCKET_TYPES.DATE_RANGE];
            expect(params.time_zone).toBe('kibanaTimeZone');
        });
    });
});
