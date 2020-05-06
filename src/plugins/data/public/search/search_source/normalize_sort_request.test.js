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
const normalize_sort_request_1 = require("./normalize_sort_request");
const types_1 = require("./types");
describe('SearchSource#normalizeSortRequest', function () {
    const scriptedField = {
        name: 'script string',
        type: 'number',
        scripted: true,
        sortable: true,
        script: 'foo',
        lang: 'painless',
    };
    const murmurScriptedField = {
        ...scriptedField,
        sortable: false,
        name: 'murmur script',
        type: 'murmur3',
    };
    const indexPattern = {
        fields: [scriptedField, murmurScriptedField],
    };
    it('should return an array', function () {
        const sortable = { someField: types_1.SortDirection.desc };
        const result = normalize_sort_request_1.normalizeSortRequest(sortable, indexPattern);
        expect(result).toEqual([
            {
                someField: {
                    order: types_1.SortDirection.desc,
                },
            },
        ]);
        // ensure object passed in is not mutated
        expect(result[0]).not.toBe(sortable);
        expect(sortable).toEqual({ someField: types_1.SortDirection.desc });
    });
    it('should make plain string sort into the more verbose format', function () {
        const result = normalize_sort_request_1.normalizeSortRequest([{ someField: types_1.SortDirection.desc }], indexPattern);
        expect(result).toEqual([
            {
                someField: {
                    order: types_1.SortDirection.desc,
                },
            },
        ]);
    });
    it('should append default sort options', function () {
        const defaultSortOptions = {
            unmapped_type: 'boolean',
        };
        const result = normalize_sort_request_1.normalizeSortRequest([{ someField: types_1.SortDirection.desc }], indexPattern, defaultSortOptions);
        expect(result).toEqual([
            {
                someField: {
                    order: types_1.SortDirection.desc,
                    ...defaultSortOptions,
                },
            },
        ]);
    });
    it('should enable script based sorting', function () {
        const result = normalize_sort_request_1.normalizeSortRequest({
            [scriptedField.name]: types_1.SortDirection.desc,
        }, indexPattern);
        expect(result).toEqual([
            {
                _script: {
                    script: {
                        source: scriptedField.script,
                        lang: scriptedField.lang,
                    },
                    type: scriptedField.type,
                    order: types_1.SortDirection.desc,
                },
            },
        ]);
    });
    it('should use script based sorting only on sortable types', function () {
        const result = normalize_sort_request_1.normalizeSortRequest([
            {
                [murmurScriptedField.name]: types_1.SortDirection.asc,
            },
        ], indexPattern);
        expect(result).toEqual([
            {
                [murmurScriptedField.name]: {
                    order: types_1.SortDirection.asc,
                },
            },
        ]);
    });
    it('should remove unmapped_type parameter from _score sorting', function () {
        const result = normalize_sort_request_1.normalizeSortRequest({ _score: types_1.SortDirection.desc }, indexPattern, {
            unmapped_type: 'boolean',
        });
        expect(result).toEqual([
            {
                _score: {
                    order: types_1.SortDirection.desc,
                },
            },
        ]);
    });
});
