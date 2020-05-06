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
// eslint-disable-next-line max-classes-per-file
const merge_1 = require("./merge");
describe('merge', () => {
    test('empty objects', () => expect(merge_1.merge({}, {})).toEqual({}));
    test('basic', () => {
        expect(merge_1.merge({}, { a: 1 })).toEqual({ a: 1 });
        expect(merge_1.merge({ a: 0 }, {})).toEqual({ a: 0 });
        expect(merge_1.merge({ a: 0 }, { a: 1 })).toEqual({ a: 1 });
    });
    test('undefined', () => {
        expect(merge_1.merge({ a: undefined }, { a: 1 })).toEqual({ a: 1 });
        expect(merge_1.merge({ a: 0 }, { a: undefined })).toEqual({ a: 0 });
        expect(merge_1.merge({ a: undefined }, { a: undefined })).toEqual({});
        expect(merge_1.merge({ a: void 0 }, { a: void 0 })).toEqual({});
    });
    test('null', () => {
        expect(merge_1.merge({ a: null }, { a: 1 })).toEqual({ a: 1 });
        expect(merge_1.merge({ a: 0 }, { a: null })).toEqual({ a: null });
        expect(merge_1.merge({ a: null }, { a: null })).toEqual({ a: null });
    });
    test('arrays', () => {
        expect(merge_1.merge({ b: [0] }, { b: [2] })).toEqual({ b: [2] });
        expect(merge_1.merge({ b: [0, 1] }, { b: [2] })).toEqual({ b: [2] });
        expect(merge_1.merge({ b: [0] }, { b: [2, 3] })).toEqual({ b: [2, 3] });
        expect(merge_1.merge({ b: [] }, { b: [2] })).toEqual({ b: [2] });
        expect(merge_1.merge({ b: [0] }, { b: [] })).toEqual({ b: [] });
    });
    test('nested objects', () => {
        expect(merge_1.merge({ top: { a: 0, b: 0 } }, { top: { a: 1, c: 1 } })).toEqual({
            top: { a: 1, b: 0, c: 1 },
        });
        expect(merge_1.merge({ top: { a: 0, b: 0 } }, { top: [0, 1] })).toEqual({ top: [0, 1] });
    });
    test('multiple objects', () => {
        expect(merge_1.merge({}, { a: 1 }, { a: 2 })).toEqual({ a: 2 });
        expect(merge_1.merge({ a: 0 }, {}, {})).toEqual({ a: 0 });
        expect(merge_1.merge({ a: 0 }, { a: 1 }, {})).toEqual({ a: 1 });
    });
    test('does not merge class instances', () => {
        class Folder {
            constructor(path) {
                this.path = path;
            }
            getPath() {
                return this.path;
            }
        }
        class File {
            constructor(content) {
                this.content = content;
            }
            getContent() {
                return this.content;
            }
        }
        const folder = new Folder('/etc');
        const file = new File('yolo');
        const result = merge_1.merge({}, { content: folder }, { content: file });
        expect(result).toStrictEqual({
            content: file,
        });
        expect(result.content.getContent()).toBe('yolo');
    });
    test(`doesn't pollute prototypes`, () => {
        merge_1.merge({}, JSON.parse('{ "__proto__": { "foo": "bar" } }'));
        merge_1.merge({}, JSON.parse('{ "constructor": { "prototype": { "foo": "bar" } } }'));
        merge_1.merge({}, JSON.parse('{ "__proto__": { "foo": "bar" } }'), JSON.parse('{ "constructor": { "prototype": { "foo": "bar" } } }'));
        expect({}.foo).toBe(undefined);
    });
});
