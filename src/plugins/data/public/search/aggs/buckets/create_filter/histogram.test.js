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
const histogram_1 = require("./histogram");
const agg_configs_1 = require("../../agg_configs");
const test_helpers_1 = require("../../test_helpers");
const bucket_agg_types_1 = require("../bucket_agg_types");
const common_1 = require("../../../../../common");
const mocks_1 = require("../../../../field_formats/mocks");
describe('AggConfig Filters', () => {
    describe('histogram', () => {
        const getConfig = (() => { });
        const fieldFormats = mocks_1.fieldFormatsServiceMock.createStartContract();
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
                    id: bucket_agg_types_1.BUCKET_TYPES.HISTOGRAM,
                    type: bucket_agg_types_1.BUCKET_TYPES.HISTOGRAM,
                    schema: 'buckets',
                    params: {
                        field: 'bytes',
                        interval: 1024,
                    },
                },
            ], { typesRegistry: test_helpers_1.mockAggTypesRegistry(), fieldFormats });
        };
        test('should return an range filter for histogram', () => {
            const aggConfigs = getAggConfigs();
            const filter = histogram_1.createFilterHistogram(aggConfigs.aggs[0], '2048');
            expect(filter).toHaveProperty('meta');
            expect(filter.meta).toHaveProperty('index', '1234');
            expect(filter).toHaveProperty('range');
            expect(filter.range).toHaveProperty('bytes');
            expect(filter.range.bytes).toHaveProperty('gte', 2048);
            expect(filter.range.bytes).toHaveProperty('lt', 3072);
            expect(filter.meta).toHaveProperty('formattedValue', '2,048');
        });
    });
});
