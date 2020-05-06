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
const get_sort_1 = require("./get_sort");
// @ts-ignore
const stubbed_logstash_index_pattern_1 = tslib_1.__importDefault(require("fixtures/stubbed_logstash_index_pattern"));
describe('docTable', function () {
    let indexPattern;
    beforeEach(() => {
        indexPattern = stubbed_logstash_index_pattern_1.default();
    });
    describe('getSort function', function () {
        test('should be a function', function () {
            expect(typeof get_sort_1.getSort === 'function').toBeTruthy();
        });
        test('should return an array of objects', function () {
            expect(get_sort_1.getSort([['bytes', 'desc']], indexPattern)).toEqual([{ bytes: 'desc' }]);
            delete indexPattern.timeFieldName;
            expect(get_sort_1.getSort([['bytes', 'desc']], indexPattern)).toEqual([{ bytes: 'desc' }]);
        });
        test('should passthrough arrays of objects', () => {
            expect(get_sort_1.getSort([{ bytes: 'desc' }], indexPattern)).toEqual([{ bytes: 'desc' }]);
        });
        test('should return an empty array when passed an unsortable field', function () {
            expect(get_sort_1.getSort([['non-sortable', 'asc']], indexPattern)).toEqual([]);
            expect(get_sort_1.getSort([['lol_nope', 'asc']], indexPattern)).toEqual([]);
            delete indexPattern.timeFieldName;
            expect(get_sort_1.getSort([['non-sortable', 'asc']], indexPattern)).toEqual([]);
        });
        test('should return an empty array ', function () {
            expect(get_sort_1.getSort([], indexPattern)).toEqual([]);
            expect(get_sort_1.getSort([['foo', 'bar']], indexPattern)).toEqual([]);
            expect(get_sort_1.getSort([{ foo: 'bar' }], indexPattern)).toEqual([]);
        });
    });
    describe('getSortArray function', function () {
        test('should have an array method', function () {
            expect(get_sort_1.getSortArray).toBeInstanceOf(Function);
        });
        test('should return an array of arrays for sortable fields', function () {
            expect(get_sort_1.getSortArray([['bytes', 'desc']], indexPattern)).toEqual([['bytes', 'desc']]);
        });
        test('should return an array of arrays from an array of elasticsearch sort objects', function () {
            expect(get_sort_1.getSortArray([{ bytes: 'desc' }], indexPattern)).toEqual([['bytes', 'desc']]);
        });
        test('should sort by an empty array when an unsortable field is given', function () {
            expect(get_sort_1.getSortArray([{ 'non-sortable': 'asc' }], indexPattern)).toEqual([]);
            expect(get_sort_1.getSortArray([{ lol_nope: 'asc' }], indexPattern)).toEqual([]);
            delete indexPattern.timeFieldName;
            expect(get_sort_1.getSortArray([{ 'non-sortable': 'asc' }], indexPattern)).toEqual([]);
        });
        test('should return an empty array when passed an empty sort array', () => {
            expect(get_sort_1.getSortArray([], indexPattern)).toEqual([]);
            delete indexPattern.timeFieldName;
            expect(get_sort_1.getSortArray([], indexPattern)).toEqual([]);
        });
    });
});
