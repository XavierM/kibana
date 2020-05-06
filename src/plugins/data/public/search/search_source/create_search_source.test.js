"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const create_search_source_1 = require("./create_search_source");
const mocks_1 = require("../../../../../core/public/mocks");
const mocks_2 = require("../../mocks");
describe('createSearchSource', () => {
    const indexPatternMock = {};
    let indexPatternContractMock;
    let dependencies;
    let createSearchSource;
    beforeEach(() => {
        const core = mocks_1.coreMock.createStart();
        const data = mocks_2.dataPluginMock.createStartContract();
        dependencies = {
            searchService: data.search,
            uiSettings: core.uiSettings,
            injectedMetadata: core.injectedMetadata,
        };
        indexPatternContractMock = {
            get: jest.fn().mockReturnValue(Promise.resolve(indexPatternMock)),
        };
        createSearchSource = create_search_source_1.createSearchSourceFromJSON(indexPatternContractMock, dependencies);
    });
    test('should fail if JSON is invalid', () => {
        expect(createSearchSource('{', [])).rejects.toThrow();
        expect(createSearchSource('0', [])).rejects.toThrow();
        expect(createSearchSource('"abcdefg"', [])).rejects.toThrow();
    });
    test('should set fields', async () => {
        const searchSource = await createSearchSource(JSON.stringify({
            highlightAll: true,
            query: {
                query: '',
                language: 'kuery',
            },
        }), []);
        expect(searchSource.getOwnField('highlightAll')).toBe(true);
        expect(searchSource.getOwnField('query')).toEqual({
            query: '',
            language: 'kuery',
        });
    });
    test('should resolve referenced index pattern', async () => {
        const searchSource = await createSearchSource(JSON.stringify({
            indexRefName: 'kibanaSavedObjectMeta.searchSourceJSON.index',
        }), [
            {
                id: '123-456',
                type: 'index-pattern',
                name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
            },
        ]);
        expect(indexPatternContractMock.get).toHaveBeenCalledWith('123-456');
        expect(searchSource.getOwnField('index')).toBe(indexPatternMock);
    });
    test('should set filters and resolve referenced index patterns', async () => {
        const searchSource = await createSearchSource(JSON.stringify({
            filter: [
                {
                    meta: {
                        alias: null,
                        negate: false,
                        disabled: false,
                        type: 'phrase',
                        key: 'category.keyword',
                        params: {
                            query: "Men's Clothing",
                        },
                        indexRefName: 'kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.index',
                    },
                    query: {
                        match_phrase: {
                            'category.keyword': "Men's Clothing",
                        },
                    },
                    $state: {
                        store: 'appState',
                    },
                },
            ],
        }), [
            {
                id: '123-456',
                type: 'index-pattern',
                name: 'kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.index',
            },
        ]);
        const filters = searchSource.getOwnField('filter');
        expect(filters[0]).toMatchInlineSnapshot(`
      Object {
        "$state": Object {
          "store": "appState",
        },
        "meta": Object {
          "alias": null,
          "disabled": false,
          "index": "123-456",
          "key": "category.keyword",
          "negate": false,
          "params": Object {
            "query": "Men's Clothing",
          },
          "type": "phrase",
        },
        "query": Object {
          "match_phrase": Object {
            "category.keyword": "Men's Clothing",
          },
        },
      }
    `);
    });
    test('should migrate legacy queries on the fly', async () => {
        const searchSource = await createSearchSource(JSON.stringify({
            highlightAll: true,
            query: 'a:b',
        }), []);
        expect(searchSource.getOwnField('query')).toEqual({
            query: 'a:b',
            language: 'lucene',
        });
    });
});
