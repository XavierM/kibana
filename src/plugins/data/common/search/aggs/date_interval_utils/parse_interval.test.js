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
const parse_interval_1 = require("./parse_interval");
const validateDuration = (duration, unit, value) => {
    expect(duration).toBeDefined();
    if (duration) {
        expect(duration.as(unit)).toBe(value);
    }
};
describe('parseInterval', () => {
    describe('integer', () => {
        test('should correctly parse 1d interval', () => {
            validateDuration(parse_interval_1.parseInterval('1d'), 'd', 1);
        });
        test('should correctly parse 2y interval', () => {
            validateDuration(parse_interval_1.parseInterval('2y'), 'y', 2);
        });
        test('should correctly parse 5M interval', () => {
            validateDuration(parse_interval_1.parseInterval('5M'), 'M', 5);
        });
        test('should correctly parse 5m interval', () => {
            validateDuration(parse_interval_1.parseInterval('5m'), 'm', 5);
        });
        test('should correctly parse 500m interval', () => {
            validateDuration(parse_interval_1.parseInterval('500m'), 'm', 500);
        });
        test('should correctly parse 250ms interval', () => {
            validateDuration(parse_interval_1.parseInterval('250ms'), 'ms', 250);
        });
        test('should correctly parse 100s interval', () => {
            validateDuration(parse_interval_1.parseInterval('100s'), 's', 100);
        });
        test('should correctly parse 23d interval', () => {
            validateDuration(parse_interval_1.parseInterval('23d'), 'd', 23);
        });
        test('should correctly parse 52w interval', () => {
            validateDuration(parse_interval_1.parseInterval('52w'), 'w', 52);
        });
    });
    describe('fractional interval', () => {
        test('should correctly parse fractional 2.35y interval', () => {
            validateDuration(parse_interval_1.parseInterval('2.35y'), 'y', 2.35);
        });
        test('should correctly parse fractional 1.5w interval', () => {
            validateDuration(parse_interval_1.parseInterval('1.5w'), 'w', 1.5);
        });
    });
    describe('less than 1', () => {
        test('should correctly bubble up 0.5h interval which are less than 1', () => {
            validateDuration(parse_interval_1.parseInterval('0.5h'), 'm', 30);
        });
        test('should correctly bubble up 0.5d interval which are less than 1', () => {
            validateDuration(parse_interval_1.parseInterval('0.5d'), 'h', 12);
        });
    });
    describe('unit in an interval only', () => {
        test('should correctly parse ms interval', () => {
            validateDuration(parse_interval_1.parseInterval('ms'), 'ms', 1);
        });
        test('should correctly parse d interval', () => {
            validateDuration(parse_interval_1.parseInterval('d'), 'd', 1);
        });
        test('should correctly parse m interval', () => {
            validateDuration(parse_interval_1.parseInterval('m'), 'm', 1);
        });
        test('should correctly parse y interval', () => {
            validateDuration(parse_interval_1.parseInterval('y'), 'y', 1);
        });
        test('should correctly parse M interval', () => {
            validateDuration(parse_interval_1.parseInterval('M'), 'M', 1);
        });
    });
    test('should return null for an invalid interval', () => {
        let duration = parse_interval_1.parseInterval('');
        expect(duration).toBeNull();
        // @ts-ignore
        duration = parse_interval_1.parseInterval(null);
        expect(duration).toBeNull();
        duration = parse_interval_1.parseInterval('234asdf');
        expect(duration).toBeNull();
    });
});
