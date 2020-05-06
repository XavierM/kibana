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
const create_filter_1 = require("./create_filter");
const aggs_1 = require("../aggs");
const common_1 = require("../../../common");
const test_helpers_1 = require("../aggs/test_helpers");
const mocks_1 = require("../../field_formats/mocks");
describe('createFilter', () => {
    let table;
    let aggConfig;
    const fieldFormats = mocks_1.fieldFormatsServiceMock.createStartContract();
    const typesRegistry = test_helpers_1.mockAggTypesRegistry();
    const getAggConfigs = (type, params) => {
        const field = {
            name: 'bytes',
            filterable: true,
            indexPattern: {
                id: '1234',
            },
            format: new common_1.BytesFormat({}, (() => { })),
        };
        const indexPattern = {
            id: '1234',
            title: 'logstash-*',
            fields: {
                getByName: () => field,
                filter: () => [field],
            },
        };
        return new aggs_1.AggConfigs(indexPattern, [
            {
                id: type,
                type,
                schema: 'buckets',
                params,
            },
        ], { typesRegistry, fieldFormats });
    };
    const aggConfigParams = {
        field: 'bytes',
        interval: 30,
        otherBucket: true,
    };
    beforeEach(() => {
        table = {
            columns: [
                {
                    id: '1-1',
                    name: 'test',
                    aggConfig,
                },
            ],
            rows: [
                {
                    '1-1': '2048',
                },
            ],
        };
        test_helpers_1.mockDataServices();
    });
    test('ignores event when cell value is not provided', async () => {
        aggConfig = getAggConfigs('histogram', aggConfigParams).aggs[0];
        const filters = await create_filter_1.createFilter([aggConfig], table, 0, -1, null);
        expect(filters).not.toBeDefined();
    });
    test('handles an event when aggregations type is a terms', async () => {
        aggConfig = getAggConfigs('terms', aggConfigParams).aggs[0];
        const filters = await create_filter_1.createFilter([aggConfig], table, 0, 0, 'test');
        expect(filters).toBeDefined();
        if (filters) {
            expect(filters.length).toEqual(1);
            expect(filters[0].query.match_phrase.bytes).toEqual('2048');
        }
    });
    test('handles an event when aggregations type is not terms', async () => {
        aggConfig = getAggConfigs('histogram', aggConfigParams).aggs[0];
        const filters = await create_filter_1.createFilter([aggConfig], table, 0, 0, 'test');
        expect(filters).toBeDefined();
        if (filters) {
            expect(filters.length).toEqual(1);
            const [rangeFilter] = filters;
            if (common_1.isRangeFilter(rangeFilter)) {
                expect(rangeFilter.range.bytes.gte).toEqual(2048);
                expect(rangeFilter.range.bytes.lt).toEqual(2078);
            }
        }
    });
});
