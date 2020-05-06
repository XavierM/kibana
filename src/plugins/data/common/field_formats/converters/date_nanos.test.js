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
const date_nanos_1 = require("./date_nanos");
describe('Date Nanos Format', () => {
    let convert;
    let mockConfig;
    beforeEach(() => {
        mockConfig = {};
        mockConfig.dateNanosFormat = 'MMMM Do YYYY, HH:mm:ss.SSSSSSSSS';
        mockConfig['dateFormat:tz'] = 'Browser';
        const getConfig = (key) => mockConfig[key];
        const date = new date_nanos_1.DateNanosFormat({}, getConfig);
        convert = date.convert.bind(date);
    });
    test('should inject fractional seconds into formatted timestamp', () => {
        [
            {
                input: '2019-05-20T14:04:56.357001234Z',
                pattern: 'MMM D, YYYY @ HH:mm:ss.SSSSSSSSS',
                expected: 'May 20, 2019 @ 14:04:56.357001234',
            },
            {
                input: '2019-05-05T14:04:56.357111234Z',
                pattern: 'MMM D, YYYY @ HH:mm:ss.SSSSSSSSS',
                expected: 'May 5, 2019 @ 14:04:56.357111234',
            },
            {
                input: '2019-05-05T14:04:56.357Z',
                pattern: 'MMM D, YYYY @ HH:mm:ss.SSSSSSSSS',
                expected: 'May 5, 2019 @ 14:04:56.357000000',
            },
            {
                input: '2019-05-05T14:04:56Z',
                pattern: 'MMM D, YYYY @ HH:mm:ss.SSSSSSSSS',
                expected: 'May 5, 2019 @ 14:04:56.000000000',
            },
            {
                input: '2019-05-05T14:04:56.201900001Z',
                pattern: 'MMM D, YYYY @ HH:mm:ss SSSS',
                expected: 'May 5, 2019 @ 14:04:56 2019',
            },
            {
                input: '2019-05-05T14:04:56.201900001Z',
                pattern: 'SSSSSSSSS',
                expected: '201900001',
            },
        ].forEach(fixture => {
            const fracPattern = date_nanos_1.analysePatternForFract(fixture.pattern);
            const momentDate = moment_timezone_1.default(fixture.input).utc();
            const value = date_nanos_1.formatWithNanos(momentDate, fixture.input, fracPattern);
            expect(value).toBe(fixture.expected);
        });
    });
    test('decoding an undefined or null date should return an empty string', () => {
        expect(convert(null)).toBe('-');
        expect(convert(undefined)).toBe('-');
    });
    test('should clear the memoization cache after changing the date', () => {
        function setDefaultTimezone() {
            moment_timezone_1.default.tz.setDefault(mockConfig['dateFormat:tz']);
        }
        const dateTime = '2019-05-05T14:04:56.201900001Z';
        mockConfig['dateFormat:tz'] = 'America/Chicago';
        setDefaultTimezone();
        const chicagoTime = convert(dateTime);
        mockConfig['dateFormat:tz'] = 'America/Phoenix';
        setDefaultTimezone();
        const phoenixTime = convert(dateTime);
        expect(chicagoTime).not.toBe(phoenixTime);
    });
    test('should return the value itself when it cannot successfully be formatted', () => {
        const dateMath = 'now+1M/d';
        expect(convert(dateMath)).toBe(dateMath);
    });
});
describe('analysePatternForFract', () => {
    test('analysePatternForFract using timestamp format containing fractional seconds', () => {
        expect(date_nanos_1.analysePatternForFract('MMM, YYYY @ HH:mm:ss.SSS')).toMatchInlineSnapshot(`
        Object {
          "length": 3,
          "pattern": "MMM, YYYY @ HH:mm:ss.SSS",
          "patternEscaped": "MMM, YYYY @ HH:mm:ss.[SSS]",
          "patternNanos": "SSS",
        }
    `);
    });
    test('analysePatternForFract using timestamp format without fractional seconds', () => {
        expect(date_nanos_1.analysePatternForFract('MMM, YYYY @ HH:mm:ss')).toMatchInlineSnapshot(`
    Object {
      "length": 0,
      "pattern": "MMM, YYYY @ HH:mm:ss",
      "patternEscaped": "",
      "patternNanos": "",
    }
  `);
    });
});
