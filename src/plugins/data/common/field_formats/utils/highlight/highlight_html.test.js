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
const highlight_tags_1 = require("./highlight_tags");
const html_tags_1 = require("./html_tags");
const highlight_html_1 = require("./highlight_html");
describe('getHighlightHtml', function () {
    const text = '' +
        'Bacon ipsum dolor amet pork loin pork cow pig beef chuck ground round shankle sirloin landjaeger kevin ' +
        'venison sausage ribeye tongue. Chicken bacon ball tip pork. Brisket pork capicola spare ribs pastrami rump ' +
        'sirloin, t-bone ham shoulder jerky turducken bresaola. Chicken cow beef picanha. Picanha hamburger alcatra ' +
        'cupim. Salami capicola boudin pork belly shank picanha.';
    test('should not modify text if highlight is empty', function () {
        expect(highlight_html_1.getHighlightHtml(text, undefined)).toBe(text);
        expect(highlight_html_1.getHighlightHtml(text, null)).toBe(text);
        expect(highlight_html_1.getHighlightHtml(text, [])).toBe(text);
    });
    test('should preserve escaped text', function () {
        const highlights = ['<foo>'];
        const result = highlight_html_1.getHighlightHtml('&lt;foo&gt;', highlights);
        expect(result.indexOf('<foo>')).toBe(-1);
        expect(result.indexOf('&lt;foo&gt;')).toBeGreaterThan(-1);
    });
    test('should highlight a single result', function () {
        const highlights = [
            highlight_tags_1.highlightTags.pre +
                'hamburger' +
                highlight_tags_1.highlightTags.post +
                ' alcatra cupim. Salami capicola boudin pork belly shank picanha.',
        ];
        const result = highlight_html_1.getHighlightHtml(text, highlights);
        expect(result.indexOf(html_tags_1.htmlTags.pre + 'hamburger' + html_tags_1.htmlTags.post)).toBeGreaterThan(-1);
        expect(result.split(html_tags_1.htmlTags.pre + 'hamburger' + html_tags_1.htmlTags.post).length).toBe(text.split('hamburger').length);
    });
    test('should highlight multiple results', function () {
        const highlights = [
            'kevin venison sausage ribeye tongue. ' +
                highlight_tags_1.highlightTags.pre +
                'Chicken' +
                highlight_tags_1.highlightTags.post +
                ' bacon ball tip pork. Brisket ' +
                'pork capicola spare ribs pastrami rump sirloin, t-bone ham shoulder jerky turducken bresaola. ' +
                highlight_tags_1.highlightTags.pre +
                'Chicken' +
                highlight_tags_1.highlightTags.post +
                ' cow beef picanha. Picanha',
        ];
        const result = highlight_html_1.getHighlightHtml(text, highlights);
        expect(result.indexOf(html_tags_1.htmlTags.pre + 'Chicken' + html_tags_1.htmlTags.post)).toBeGreaterThan(-1);
        expect(result.split(html_tags_1.htmlTags.pre + 'Chicken' + html_tags_1.htmlTags.post).length).toBe(text.split('Chicken').length);
    });
    test('should highlight multiple hits in a result', function () {
        const highlights = [
            'Bacon ipsum dolor amet ' +
                highlight_tags_1.highlightTags.pre +
                'pork' +
                highlight_tags_1.highlightTags.post +
                ' loin ' +
                '' +
                highlight_tags_1.highlightTags.pre +
                'pork' +
                highlight_tags_1.highlightTags.post +
                ' cow pig beef chuck ground round shankle ' +
                'sirloin landjaeger',
            'kevin venison sausage ribeye tongue. Chicken bacon ball tip ' +
                '' +
                highlight_tags_1.highlightTags.pre +
                'pork' +
                highlight_tags_1.highlightTags.post +
                '. Brisket ' +
                '' +
                highlight_tags_1.highlightTags.pre +
                'pork' +
                highlight_tags_1.highlightTags.post +
                ' capicola spare ribs',
            'hamburger alcatra cupim. Salami capicola boudin ' +
                highlight_tags_1.highlightTags.pre +
                'pork' +
                highlight_tags_1.highlightTags.post +
                ' ' +
                'belly shank picanha.',
        ];
        const result = highlight_html_1.getHighlightHtml(text, highlights);
        expect(result.indexOf(html_tags_1.htmlTags.pre + 'pork' + html_tags_1.htmlTags.post)).toBeGreaterThan(-1);
        expect(result.split(html_tags_1.htmlTags.pre + 'pork' + html_tags_1.htmlTags.post).length).toBe(text.split('pork').length);
    });
    test('should accept an object and return a string containing its properties', function () {
        const obj = { foo: 1, bar: 2 };
        const result = highlight_html_1.getHighlightHtml(obj, null);
        expect(result.indexOf('' + obj)).toBe(-1);
        expect(result.indexOf('foo')).toBeGreaterThan(-1);
        expect(result.indexOf('bar')).toBeGreaterThan(-1);
    });
});
