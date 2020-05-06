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
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const date_1 = require("./date");
describe('Date Format', () => {
    let convert;
    let mockConfig;
    beforeEach(() => {
        mockConfig = {};
        mockConfig.dateFormat = 'MMMM Do YYYY, HH:mm:ss.SSS';
        mockConfig['dateFormat:tz'] = 'Browser';
        const getConfig = (key) => mockConfig[key];
        const date = new date_1.DateFormat({}, getConfig);
        convert = date.convert.bind(date);
    });
    test('decoding an undefined or null date should return an empty string', () => {
        expect(convert(null)).toBe('-');
        expect(convert(undefined)).toBe('-');
    });
    test('should clear the memoization cache after changing the date', () => {
        function setDefaultTimezone() {
            moment_timezone_1.default.tz.setDefault(mockConfig['dateFormat:tz']);
        }
        const time = 1445027693942;
        mockConfig['dateFormat:tz'] = 'America/Chicago';
        setDefaultTimezone();
        const chicagoTime = convert(time);
        mockConfig['dateFormat:tz'] = 'America/Phoenix';
        setDefaultTimezone();
        const phoenixTime = convert(time);
        expect(chicagoTime).not.toBe(phoenixTime);
    });
    test('should return the value itself when it cannot successfully be formatted', () => {
        const dateMath = 'now+1M/d';
        expect(convert(dateMath)).toBe(dateMath);
    });
});
