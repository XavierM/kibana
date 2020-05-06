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
// @ts-ignore
const literal_1 = require("./literal");
describe('kuery node types', () => {
    describe('literal', () => {
        describe('buildNode', () => {
            test('should return a node representing the given value', () => {
                const result = literal_1.buildNode('foo');
                expect(result).toHaveProperty('type', 'literal');
                expect(result).toHaveProperty('value', 'foo');
            });
        });
        describe('toElasticsearchQuery', () => {
            test('should return the literal value represented by the given node', () => {
                const node = literal_1.buildNode('foo');
                const result = literal_1.toElasticsearchQuery(node);
                expect(result).toBe('foo');
            });
        });
    });
});
