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
const color_1 = require("./color");
const content_types_1 = require("../content_types");
describe('Color Format', () => {
    describe('field is a number', () => {
        test('should add colors if the value is in range', () => {
            const colorer = new color_1.ColorFormat({
                fieldType: 'number',
                colors: [
                    {
                        range: '100:150',
                        text: 'blue',
                        background: 'yellow',
                    },
                ],
            }, jest.fn());
            expect(colorer.convert(99, content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>99</span>');
            expect(colorer.convert(100, content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable><span style="color: blue;background-color: yellow;">100</span></span>');
            expect(colorer.convert(150, content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable><span style="color: blue;background-color: yellow;">150</span></span>');
            expect(colorer.convert(151, content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>151</span>');
        });
        test('should not convert invalid ranges', () => {
            const colorer = new color_1.ColorFormat({
                fieldType: 'number',
                colors: [
                    {
                        range: '100150',
                        text: 'blue',
                        background: 'yellow',
                    },
                ],
            }, jest.fn());
            expect(colorer.convert(99, content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>99</span>');
        });
    });
    describe('field is a string', () => {
        test('should add colors if the regex matches', () => {
            const colorer = new color_1.ColorFormat({
                fieldType: 'string',
                colors: [
                    {
                        regex: 'A.*',
                        text: 'blue',
                        background: 'yellow',
                    },
                ],
            }, jest.fn());
            const converter = colorer.getConverterFor(content_types_1.HTML_CONTEXT_TYPE);
            expect(converter('B', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>B</span>');
            expect(converter('AAA', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable><span style="color: blue;background-color: yellow;">AAA</span></span>');
            expect(converter('AB', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable><span style="color: blue;background-color: yellow;">AB</span></span>');
            expect(converter('a', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>a</span>');
            expect(converter('B', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>B</span>');
            expect(converter('AAA', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable><span style="color: blue;background-color: yellow;">AAA</span></span>');
            expect(converter('AB', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable><span style="color: blue;background-color: yellow;">AB</span></span>');
            expect(converter('AB <', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable><span style="color: blue;background-color: yellow;">AB &lt;</span></span>');
            expect(converter('a', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>a</span>');
        });
        test('returns original value (escaped) when regex is invalid', () => {
            const colorer = new color_1.ColorFormat({
                fieldType: 'string',
                colors: [
                    {
                        regex: 'A.*',
                        text: 'blue',
                        background: 'yellow',
                    },
                ],
            }, jest.fn());
            const converter = colorer.getConverterFor(content_types_1.HTML_CONTEXT_TYPE);
            expect(converter('<', content_types_1.HTML_CONTEXT_TYPE)).toBe('<span ng-non-bindable>&lt;</span>');
        });
    });
});
