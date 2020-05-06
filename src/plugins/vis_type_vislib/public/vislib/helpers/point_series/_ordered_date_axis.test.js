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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const _ordered_date_axis_1 = require("./_ordered_date_axis");
describe('orderedDateAxis', function () {
    const baseArgs = {
        vis: {
            indexPattern: {
                timeFieldName: '@timestamp',
            },
        },
        chart: {
            ordered: {},
            aspects: {
                x: [
                    {
                        params: {
                            format: 'hh:mm:ss',
                            bounds: {
                                min: moment_1.default()
                                    .subtract(15, 'm')
                                    .valueOf(),
                                max: moment_1.default().valueOf(),
                            },
                        },
                    },
                ],
            },
        },
    };
    describe('ordered object', function () {
        it('sets date: true', function () {
            const args = lodash_1.default.cloneDeep(baseArgs);
            _ordered_date_axis_1.orderedDateAxis(args.chart);
            expect(args.chart).toHaveProperty('ordered');
            expect(args.chart.ordered).toHaveProperty('date', true);
        });
        it('sets the min/max when the buckets are bounded', function () {
            const args = lodash_1.default.cloneDeep(baseArgs);
            _ordered_date_axis_1.orderedDateAxis(args.chart);
            expect(args.chart.ordered).toHaveProperty('min');
            expect(args.chart.ordered).toHaveProperty('max');
        });
        it('does not set the min/max when the buckets are unbounded', function () {
            const args = lodash_1.default.cloneDeep(baseArgs);
            args.chart.aspects.x[0].params.bounds = undefined;
            _ordered_date_axis_1.orderedDateAxis(args.chart);
            expect(args.chart.ordered).not.toHaveProperty('min');
            expect(args.chart.ordered).not.toHaveProperty('max');
        });
    });
});
