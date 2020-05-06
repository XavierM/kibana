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
const tslib_1 = require("tslib");
const node_types_1 = require("../node_types");
const mocks_1 = require("../../../index_patterns/mocks");
const ast = tslib_1.__importStar(require("../ast"));
// @ts-ignore
const and = tslib_1.__importStar(require("./and"));
const childNode1 = node_types_1.nodeTypes.function.buildNode('is', 'machine.os', 'osx');
const childNode2 = node_types_1.nodeTypes.function.buildNode('is', 'extension', 'jpg');
describe('kuery functions', () => {
    describe('and', () => {
        let indexPattern;
        beforeEach(() => {
            indexPattern = {
                fields: mocks_1.fields,
            };
        });
        describe('buildNodeParams', () => {
            test('arguments should contain the unmodified child nodes', () => {
                const result = and.buildNodeParams([childNode1, childNode2]);
                const { arguments: [actualChildNode1, actualChildNode2], } = result;
                expect(actualChildNode1).toBe(childNode1);
                expect(actualChildNode2).toBe(childNode2);
            });
        });
        describe('toElasticsearchQuery', () => {
            test("should wrap subqueries in an ES bool query's filter clause", () => {
                const node = node_types_1.nodeTypes.function.buildNode('and', [childNode1, childNode2]);
                const result = and.toElasticsearchQuery(node, indexPattern);
                expect(result).toHaveProperty('bool');
                expect(Object.keys(result).length).toBe(1);
                expect(result.bool).toHaveProperty('filter');
                expect(Object.keys(result.bool).length).toBe(1);
                expect(result.bool.filter).toEqual([childNode1, childNode2].map(childNode => ast.toElasticsearchQuery(childNode, indexPattern)));
            });
        });
    });
});
