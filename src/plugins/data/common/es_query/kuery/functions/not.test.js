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
const not = tslib_1.__importStar(require("./not"));
const childNode = node_types_1.nodeTypes.function.buildNode('is', 'extension', 'jpg');
describe('kuery functions', () => {
    describe('not', () => {
        let indexPattern;
        beforeEach(() => {
            indexPattern = {
                fields: mocks_1.fields,
            };
        });
        describe('buildNodeParams', () => {
            test('arguments should contain the unmodified child node', () => {
                const { arguments: [actualChild], } = not.buildNodeParams(childNode);
                expect(actualChild).toBe(childNode);
            });
        });
        describe('toElasticsearchQuery', () => {
            test("should wrap a subquery in an ES bool query's must_not clause", () => {
                const node = node_types_1.nodeTypes.function.buildNode('not', childNode);
                const result = not.toElasticsearchQuery(node, indexPattern);
                expect(result).toHaveProperty('bool');
                expect(Object.keys(result).length).toBe(1);
                expect(result.bool).toHaveProperty('must_not');
                expect(Object.keys(result.bool).length).toBe(1);
                expect(result.bool.must_not).toEqual(ast.toElasticsearchQuery(childNode, indexPattern));
            });
        });
    });
});
