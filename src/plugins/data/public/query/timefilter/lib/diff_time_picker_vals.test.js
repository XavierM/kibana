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
const diff_time_picker_vals_1 = require("./diff_time_picker_vals");
describe('Diff Time Picker Values', () => {
    describe('dateMath ranges', () => {
        test('knows a match', () => {
            const diff = diff_time_picker_vals_1.areTimeRangesDifferent({
                to: 'now',
                from: 'now-7d',
            }, {
                to: 'now',
                from: 'now-7d',
            });
            expect(diff).toBe(false);
        });
        test('knows a difference', () => {
            const diff = diff_time_picker_vals_1.areTimeRangesDifferent({
                to: 'now',
                from: 'now-7d',
            }, {
                to: 'now',
                from: 'now-1h',
            });
            expect(diff).toBe(true);
        });
    });
    describe('a dateMath range, and a moment range', () => {
        test('is always different', () => {
            const diff = diff_time_picker_vals_1.areTimeRangesDifferent({
                to: moment_1.default(),
                from: moment_1.default(),
            }, {
                to: 'now',
                from: 'now-1h',
            });
            expect(diff).toBe(true);
        });
    });
    describe('moment ranges', () => {
        test('uses the time value of moments for comparison', () => {
            const to = moment_1.default();
            const from = moment_1.default().add(1, 'day');
            const diff = diff_time_picker_vals_1.areTimeRangesDifferent({
                to: to.clone(),
                from: from.clone(),
            }, {
                to: to.clone(),
                from: from.clone(),
            });
            expect(diff).toBe(false);
        });
        test('fails if any to or from is different', () => {
            const to = moment_1.default();
            const from = moment_1.default().add(1, 'day');
            const from2 = moment_1.default().add(2, 'day');
            const diff = diff_time_picker_vals_1.areTimeRangesDifferent({
                to: to.clone(),
                from: from.clone(),
            }, {
                to: to.clone(),
                from: from2.clone(),
            });
            expect(diff).toBe(true);
        });
    });
});
