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
const get_columns_1 = require("./get_columns");
const aggs_1 = require("../aggs");
const test_helpers_1 = require("../aggs/test_helpers");
const mocks_1 = require("../../field_formats/mocks");
describe('get columns', () => {
    beforeEach(() => {
        test_helpers_1.mockDataServices();
    });
    const typesRegistry = test_helpers_1.mockAggTypesRegistry();
    const fieldFormats = mocks_1.fieldFormatsServiceMock.createStartContract();
    const createAggConfigs = (aggs = []) => {
        const field = {
            name: '@timestamp',
        };
        const indexPattern = {
            id: '1234',
            title: 'logstash-*',
            fields: {
                getByName: () => field,
                filter: () => [field],
            },
        };
        return new aggs_1.AggConfigs(indexPattern, aggs, {
            typesRegistry,
            fieldFormats,
        });
    };
    test('should inject the metric after each bucket if the vis is hierarchical', () => {
        const columns = get_columns_1.tabifyGetColumns(createAggConfigs([
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
            {
                type: 'count',
            },
        ]).aggs, false);
        expect(columns).toHaveLength(8);
        columns.forEach((column, i) => {
            expect(column).toHaveProperty('aggConfig');
            expect(column.aggConfig.type).toHaveProperty('name', i % 2 ? 'count' : 'date_histogram');
        });
    });
    test('should inject the multiple metrics after each bucket if the vis is hierarchical', () => {
        const columns = get_columns_1.tabifyGetColumns(createAggConfigs([
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
            { type: 'avg', schema: 'metric', params: { field: 'bytes' } },
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
            { type: 'sum', schema: 'metric', params: { field: 'bytes' } },
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
        ]).aggs, false);
        function checkColumns(column, i) {
            expect(column).toHaveProperty('aggConfig');
            switch (i) {
                case 0:
                    expect(column.aggConfig.type).toHaveProperty('name', 'date_histogram');
                    break;
                case 1:
                    expect(column.aggConfig.type).toHaveProperty('name', 'avg');
                    break;
                case 2:
                    expect(column.aggConfig.type).toHaveProperty('name', 'sum');
                    break;
            }
        }
        expect(columns).toHaveLength(12);
        for (let i = 0; i < columns.length; i += 3) {
            columns.slice(i, i + 3).forEach(checkColumns);
        }
    });
    test('should put all metrics at the end of the columns if the vis is not hierarchical', () => {
        const columns = get_columns_1.tabifyGetColumns(createAggConfigs([
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '20s' },
            },
            { type: 'sum', schema: 'metric', params: { field: '@timestamp' } },
            {
                type: 'date_histogram',
                schema: 'segment',
                params: { field: '@timestamp', interval: '10s' },
            },
        ]).aggs, false);
        expect(columns.map(c => c.name)).toEqual([
            '@timestamp per 20 seconds',
            'Sum of @timestamp',
            '@timestamp per 10 seconds',
            'Sum of @timestamp',
        ]);
    });
});
