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
const comma_separated_list_1 = require("./comma_separated_list");
describe('utils parseCommaSeparatedList()', () => {
    test('supports non-string values', () => {
        expect(comma_separated_list_1.parseCommaSeparatedList(0)).toEqual([]);
        expect(comma_separated_list_1.parseCommaSeparatedList(1)).toEqual(['1']);
        expect(comma_separated_list_1.parseCommaSeparatedList({})).toEqual(['[object Object]']);
        expect(comma_separated_list_1.parseCommaSeparatedList(() => { })).toEqual(['() => {}']);
        expect(comma_separated_list_1.parseCommaSeparatedList((a, b) => b)).toEqual(['(a', 'b) => b']);
        expect(comma_separated_list_1.parseCommaSeparatedList(/foo/)).toEqual(['/foo/']);
        expect(comma_separated_list_1.parseCommaSeparatedList(null)).toEqual([]);
        expect(comma_separated_list_1.parseCommaSeparatedList(undefined)).toEqual([]);
        expect(comma_separated_list_1.parseCommaSeparatedList(false)).toEqual([]);
        expect(comma_separated_list_1.parseCommaSeparatedList(true)).toEqual(['true']);
    });
    test('returns argument untouched if it is an array', () => {
        const inputs = [[], [1], ['foo,bar']];
        for (const input of inputs) {
            const json = JSON.stringify(input);
            expect(comma_separated_list_1.parseCommaSeparatedList(input)).toBe(input);
            expect(json).toBe(JSON.stringify(input));
        }
    });
    test('trims whitespace around elements', () => {
        expect(comma_separated_list_1.parseCommaSeparatedList('1 ,    2,    3     ,    4')).toEqual(['1', '2', '3', '4']);
    });
    test('ignored empty elements between multiple commas', () => {
        expect(comma_separated_list_1.parseCommaSeparatedList('foo , , ,,,,, ,      ,bar')).toEqual(['foo', 'bar']);
    });
});
