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
const mocks_1 = require("../../../index_patterns/mocks");
const index_1 = require("./index");
// @ts-ignore
const function_1 = require("./function");
// @ts-ignore
const is_1 = require("../functions/is");
describe('kuery node types', () => {
    describe('function', () => {
        let indexPattern;
        beforeEach(() => {
            indexPattern = {
                fields: mocks_1.fields,
            };
        });
        describe('buildNode', () => {
            test('should return a node representing the given kuery function', () => {
                const result = function_1.buildNode('is', 'extension', 'jpg');
                expect(result).toHaveProperty('type', 'function');
                expect(result).toHaveProperty('function', 'is');
                expect(result).toHaveProperty('arguments');
            });
        });
        describe('buildNodeWithArgumentNodes', () => {
            test('should return a function node with the given argument list untouched', () => {
                const fieldNameLiteral = index_1.nodeTypes.literal.buildNode('extension');
                const valueLiteral = index_1.nodeTypes.literal.buildNode('jpg');
                const argumentNodes = [fieldNameLiteral, valueLiteral];
                const result = function_1.buildNodeWithArgumentNodes('is', argumentNodes);
                expect(result).toHaveProperty('type', 'function');
                expect(result).toHaveProperty('function', 'is');
                expect(result).toHaveProperty('arguments');
                expect(result.arguments).toBe(argumentNodes);
                expect(result.arguments).toEqual(argumentNodes);
            });
        });
        describe('toElasticsearchQuery', () => {
            test("should return the given function type's ES query representation", () => {
                const node = function_1.buildNode('is', 'extension', 'jpg');
                const expected = is_1.toElasticsearchQuery(node, indexPattern);
                const result = function_1.toElasticsearchQuery(node, indexPattern);
                expect(expected).toEqual(result);
            });
        });
    });
});
