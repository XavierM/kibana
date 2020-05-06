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
const is_camel_case_1 = require("./is_camel_case");
describe('isCamelCase', () => {
    it('matches a string in camelCase', () => {
        expect(is_camel_case_1.isCamelCase('foo')).toBe(true);
        expect(is_camel_case_1.isCamelCase('foo1')).toBe(true);
        expect(is_camel_case_1.isCamelCase('fooBar')).toBe(true);
        expect(is_camel_case_1.isCamelCase('fooBarBaz')).toBe(true);
        expect(is_camel_case_1.isCamelCase('fooBAR')).toBe(true);
    });
    it('does not match strings in other cases', () => {
        expect(is_camel_case_1.isCamelCase('AAA')).toBe(false);
        expect(is_camel_case_1.isCamelCase('FooBar')).toBe(false);
        expect(is_camel_case_1.isCamelCase('3Foo')).toBe(false);
        expect(is_camel_case_1.isCamelCase('o_O')).toBe(false);
        expect(is_camel_case_1.isCamelCase('foo_bar')).toBe(false);
        expect(is_camel_case_1.isCamelCase('foo_')).toBe(false);
        expect(is_camel_case_1.isCamelCase('_fooBar')).toBe(false);
        expect(is_camel_case_1.isCamelCase('fooBar_')).toBe(false);
        expect(is_camel_case_1.isCamelCase('_fooBar_')).toBe(false);
    });
});
