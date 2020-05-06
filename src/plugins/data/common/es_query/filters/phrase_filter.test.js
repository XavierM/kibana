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
const phrase_filter_1 = require("./phrase_filter");
const mocks_1 = require("../../index_patterns/mocks");
describe('Phrase filter builder', () => {
    let indexPattern;
    beforeEach(() => {
        indexPattern = {
            id: 'id',
        };
    });
    it('should be a function', () => {
        expect(typeof phrase_filter_1.buildPhraseFilter).toBe('function');
    });
    it('should return a match query filter when passed a standard field', () => {
        const field = mocks_1.getField('bytes');
        expect(phrase_filter_1.buildPhraseFilter(field, 5, indexPattern)).toEqual({
            meta: {
                index: 'id',
            },
            query: {
                match_phrase: {
                    bytes: 5,
                },
            },
        });
    });
    it('should return a script filter when passed a scripted field', () => {
        const field = mocks_1.getField('script number');
        expect(phrase_filter_1.buildPhraseFilter(field, 5, indexPattern)).toEqual({
            meta: {
                index: 'id',
                field: 'script number',
            },
            script: {
                script: {
                    lang: 'expression',
                    params: {
                        value: 5,
                    },
                    source: '(1234) == value',
                },
            },
        });
    });
});
describe('buildInlineScriptForPhraseFilter', () => {
    it('should wrap painless scripts in a lambda', () => {
        const field = {
            lang: 'painless',
            script: 'return foo;',
        };
        const expected = `boolean compare(Supplier s, def v) {return s.get() == v;}` +
            `compare(() -> { return foo; }, params.value);`;
        expect(phrase_filter_1.buildInlineScriptForPhraseFilter(field)).toBe(expected);
    });
    it('should create a simple comparison for other langs', () => {
        const field = {
            lang: 'expression',
            script: 'doc[bytes].value',
        };
        const expected = `(doc[bytes].value) == value`;
        expect(phrase_filter_1.buildInlineScriptForPhraseFilter(field)).toBe(expected);
    });
});
describe('getPhraseFilterField', function () {
    const indexPattern = {
        fields: mocks_1.fields,
    };
    it('should return the name of the field a phrase query is targeting', () => {
        const field = indexPattern.fields.find(patternField => patternField.name === 'extension');
        const filter = phrase_filter_1.buildPhraseFilter(field, 'jpg', indexPattern);
        const result = phrase_filter_1.getPhraseFilterField(filter);
        expect(result).toBe('extension');
    });
});
