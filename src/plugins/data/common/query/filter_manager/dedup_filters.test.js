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
const dedup_filters_1 = require("./dedup_filters");
const es_query_1 = require("../../es_query");
describe('filter manager utilities', () => {
    let indexPattern;
    beforeEach(() => {
        indexPattern = {
            id: 'index',
        };
    });
    describe('dedupFilters(existing, filters)', () => {
        test('should return only filters which are not in the existing', () => {
            const existing = [
                es_query_1.buildRangeFilter({ name: 'bytes' }, { from: 0, to: 1024 }, indexPattern, ''),
                es_query_1.buildQueryFilter({ match: { _term: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            ];
            const filters = [
                es_query_1.buildRangeFilter({ name: 'bytes' }, { from: 1024, to: 2048 }, indexPattern, ''),
                es_query_1.buildQueryFilter({ match: { _term: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            ];
            const results = dedup_filters_1.dedupFilters(existing, filters);
            expect(results).toContain(filters[0]);
            expect(results).not.toContain(filters[1]);
        });
        test('should ignore the disabled attribute when comparing ', () => {
            const existing = [
                es_query_1.buildRangeFilter({ name: 'bytes' }, { from: 0, to: 1024 }, indexPattern, ''),
                {
                    ...es_query_1.buildQueryFilter({ match: { _term: { query: 'apache', type: 'phrase' } } }, 'index1', ''),
                    meta: { disabled: true, negate: false, alias: null },
                },
            ];
            const filters = [
                es_query_1.buildRangeFilter({ name: 'bytes' }, { from: 1024, to: 2048 }, indexPattern, ''),
                es_query_1.buildQueryFilter({ match: { _term: { query: 'apache', type: 'phrase' } } }, 'index1', ''),
            ];
            const results = dedup_filters_1.dedupFilters(existing, filters);
            expect(results).toContain(filters[0]);
            expect(results).not.toContain(filters[1]);
        });
        test('should ignore $state attribute', () => {
            const existing = [
                es_query_1.buildRangeFilter({ name: 'bytes' }, { from: 0, to: 1024 }, indexPattern, ''),
                {
                    ...es_query_1.buildQueryFilter({ match: { _term: { query: 'apache', type: 'phrase' } } }, 'index', ''),
                    $state: { store: es_query_1.FilterStateStore.APP_STATE },
                },
            ];
            const filters = [
                es_query_1.buildRangeFilter({ name: 'bytes' }, { from: 1024, to: 2048 }, indexPattern, ''),
                {
                    ...es_query_1.buildQueryFilter({ match: { _term: { query: 'apache', type: 'phrase' } } }, 'index', ''),
                    $state: { store: es_query_1.FilterStateStore.GLOBAL_STATE },
                },
            ];
            const results = dedup_filters_1.dedupFilters(existing, filters);
            expect(results).toContain(filters[0]);
            expect(results).not.toContain(filters[1]);
        });
    });
});
