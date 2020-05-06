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
const lodash_1 = require("lodash");
const field_format_1 = require("./field_format");
const utils_1 = require("./utils");
const getTestFormat = (_params, textConvert = (val) => utils_1.asPrettyString(val), htmlConvert) => {
    var _a;
    return new (_a = class TestFormat extends field_format_1.FieldFormat {
            constructor() {
                super(...arguments);
                this.textConvert = textConvert;
                this.htmlConvert = htmlConvert;
            }
        },
        _a.id = 'test-format',
        _a.title = 'Test Format',
        _a)(_params, jest.fn());
};
describe('FieldFormat class', () => {
    describe('params', () => {
        test('accepts its params via the constructor', () => {
            const f = getTestFormat({ foo: 'bar' });
            const fooParam = f.param('foo');
            expect(fooParam).toBe('bar');
        });
        test('allows reading a clone of the params', () => {
            const params = { foo: 'bar' };
            const f = getTestFormat(params);
            const output = f.params();
            expect(output).toEqual(params);
            expect(output).not.toBe(params);
        });
    });
    describe('type', () => {
        test('links the constructor class to instances as the `type`', () => {
            const f = getTestFormat();
            expect(lodash_1.get(f.type, 'id')).toBe('test-format');
            expect(lodash_1.get(f.type, 'title')).toBe('Test Format');
        });
    });
    describe('toJSON', () => {
        test('serializes to a version a basic id and param pair', () => {
            const f = getTestFormat({ foo: 'bar' });
            const ser = JSON.parse(JSON.stringify(f));
            expect(ser).toEqual({ id: 'test-format', params: { foo: 'bar' } });
        });
        test('removes the params entirely if they are empty', () => {
            const f = getTestFormat();
            const ser = JSON.parse(JSON.stringify(f));
            expect(ser).not.toHaveProperty('params');
        });
    });
    describe('converters', () => {
        describe('#getConverterFor', () => {
            test('returns a converter for a specific content type', () => {
                const f = getTestFormat();
                const htmlConverter = f.getConverterFor('html');
                const textConverter = f.getConverterFor('text');
                expect(htmlConverter && typeof htmlConverter('')).toBe('string');
                expect(textConverter && typeof textConverter('')).toBe('string');
            });
        });
        describe('#_convert, the instance method or methods used to format values', () => {
            test('can be a function, which gets converted to a text and html converter', () => {
                const f = getTestFormat(undefined, () => 'formatted');
                const text = f.getConverterFor('text');
                const html = f.getConverterFor('html');
                expect(text).not.toBe(html);
                expect(text && text('formatted')).toBe('formatted');
                expect(html && html('formatted')).toBe('<span ng-non-bindable>formatted</span>');
            });
            test('can be an object, with separate text and html converter', () => {
                const f = getTestFormat(undefined, lodash_1.constant('formatted text'), lodash_1.constant('formatted html'));
                const text = f.getConverterFor('text');
                const html = f.getConverterFor('html');
                expect(text).not.toBe(html);
                expect(text && text('formatted text')).toBe('formatted text');
                expect(html && html('formatted html')).toBe('<span ng-non-bindable>formatted html</span>');
            });
            test('does not escape the output of the text converter', () => {
                const f = getTestFormat(undefined, lodash_1.constant('<script>alert("xxs");</script>'));
                expect(f.convert('', 'text')).toContain('<');
            });
            test('does escape the output of the text converter if used in an html context', () => {
                const f = getTestFormat(undefined, lodash_1.constant('<script>alert("xxs");</script>'));
                const expected = lodash_1.trimRight(lodash_1.trimLeft(f.convert('', 'html'), '<span ng-non-bindable>'), '</span>');
                expect(expected).not.toContain('<');
            });
            test('does not escape the output of an html specific converter', () => {
                const f = getTestFormat(undefined, lodash_1.constant('<img>'), lodash_1.constant('<img>'));
                expect(f.convert('', 'text')).toBe('<img>');
                expect(f.convert('', 'html')).toBe('<span ng-non-bindable><img></span>');
            });
        });
        describe('#convert', () => {
            test('formats a value, defaulting to text content type', () => {
                const f = getTestFormat(undefined, lodash_1.constant('text'), lodash_1.constant('html'));
                expect(f.convert('val')).toBe('text');
            });
            test('formats a value as html, when specified via second param', () => {
                const f = getTestFormat(undefined, lodash_1.constant('text'), lodash_1.constant('html'));
                expect(f.convert('val', 'html')).toBe('<span ng-non-bindable>html</span>');
            });
            test('formats a value as " - " when no value is specified', () => {
                const f = getTestFormat();
                expect(f.convert(undefined)).toBe(' - ');
            });
            test('formats a list of values as text', () => {
                const f = getTestFormat();
                expect(f.convert(['one', 'two', 'three'])).toBe('["one","two","three"]');
            });
        });
    });
});
