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
const extract_time_filter_1 = require("./extract_time_filter");
const common_1 = require("../../../../common");
describe('filter manager utilities', () => {
    let indexPattern;
    beforeEach(() => {
        indexPattern = {
            id: 'logstash-*',
        };
    });
    describe('extractTimeFilter()', () => {
        test('should detect timeFilter', async () => {
            const filters = [
                common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'logstash-*', ''),
                common_1.buildRangeFilter({ name: 'time' }, { gt: 1388559600000, lt: 1388646000000 }, indexPattern),
            ];
            const result = await extract_time_filter_1.extractTimeFilter('time', filters);
            expect(result.timeRangeFilter).toEqual(filters[1]);
            expect(result.restOfFilters[0]).toEqual(filters[0]);
        });
        test("should not return timeFilter when name doesn't match", async () => {
            const filters = [
                common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'logstash-*', ''),
                common_1.buildRangeFilter({ name: '@timestamp' }, { from: 1, to: 2 }, indexPattern, ''),
            ];
            const result = await extract_time_filter_1.extractTimeFilter('time', filters);
            expect(result.timeRangeFilter).toBeUndefined();
            expect(result.restOfFilters).toEqual(filters);
        });
        test('should not return a non range filter, even when names match', async () => {
            const filters = [
                common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'logstash-*', ''),
                common_1.buildPhraseFilter({ name: 'time' }, 'banana', indexPattern),
            ];
            const result = await extract_time_filter_1.extractTimeFilter('time', filters);
            expect(result.timeRangeFilter).toBeUndefined();
            expect(result.restOfFilters).toEqual(filters);
        });
    });
});
