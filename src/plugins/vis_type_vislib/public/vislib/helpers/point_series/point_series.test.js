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
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const point_series_1 = require("./point_series");
const services_1 = require("../../../services");
describe('pointSeriesChartDataFromTable', function () {
    beforeAll(() => {
        services_1.setFormatService({
            deserialize: () => ({
                convert: jest.fn(v => v),
            }),
        });
    });
    it('handles a table with just a count', function () {
        const table = {
            columns: [{ id: '0' }],
            rows: [{ '0': 100 }],
        };
        const chartData = point_series_1.buildPointSeriesData(table, {
            y: [
                {
                    accessor: 0,
                    params: {},
                },
            ],
        });
        expect(chartData).toEqual(expect.any(Object));
        expect(chartData.series).toEqual(expect.any(Array));
        expect(chartData.series).toHaveLength(1);
        const series = chartData.series[0];
        expect(series.values).toHaveLength(1);
        expect(series.values[0]).toHaveProperty('x', '_all');
        expect(series.values[0]).toHaveProperty('y', 100);
    });
    it('handles a table with x and y column', function () {
        const table = {
            columns: [
                { id: '0', name: 'x' },
                { id: '1', name: 'Count' },
            ],
            rows: [
                { '0': 1, '1': 200 },
                { '0': 2, '1': 200 },
                { '0': 3, '1': 200 },
            ],
        };
        const dimensions = {
            x: { accessor: 0, params: {} },
            y: [{ accessor: 1, params: {} }],
        };
        const chartData = point_series_1.buildPointSeriesData(table, dimensions);
        expect(chartData).toEqual(expect.any(Object));
        expect(chartData.series).toEqual(expect.any(Array));
        expect(chartData.series).toHaveLength(1);
        const series = chartData.series[0];
        expect(series).toHaveProperty('label', 'Count');
        expect(series.values).toHaveLength(3);
    });
    it('handles a table with an x and two y aspects', function () {
        const table = {
            columns: [{ id: '0' }, { id: '1', name: 'Count-0' }, { id: '2', name: 'Count-1' }],
            rows: [
                { '0': 1, '1': 200, '2': 300 },
                { '0': 2, '1': 200, '2': 300 },
                { '0': 3, '1': 200, '2': 300 },
            ],
        };
        const dimensions = {
            x: { accessor: 0, params: {} },
            y: [
                { accessor: 1, params: {} },
                { accessor: 2, params: {} },
            ],
        };
        const chartData = point_series_1.buildPointSeriesData(table, dimensions);
        expect(chartData).toEqual(expect.any(Object));
        expect(chartData.series).toEqual(expect.any(Array));
        expect(chartData.series).toHaveLength(2);
        chartData.series.forEach(function (siri, i) {
            expect(siri).toHaveProperty('label', `Count-${i}`);
            expect(siri.values).toHaveLength(3);
        });
    });
    it('handles a table with an x, a series, and two y aspects', function () {
        const table = {
            columns: [
                { id: '0', name: 'x' },
                { id: '1', name: 'series', fieldFormatter: lodash_1.default.identity },
                { id: '2', name: 'y1' },
                { id: '3', name: 'y2' },
            ],
            rows: [
                { '0': 1, '1': 0, '2': 300, '3': 400 },
                { '0': 1, '1': 1, '2': 300, '3': 400 },
                { '0': 2, '1': 0, '2': 300, '3': 400 },
                { '0': 2, '1': 1, '2': 300, '3': 400 },
            ],
        };
        const dimensions = {
            x: { accessor: 0, params: {} },
            series: [{ accessor: 1, params: {} }],
            y: [
                { accessor: 2, params: {} },
                { accessor: 3, params: {} },
            ],
        };
        const chartData = point_series_1.buildPointSeriesData(table, dimensions);
        expect(chartData).toEqual(expect.any(Object));
        expect(chartData.series).toEqual(expect.any(Array));
        // one series for each extension, and then one for each metric inside
        expect(chartData.series).toHaveLength(4);
        chartData.series.forEach(function (siri) {
            expect(siri.values).toHaveLength(2);
        });
    });
});
