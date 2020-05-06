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
const moment_1 = tslib_1.__importDefault(require("moment"));
const _init_x_axis_1 = require("./_init_x_axis");
const _fake_x_aspect_1 = require("./_fake_x_aspect");
describe('initXAxis', function () {
    let chart;
    let table;
    beforeEach(function () {
        chart = {
            aspects: {
                x: [
                    {
                        ..._fake_x_aspect_1.makeFakeXAspect(),
                        accessor: '0',
                        title: 'label',
                    },
                ],
            },
        };
        table = {
            columns: [{ id: '0' }],
            rows: [{ '0': 'hello' }, { '0': 'world' }, { '0': 'foo' }, { '0': 'bar' }, { '0': 'baz' }],
        };
    });
    it('sets the xAxisFormatter if the agg is not ordered', function () {
        _init_x_axis_1.initXAxis(chart, table);
        expect(chart).toHaveProperty('xAxisLabel', 'label');
        expect(chart).toHaveProperty('xAxisFormat', chart.aspects.x[0].format);
    });
    it('makes the chart ordered if the agg is ordered', function () {
        chart.aspects.x[0].params.interval = 10;
        _init_x_axis_1.initXAxis(chart, table);
        expect(chart).toHaveProperty('xAxisLabel', 'label');
        expect(chart).toHaveProperty('xAxisFormat', chart.aspects.x[0].format);
        expect(chart).toHaveProperty('ordered');
    });
    describe('xAxisOrderedValues', function () {
        it('sets the xAxisOrderedValues property', function () {
            _init_x_axis_1.initXAxis(chart, table);
            expect(chart).toHaveProperty('xAxisOrderedValues');
        });
        it('returns a list of values, preserving the table order', function () {
            _init_x_axis_1.initXAxis(chart, table);
            expect(chart.xAxisOrderedValues).toEqual(['hello', 'world', 'foo', 'bar', 'baz']);
        });
        it('only returns unique values', function () {
            table = {
                columns: [{ id: '0' }],
                rows: [
                    { '0': 'hello' },
                    { '0': 'world' },
                    { '0': 'hello' },
                    { '0': 'world' },
                    { '0': 'foo' },
                    { '0': 'bar' },
                    { '0': 'baz' },
                    { '0': 'hello' },
                ],
            };
            _init_x_axis_1.initXAxis(chart, table);
            expect(chart.xAxisOrderedValues).toEqual(['hello', 'world', 'foo', 'bar', 'baz']);
        });
        it('returns the defaultValue if using fake x aspect', function () {
            chart = {
                aspects: {
                    x: [_fake_x_aspect_1.makeFakeXAspect()],
                },
            };
            _init_x_axis_1.initXAxis(chart, table);
            expect(chart.xAxisOrderedValues).toEqual(['_all']);
        });
    });
    it('reads the date interval param from the x agg', function () {
        const dateHistogramParams = chart.aspects.x[0].params;
        dateHistogramParams.interval = 'P1D';
        dateHistogramParams.intervalESValue = 1;
        dateHistogramParams.intervalESUnit = 'd';
        dateHistogramParams.date = true;
        _init_x_axis_1.initXAxis(chart, table);
        expect(chart).toHaveProperty('xAxisLabel', 'label');
        expect(chart).toHaveProperty('xAxisFormat', chart.aspects.x[0].format);
        expect(chart).toHaveProperty('ordered');
        expect(chart.ordered).toEqual(expect.any(Object));
        const { intervalESUnit, intervalESValue, interval } = chart.ordered;
        expect(moment_1.default.isDuration(interval)).toBe(true);
        expect(interval.toISOString()).toEqual('P1D');
        expect(intervalESValue).toBe(1);
        expect(intervalESUnit).toBe('d');
    });
    it('reads the numeric interval param from the x agg', function () {
        chart.aspects.x[0].params.interval = 0.5;
        _init_x_axis_1.initXAxis(chart, table);
        expect(chart).toHaveProperty('xAxisLabel', 'label');
        expect(chart).toHaveProperty('xAxisFormat', chart.aspects.x[0].format);
        expect(chart).toHaveProperty('ordered');
        expect(chart.ordered.interval).toEqual(0.5);
    });
});
