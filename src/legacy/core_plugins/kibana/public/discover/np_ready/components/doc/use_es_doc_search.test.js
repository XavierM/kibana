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
const react_hooks_1 = require("@testing-library/react-hooks");
const use_es_doc_search_1 = require("./use_es_doc_search");
describe('Test of <Doc /> helper / hook', () => {
    test('buildSearchBody', () => {
        const indexPattern = {
            getComputedFields: () => ({ storedFields: [], scriptFields: [], docvalueFields: [] }),
        };
        const actual = use_es_doc_search_1.buildSearchBody('1', indexPattern);
        expect(actual).toMatchInlineSnapshot(`
      Object {
        "_source": true,
        "docvalue_fields": Array [],
        "query": Object {
          "ids": Object {
            "values": Array [
              "1",
            ],
          },
        },
        "script_fields": Array [],
        "stored_fields": Array [],
      }
    `);
    });
    test('useEsDocSearch', async () => {
        const indexPattern = {
            getComputedFields: () => [],
        };
        const indexPatternService = {
            get: jest.fn(() => Promise.resolve(indexPattern)),
        };
        const props = {
            id: '1',
            index: 'index1',
            esClient: { search: jest.fn(() => new Promise(() => { })) },
            indexPatternId: 'xyz',
            indexPatternService,
        };
        let hook;
        await react_hooks_1.act(async () => {
            hook = react_hooks_1.renderHook((p) => use_es_doc_search_1.useEsDocSearch(p), { initialProps: props });
        });
        // @ts-ignore
        expect(hook.result.current).toEqual([use_es_doc_search_1.ElasticRequestState.Loading, null, indexPattern]);
        expect(indexPatternService.get).toHaveBeenCalled();
    });
});
