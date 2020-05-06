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
jest.mock('./query_params');
jest.mock('./sorting_params');
const saved_objects_type_registry_mock_1 = require("../../../saved_objects_type_registry.mock");
const queryParamsNS = tslib_1.__importStar(require("./query_params"));
const search_dsl_1 = require("./search_dsl");
const sortParamsNS = tslib_1.__importStar(require("./sorting_params"));
const getQueryParams = queryParamsNS.getQueryParams;
const getSortingParams = sortParamsNS.getSortingParams;
const registry = saved_objects_type_registry_mock_1.typeRegistryMock.create();
const mappings = { properties: {} };
describe('getSearchDsl', () => {
    afterEach(() => {
        getQueryParams.mockReset();
        getSortingParams.mockReset();
    });
    describe('validation', () => {
        it('throws when type is not specified', () => {
            expect(() => {
                search_dsl_1.getSearchDsl(mappings, registry, {
                    type: undefined,
                    sortField: 'title',
                });
            }).toThrowError(/type must be specified/);
        });
        it('throws when sortOrder without sortField', () => {
            expect(() => {
                search_dsl_1.getSearchDsl(mappings, registry, {
                    type: 'foo',
                    sortOrder: 'desc',
                });
            }).toThrowError(/sortOrder requires a sortField/);
        });
    });
    describe('passes control', () => {
        it('passes (mappings, schema, namespace, type, search, searchFields, hasReference) to getQueryParams', () => {
            const opts = {
                namespace: 'foo-namespace',
                type: 'foo',
                search: 'bar',
                searchFields: ['baz'],
                defaultSearchOperator: 'AND',
                hasReference: {
                    type: 'bar',
                    id: '1',
                },
            };
            search_dsl_1.getSearchDsl(mappings, registry, opts);
            expect(getQueryParams).toHaveBeenCalledTimes(1);
            expect(getQueryParams).toHaveBeenCalledWith({
                mappings,
                registry,
                namespace: opts.namespace,
                type: opts.type,
                search: opts.search,
                searchFields: opts.searchFields,
                defaultSearchOperator: opts.defaultSearchOperator,
                hasReference: opts.hasReference,
            });
        });
        it('passes (mappings, type, sortField, sortOrder) to getSortingParams', () => {
            getSortingParams.mockReturnValue({});
            const opts = {
                type: 'foo',
                sortField: 'bar',
                sortOrder: 'baz',
            };
            search_dsl_1.getSearchDsl(mappings, registry, opts);
            expect(getSortingParams).toHaveBeenCalledTimes(1);
            expect(getSortingParams).toHaveBeenCalledWith(mappings, opts.type, opts.sortField, opts.sortOrder);
        });
        it('returns combination of getQueryParams and getSortingParams', () => {
            getQueryParams.mockReturnValue({ a: 'a' });
            getSortingParams.mockReturnValue({ b: 'b' });
            expect(search_dsl_1.getSearchDsl(mappings, registry, { type: 'foo' })).toEqual({ a: 'a', b: 'b' });
        });
    });
});
