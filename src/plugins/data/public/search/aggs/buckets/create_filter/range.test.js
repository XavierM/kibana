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
const range_1 = require("../range");
const range_2 = require("./range");
const common_1 = require("../../../../../common");
const agg_configs_1 = require("../../agg_configs");
const test_helpers_1 = require("../../test_helpers");
const bucket_agg_types_1 = require("../bucket_agg_types");
const mocks_1 = require("../../../../field_formats/mocks");
const mocks_2 = require("../../../../../../../core/public/mocks");
describe('AggConfig Filters', () => {
    describe('range', () => {
        let aggTypesDependencies;
        beforeEach(() => {
            aggTypesDependencies = {
                getInternalStartServices: () => ({
                    fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
                    notifications: mocks_2.notificationServiceMock.createStartContract(),
                }),
            };
            test_helpers_1.mockDataServices();
        });
        const getConfig = (() => { });
        const getAggConfigs = () => {
            const field = {
                name: 'bytes',
                format: new common_1.BytesFormat({}, getConfig),
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
                    id: bucket_agg_types_1.BUCKET_TYPES.RANGE,
                    type: bucket_agg_types_1.BUCKET_TYPES.RANGE,
                    schema: 'buckets',
                    params: {
                        field: 'bytes',
                        ranges: [{ from: 1024, to: 2048 }],
                    },
                },
            ], {
                typesRegistry: test_helpers_1.mockAggTypesRegistry([range_1.getRangeBucketAgg(aggTypesDependencies)]),
                fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
            });
        };
        test('should return a range filter for range agg', () => {
            const aggConfigs = getAggConfigs();
            const filter = range_2.createFilterRange(aggConfigs.aggs[0], {
                gte: 1024,
                lt: 2048.0,
            });
            expect(filter).toHaveProperty('range');
            expect(filter).toHaveProperty('meta');
            expect(filter.meta).toHaveProperty('index', '1234');
            expect(filter.range).toHaveProperty('bytes');
            expect(filter.range.bytes).toHaveProperty('gte', 1024.0);
            expect(filter.range.bytes).toHaveProperty('lt', 2048.0);
            expect(filter.meta).toHaveProperty('formattedValue', '≥ 1,024 and < 2,048');
        });
    });
});
