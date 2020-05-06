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
const date_histogram_interval_1 = require("./date_histogram_interval");
describe('dateHistogramInterval', () => {
    it('should return calender_interval key for calendar intervals', () => {
        expect(date_histogram_interval_1.dateHistogramInterval('1m')).toEqual({ calendar_interval: '1m' });
        expect(date_histogram_interval_1.dateHistogramInterval('1h')).toEqual({ calendar_interval: '1h' });
        expect(date_histogram_interval_1.dateHistogramInterval('1d')).toEqual({ calendar_interval: '1d' });
        expect(date_histogram_interval_1.dateHistogramInterval('1w')).toEqual({ calendar_interval: '1w' });
        expect(date_histogram_interval_1.dateHistogramInterval('1M')).toEqual({ calendar_interval: '1M' });
        expect(date_histogram_interval_1.dateHistogramInterval('1y')).toEqual({ calendar_interval: '1y' });
    });
    it('should return fixed_interval key for fixed intervals', () => {
        expect(date_histogram_interval_1.dateHistogramInterval('1ms')).toEqual({ fixed_interval: '1ms' });
        expect(date_histogram_interval_1.dateHistogramInterval('42ms')).toEqual({ fixed_interval: '42ms' });
        expect(date_histogram_interval_1.dateHistogramInterval('1s')).toEqual({ fixed_interval: '1s' });
        expect(date_histogram_interval_1.dateHistogramInterval('42s')).toEqual({ fixed_interval: '42s' });
        expect(date_histogram_interval_1.dateHistogramInterval('42m')).toEqual({ fixed_interval: '42m' });
        expect(date_histogram_interval_1.dateHistogramInterval('42h')).toEqual({ fixed_interval: '42h' });
        expect(date_histogram_interval_1.dateHistogramInterval('42d')).toEqual({ fixed_interval: '42d' });
    });
    it('should throw an error on invalid intervals', () => {
        expect(() => date_histogram_interval_1.dateHistogramInterval('2w')).toThrow();
        expect(() => date_histogram_interval_1.dateHistogramInterval('2M')).toThrow();
        expect(() => date_histogram_interval_1.dateHistogramInterval('2y')).toThrow();
        expect(() => date_histogram_interval_1.dateHistogramInterval('2')).toThrow();
        expect(() => date_histogram_interval_1.dateHistogramInterval('y')).toThrow();
        expect(() => date_histogram_interval_1.dateHistogramInterval('0.5h')).toThrow();
    });
});
