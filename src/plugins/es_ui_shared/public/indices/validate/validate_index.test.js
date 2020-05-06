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
jest.mock('ui/new_platform');
const constants_1 = require("../constants");
const validate_index_1 = require("./validate_index");
describe('Index name validation', () => {
    it('should not allow name to begin with a period', () => {
        const beginsWithPeriod = validate_index_1.indexNameBeginsWithPeriod('.system_index');
        expect(beginsWithPeriod).toBe(true);
    });
    it('should not allow space in the name', () => {
        const containsSpaces = validate_index_1.indexNameContainsSpaces('my name');
        expect(containsSpaces).toBe(true);
    });
    it('should not allow illegal characters', () => {
        constants_1.INDEX_ILLEGAL_CHARACTERS_VISIBLE.forEach(char => {
            const illegalCharacters = validate_index_1.findIllegalCharactersInIndexName(`name${char}`);
            expect(illegalCharacters).toEqual([char]);
        });
    });
});
