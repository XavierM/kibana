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
const mocks_1 = require("../../../../index_patterns/mocks");
const index_1 = require("../../index");
// @ts-ignore
const get_fields_1 = require("./get_fields");
describe('getFields', () => {
    let indexPattern;
    beforeEach(() => {
        indexPattern = {
            fields: mocks_1.fields,
        };
    });
    describe('field names without a wildcard', () => {
        test('should return an empty array if the field does not exist in the index pattern', () => {
            const fieldNameNode = index_1.nodeTypes.literal.buildNode('nonExistentField');
            const actual = get_fields_1.getFields(fieldNameNode, indexPattern);
            expect(actual).toEqual([]);
        });
        test('should return the single matching field in an array', () => {
            const fieldNameNode = index_1.nodeTypes.literal.buildNode('extension');
            const results = get_fields_1.getFields(fieldNameNode, indexPattern);
            expect(results).toHaveLength(1);
            expect(Array.isArray(results)).toBeTruthy();
            expect(results[0].name).toBe('extension');
        });
        test('should not match a wildcard in a literal node', () => {
            const indexPatternWithWildField = {
                title: 'wildIndex',
                fields: [
                    {
                        name: 'foo*',
                    },
                ],
            };
            const fieldNameNode = index_1.nodeTypes.literal.buildNode('foo*');
            const results = get_fields_1.getFields(fieldNameNode, indexPatternWithWildField);
            expect(results).toHaveLength(1);
            expect(Array.isArray(results)).toBeTruthy();
            expect(results[0].name).toBe('foo*');
            const actual = get_fields_1.getFields(index_1.nodeTypes.literal.buildNode('fo*'), indexPatternWithWildField);
            expect(actual).toEqual([]);
        });
    });
    describe('field name patterns with a wildcard', () => {
        test('should return an empty array if test does not match any fields in the index pattern', () => {
            const fieldNameNode = index_1.nodeTypes.wildcard.buildNode('nonExistent*');
            const actual = get_fields_1.getFields(fieldNameNode, indexPattern);
            expect(actual).toEqual([]);
        });
        test('should return all fields that match the pattern in an array', () => {
            const fieldNameNode = index_1.nodeTypes.wildcard.buildNode('machine*');
            const results = get_fields_1.getFields(fieldNameNode, indexPattern);
            expect(Array.isArray(results)).toBeTruthy();
            expect(results).toHaveLength(2);
            expect(results.find((field) => field.name === 'machine.os')).toBeDefined();
            expect(results.find((field) => field.name === 'machine.os.raw')).toBeDefined();
        });
    });
});
