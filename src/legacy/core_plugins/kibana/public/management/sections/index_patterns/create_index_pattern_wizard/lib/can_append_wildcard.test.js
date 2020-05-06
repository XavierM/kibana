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
const can_append_wildcard_1 = require("./can_append_wildcard");
describe('canAppendWildcard', () => {
    test('ignores symbols', () => {
        expect(can_append_wildcard_1.canAppendWildcard('%')).toBeFalsy();
    });
    test('accepts numbers', () => {
        expect(can_append_wildcard_1.canAppendWildcard('1')).toBeTruthy();
    });
    test('accepts letters', () => {
        expect(can_append_wildcard_1.canAppendWildcard('b')).toBeTruthy();
    });
    test('accepts uppercase letters', () => {
        expect(can_append_wildcard_1.canAppendWildcard('B')).toBeTruthy();
    });
    test('ignores if more than one key pressed', () => {
        expect(can_append_wildcard_1.canAppendWildcard('ab')).toBeFalsy();
    });
});
