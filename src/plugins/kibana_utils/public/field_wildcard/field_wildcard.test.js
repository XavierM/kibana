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
const field_wildcard_1 = require("./field_wildcard");
describe('fieldWildcard', () => {
    const metaFields = ['_id', '_type', '_source'];
    describe('makeRegEx', function () {
        it('matches * in any position', function () {
            expect('aaaaaabbbbbbbcccccc').toMatch(field_wildcard_1.makeRegEx('*a*b*c*'));
            expect('a1234').toMatch(field_wildcard_1.makeRegEx('*1234'));
            expect('1234a').toMatch(field_wildcard_1.makeRegEx('1234*'));
            expect('12a34').toMatch(field_wildcard_1.makeRegEx('12a34'));
        });
        it('properly escapes regexp control characters', function () {
            expect('account[user_id]').toMatch(field_wildcard_1.makeRegEx('account[*]'));
        });
        it('properly limits matches without wildcards', function () {
            expect('username').toMatch(field_wildcard_1.makeRegEx('*name'));
            expect('username').toMatch(field_wildcard_1.makeRegEx('user*'));
            expect('username').toMatch(field_wildcard_1.makeRegEx('username'));
            expect('username').not.toMatch(field_wildcard_1.makeRegEx('user'));
            expect('username').not.toMatch(field_wildcard_1.makeRegEx('name'));
            expect('username').not.toMatch(field_wildcard_1.makeRegEx('erna'));
        });
    });
    describe('filter', function () {
        it('filters nothing when given undefined', function () {
            const filter = field_wildcard_1.fieldWildcardFilter();
            const original = ['foo', 'bar', 'baz', 1234];
            expect(original.filter(val => filter(val))).toEqual(original);
        });
        it('filters nothing when given an empty array', function () {
            const filter = field_wildcard_1.fieldWildcardFilter([], metaFields);
            const original = ['foo', 'bar', 'baz', 1234];
            expect(original.filter(filter)).toEqual(original);
        });
        it('does not filter metaFields', function () {
            const filter = field_wildcard_1.fieldWildcardFilter(['_*'], metaFields);
            const original = ['_id', '_type', '_typefake'];
            expect(original.filter(filter)).toEqual(['_id', '_type']);
        });
        it('filters values that match the globs', function () {
            const filter = field_wildcard_1.fieldWildcardFilter(['f*', '*4'], metaFields);
            const original = ['foo', 'bar', 'baz', 1234];
            expect(original.filter(filter)).toEqual(['bar', 'baz']);
        });
        it('handles weird values okay', function () {
            const filter = field_wildcard_1.fieldWildcardFilter(['f*', '*4', 'undefined'], metaFields);
            const original = ['foo', null, 'bar', undefined, {}, [], 'baz', 1234];
            expect(original.filter(filter)).toEqual([null, 'bar', {}, [], 'baz']);
        });
    });
});
