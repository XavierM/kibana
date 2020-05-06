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
const get_type_1 = require("./get_type");
describe('getType()', () => {
    test('returns "null" string for null or undefined', () => {
        expect(get_type_1.getType(null)).toBe('null');
        expect(get_type_1.getType(undefined)).toBe('null');
    });
    test('returns basic type name', () => {
        expect(get_type_1.getType(0)).toBe('number');
        expect(get_type_1.getType(1)).toBe('number');
        expect(get_type_1.getType(0.8)).toBe('number');
        expect(get_type_1.getType(Infinity)).toBe('number');
        expect(get_type_1.getType(true)).toBe('boolean');
        expect(get_type_1.getType(false)).toBe('boolean');
    });
    test('returns .type property value of objects', () => {
        expect(get_type_1.getType({ type: 'foo' })).toBe('foo');
        expect(get_type_1.getType({ type: 'bar' })).toBe('bar');
    });
    test('throws if object has no .type property', () => {
        expect(() => get_type_1.getType({})).toThrow();
        expect(() => get_type_1.getType({ _type: 'foo' })).toThrow();
        expect(() => get_type_1.getType({ tipe: 'foo' })).toThrow();
    });
});
