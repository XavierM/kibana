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
const sort_filters_1 = require("./sort_filters");
const common_1 = require("../../../../common");
describe('sortFilters', () => {
    describe('sortFilters()', () => {
        test('Not sort two application level filters', () => {
            const f1 = {
                $state: { store: common_1.FilterStateStore.APP_STATE },
                ...common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            };
            const f2 = {
                $state: { store: common_1.FilterStateStore.APP_STATE },
                ...common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            };
            const filters = [f1, f2].sort(sort_filters_1.sortFilters);
            expect(filters[0]).toBe(f1);
        });
        test('Not sort two global level filters', () => {
            const f1 = {
                $state: { store: common_1.FilterStateStore.GLOBAL_STATE },
                ...common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            };
            const f2 = {
                $state: { store: common_1.FilterStateStore.GLOBAL_STATE },
                ...common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            };
            const filters = [f1, f2].sort(sort_filters_1.sortFilters);
            expect(filters[0]).toBe(f1);
        });
        test('Move global level filter to the beginning of the array', () => {
            const f1 = {
                $state: { store: common_1.FilterStateStore.APP_STATE },
                ...common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            };
            const f2 = {
                $state: { store: common_1.FilterStateStore.GLOBAL_STATE },
                ...common_1.buildQueryFilter({ _type: { match: { query: 'apache', type: 'phrase' } } }, 'index', ''),
            };
            const filters = [f1, f2].sort(sort_filters_1.sortFilters);
            expect(filters[0]).toBe(f2);
        });
    });
});
