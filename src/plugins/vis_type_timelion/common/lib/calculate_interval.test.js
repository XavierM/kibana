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
const calculate_interval_1 = require("./calculate_interval");
const moment_1 = tslib_1.__importDefault(require("moment"));
const from = (count, unit) => moment_1.default()
    .subtract(count, unit)
    .valueOf();
const to = moment_1.default().valueOf();
const size = 200;
const min = '1ms';
describe('calculate_interval', () => {
    it('Exports a function', () => {
        expect(typeof calculate_interval_1.calculateInterval).toBe('function');
    });
    it('Only calculates when interval = auto', () => {
        const partialFn = (interval) => calculate_interval_1.calculateInterval(from(1, 'y'), to, size, interval, min);
        expect(partialFn('1ms')).toEqual('1ms');
        expect(partialFn('bag_of_beans')).toEqual('bag_of_beans');
        expect(partialFn('auto')).not.toEqual('auto');
    });
    it('Calculates nice round intervals', () => {
        const partialFn = (count, unit) => calculate_interval_1.calculateInterval(from(count, unit), to, size, 'auto', min);
        expect(partialFn(15, 'm')).toEqual('1s');
        expect(partialFn(1, 'h')).toEqual('30s');
        expect(partialFn(3, 'd')).toEqual('30m');
        expect(partialFn(1, 'w')).toEqual('1h');
        expect(partialFn(1, 'y')).toEqual('24h');
        expect(partialFn(100, 'y')).toEqual('1y');
    });
    it('Does not calculate an interval lower than the minimum', () => {
        const partialFn = (count, unit) => calculate_interval_1.calculateInterval(from(count, unit), to, size, 'auto', '1m');
        expect(partialFn(5, 's')).toEqual('1m');
        expect(partialFn(15, 'm')).toEqual('1m');
        expect(partialFn(1, 'h')).toEqual('1m');
        expect(partialFn(3, 'd')).toEqual('30m');
        expect(partialFn(1, 'w')).toEqual('1h');
        expect(partialFn(1, 'y')).toEqual('24h');
        expect(partialFn(100, 'y')).toEqual('1y');
    });
});
