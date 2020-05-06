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
const utils_1 = require("./utils");
const kibana_1 = require("../kibana");
describe('interpreter/functions#kibana', () => {
    const fn = utils_1.functionWrapper(kibana_1.kibana);
    let input;
    let search;
    let context;
    beforeEach(() => {
        input = { timeRange: { from: '0', to: '1' } };
        search = {
            type: 'kibana_context',
            query: { language: 'lucene', query: 'geo.src:US' },
            filters: [
                {
                    meta: {
                        disabled: false,
                        negate: false,
                        alias: null,
                    },
                    query: { match: {} },
                },
            ],
            timeRange: { from: '2', to: '3' },
        };
        context = {
            search,
            getInitialInput: () => input,
            types: {},
            variables: {},
            abortSignal: {},
            inspectorAdapters: {},
        };
    });
    it('returns an object with the correct structure', () => {
        const actual = fn(input, {}, context);
        expect(actual).toMatchSnapshot();
    });
    it('uses timeRange from input if not provided in search context', () => {
        search.timeRange = undefined;
        const actual = fn(input, {}, context);
        expect(actual.timeRange).toEqual({ from: '0', to: '1' });
    });
    it('combines filters from input with search context', () => {
        input.filters = [
            {
                meta: {
                    disabled: true,
                    negate: false,
                    alias: null,
                },
                query: { match: {} },
            },
        ];
        const actual = fn(input, {}, context);
        expect(actual.filters).toEqual([
            {
                meta: {
                    disabled: false,
                    negate: false,
                    alias: null,
                },
                query: { match: {} },
            },
            {
                meta: {
                    disabled: true,
                    negate: false,
                    alias: null,
                },
                query: { match: {} },
            },
        ]);
    });
});
