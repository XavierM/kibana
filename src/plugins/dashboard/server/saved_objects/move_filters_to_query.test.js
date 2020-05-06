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
const public_1 = require("src/plugins/data/public");
const move_filters_to_query_1 = require("./move_filters_to_query");
const filter = {
    meta: { disabled: false, negate: false, alias: '' },
    query: {},
    $state: { store: public_1.esFilters.FilterStateStore.APP_STATE },
};
const queryFilter = {
    query: { query_string: { query: 'hi!', analyze_wildcard: true } },
};
test('Migrates an old filter query into the query field', () => {
    const newSearchSource = move_filters_to_query_1.moveFiltersToQuery({
        filter: [filter, queryFilter],
    });
    expect(newSearchSource).toEqual({
        filter: [
            {
                $state: { store: public_1.esFilters.FilterStateStore.APP_STATE },
                meta: {
                    alias: '',
                    disabled: false,
                    negate: false,
                },
                query: {},
            },
        ],
        query: {
            language: 'lucene',
            query: 'hi!',
        },
    });
});
test('Preserves query if search source is new', () => {
    const newSearchSource = move_filters_to_query_1.moveFiltersToQuery({
        filter: [filter],
        query: { query: 'bye', language: 'kuery' },
    });
    expect(newSearchSource.query).toEqual({ query: 'bye', language: 'kuery' });
});
