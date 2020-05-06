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
const index_1 = require("./index");
// @ts-ignore
const named_arg_1 = require("./named_arg");
describe('kuery node types', () => {
    describe('named arg', () => {
        describe('buildNode', () => {
            test('should return a node representing a named argument with the given value', () => {
                const result = named_arg_1.buildNode('fieldName', 'foo');
                expect(result).toHaveProperty('type', 'namedArg');
                expect(result).toHaveProperty('name', 'fieldName');
                expect(result).toHaveProperty('value');
                const literalValue = result.value;
                expect(literalValue).toHaveProperty('type', 'literal');
                expect(literalValue).toHaveProperty('value', 'foo');
            });
            test('should support literal nodes as values', () => {
                const value = index_1.nodeTypes.literal.buildNode('foo');
                const result = named_arg_1.buildNode('fieldName', value);
                expect(result.value).toBe(value);
                expect(result.value).toEqual(value);
            });
        });
        describe('toElasticsearchQuery', () => {
            test('should return the argument value represented by the given node', () => {
                const node = named_arg_1.buildNode('fieldName', 'foo');
                const result = named_arg_1.toElasticsearchQuery(node);
                expect(result).toBe('foo');
            });
        });
    });
});
