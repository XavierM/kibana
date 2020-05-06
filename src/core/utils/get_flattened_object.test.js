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
const get_flattened_object_1 = require("./get_flattened_object");
describe('getFlattenedObject()', () => {
    it('throws when rootValue is not an object or is an array', () => {
        expect(() => get_flattened_object_1.getFlattenedObject(1)).toThrowError();
        expect(() => get_flattened_object_1.getFlattenedObject(Infinity)).toThrowError();
        expect(() => get_flattened_object_1.getFlattenedObject(NaN)).toThrowError();
        expect(() => get_flattened_object_1.getFlattenedObject(false)).toThrowError();
        expect(() => get_flattened_object_1.getFlattenedObject(null)).toThrowError();
        expect(() => get_flattened_object_1.getFlattenedObject(undefined)).toThrowError();
        expect(() => get_flattened_object_1.getFlattenedObject([])).toThrowError();
    });
    it('flattens objects', () => {
        expect(get_flattened_object_1.getFlattenedObject({ a: 'b' })).toEqual({ a: 'b' });
        expect(get_flattened_object_1.getFlattenedObject({ a: { b: 'c' } })).toEqual({ 'a.b': 'c' });
        expect(get_flattened_object_1.getFlattenedObject({ a: { b: 'c' }, d: { e: 'f' } })).toEqual({
            'a.b': 'c',
            'd.e': 'f',
        });
    });
    it('does not flatten arrays', () => {
        expect(get_flattened_object_1.getFlattenedObject({ a: ['b'] })).toEqual({ a: ['b'] });
        expect(get_flattened_object_1.getFlattenedObject({ a: { b: ['c', 'd'] } })).toEqual({ 'a.b': ['c', 'd'] });
    });
});
