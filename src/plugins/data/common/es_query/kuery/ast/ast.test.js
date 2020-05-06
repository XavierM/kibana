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
const ast_1 = require("./ast");
const node_types_1 = require("../node_types");
const mocks_1 = require("../../../index_patterns/mocks");
describe('kuery AST API', () => {
    let indexPattern;
    beforeEach(() => {
        indexPattern = {
            fields: mocks_1.fields,
        };
    });
    describe('fromKueryExpression', () => {
        test('should return a match all "is" function for whitespace', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', '*', '*');
            const actual = ast_1.fromKueryExpression('  ');
            expect(actual).toEqual(expected);
        });
        test('should return an "is" function with a null field for single literals', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', null, 'foo');
            const actual = ast_1.fromKueryExpression('foo');
            expect(actual).toEqual(expected);
        });
        test('should ignore extraneous whitespace at the beginning and end of the query', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', null, 'foo');
            const actual = ast_1.fromKueryExpression('  foo ');
            expect(actual).toEqual(expected);
        });
        test('should not split on whitespace', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', null, 'foo bar');
            const actual = ast_1.fromKueryExpression('foo bar');
            expect(actual).toEqual(expected);
        });
        test('should support "and" as a binary operator', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('and', [
                node_types_1.nodeTypes.function.buildNode('is', null, 'foo'),
                node_types_1.nodeTypes.function.buildNode('is', null, 'bar'),
            ]);
            const actual = ast_1.fromKueryExpression('foo and bar');
            expect(actual).toEqual(expected);
        });
        test('should support "or" as a binary operator', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('or', [
                node_types_1.nodeTypes.function.buildNode('is', null, 'foo'),
                node_types_1.nodeTypes.function.buildNode('is', null, 'bar'),
            ]);
            const actual = ast_1.fromKueryExpression('foo or bar');
            expect(actual).toEqual(expected);
        });
        test('should support negation of queries with a "not" prefix', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('not', node_types_1.nodeTypes.function.buildNode('or', [
                node_types_1.nodeTypes.function.buildNode('is', null, 'foo'),
                node_types_1.nodeTypes.function.buildNode('is', null, 'bar'),
            ]));
            const actual = ast_1.fromKueryExpression('not (foo or bar)');
            expect(actual).toEqual(expected);
        });
        test('"and" should have a higher precedence than "or"', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('or', [
                node_types_1.nodeTypes.function.buildNode('is', null, 'foo'),
                node_types_1.nodeTypes.function.buildNode('or', [
                    node_types_1.nodeTypes.function.buildNode('and', [
                        node_types_1.nodeTypes.function.buildNode('is', null, 'bar'),
                        node_types_1.nodeTypes.function.buildNode('is', null, 'baz'),
                    ]),
                    node_types_1.nodeTypes.function.buildNode('is', null, 'qux'),
                ]),
            ]);
            const actual = ast_1.fromKueryExpression('foo or bar and baz or qux');
            expect(actual).toEqual(expected);
        });
        test('should support grouping to override default precedence', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('and', [
                node_types_1.nodeTypes.function.buildNode('or', [
                    node_types_1.nodeTypes.function.buildNode('is', null, 'foo'),
                    node_types_1.nodeTypes.function.buildNode('is', null, 'bar'),
                ]),
                node_types_1.nodeTypes.function.buildNode('is', null, 'baz'),
            ]);
            const actual = ast_1.fromKueryExpression('(foo or bar) and baz');
            expect(actual).toEqual(expected);
        });
        test('should support matching against specific fields', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', 'foo', 'bar');
            const actual = ast_1.fromKueryExpression('foo:bar');
            expect(actual).toEqual(expected);
        });
        test('should also not split on whitespace when matching specific fields', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', 'foo', 'bar baz');
            const actual = ast_1.fromKueryExpression('foo:bar baz');
            expect(actual).toEqual(expected);
        });
        test('should treat quoted values as phrases', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', 'foo', 'bar baz', true);
            const actual = ast_1.fromKueryExpression('foo:"bar baz"');
            expect(actual).toEqual(expected);
        });
        test('should support a shorthand for matching multiple values against a single field', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('or', [
                node_types_1.nodeTypes.function.buildNode('is', 'foo', 'bar'),
                node_types_1.nodeTypes.function.buildNode('is', 'foo', 'baz'),
            ]);
            const actual = ast_1.fromKueryExpression('foo:(bar or baz)');
            expect(actual).toEqual(expected);
        });
        test('should support "and" and "not" operators and grouping in the shorthand as well', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('and', [
                node_types_1.nodeTypes.function.buildNode('or', [
                    node_types_1.nodeTypes.function.buildNode('is', 'foo', 'bar'),
                    node_types_1.nodeTypes.function.buildNode('is', 'foo', 'baz'),
                ]),
                node_types_1.nodeTypes.function.buildNode('not', node_types_1.nodeTypes.function.buildNode('is', 'foo', 'qux')),
            ]);
            const actual = ast_1.fromKueryExpression('foo:((bar or baz) and not qux)');
            expect(actual).toEqual(expected);
        });
        test('should support exclusive range operators', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('and', [
                node_types_1.nodeTypes.function.buildNode('range', 'bytes', {
                    gt: 1000,
                }),
                node_types_1.nodeTypes.function.buildNode('range', 'bytes', {
                    lt: 8000,
                }),
            ]);
            const actual = ast_1.fromKueryExpression('bytes > 1000 and bytes < 8000');
            expect(actual).toEqual(expected);
        });
        test('should support inclusive range operators', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('and', [
                node_types_1.nodeTypes.function.buildNode('range', 'bytes', {
                    gte: 1000,
                }),
                node_types_1.nodeTypes.function.buildNode('range', 'bytes', {
                    lte: 8000,
                }),
            ]);
            const actual = ast_1.fromKueryExpression('bytes >= 1000 and bytes <= 8000');
            expect(actual).toEqual(expected);
        });
        test('should support wildcards in field names', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', 'machine*', 'osx');
            const actual = ast_1.fromKueryExpression('machine*:osx');
            expect(actual).toEqual(expected);
        });
        test('should support wildcards in values', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', 'foo', 'ba*');
            const actual = ast_1.fromKueryExpression('foo:ba*');
            expect(actual).toEqual(expected);
        });
        test('should create an exists "is" query when a field is given and "*" is the value', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('is', 'foo', '*');
            const actual = ast_1.fromKueryExpression('foo:*');
            expect(actual).toEqual(expected);
        });
        test('should support nested queries indicated by curly braces', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('nested', 'nestedField', node_types_1.nodeTypes.function.buildNode('is', 'childOfNested', 'foo'));
            const actual = ast_1.fromKueryExpression('nestedField:{ childOfNested: foo }');
            expect(actual).toEqual(expected);
        });
        test('should support nested subqueries and subqueries inside nested queries', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('and', [
                node_types_1.nodeTypes.function.buildNode('is', 'response', '200'),
                node_types_1.nodeTypes.function.buildNode('nested', 'nestedField', node_types_1.nodeTypes.function.buildNode('or', [
                    node_types_1.nodeTypes.function.buildNode('is', 'childOfNested', 'foo'),
                    node_types_1.nodeTypes.function.buildNode('is', 'childOfNested', 'bar'),
                ])),
            ]);
            const actual = ast_1.fromKueryExpression('response:200 and nestedField:{ childOfNested:foo or childOfNested:bar }');
            expect(actual).toEqual(expected);
        });
        test('should support nested sub-queries inside paren groups', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('and', [
                node_types_1.nodeTypes.function.buildNode('is', 'response', '200'),
                node_types_1.nodeTypes.function.buildNode('or', [
                    node_types_1.nodeTypes.function.buildNode('nested', 'nestedField', node_types_1.nodeTypes.function.buildNode('is', 'childOfNested', 'foo')),
                    node_types_1.nodeTypes.function.buildNode('nested', 'nestedField', node_types_1.nodeTypes.function.buildNode('is', 'childOfNested', 'bar')),
                ]),
            ]);
            const actual = ast_1.fromKueryExpression('response:200 and ( nestedField:{ childOfNested:foo } or nestedField:{ childOfNested:bar } )');
            expect(actual).toEqual(expected);
        });
        test('should support nested groups inside other nested groups', () => {
            const expected = node_types_1.nodeTypes.function.buildNode('nested', 'nestedField', node_types_1.nodeTypes.function.buildNode('nested', 'nestedChild', node_types_1.nodeTypes.function.buildNode('is', 'doublyNestedChild', 'foo')));
            const actual = ast_1.fromKueryExpression('nestedField:{ nestedChild:{ doublyNestedChild:foo } }');
            expect(actual).toEqual(expected);
        });
    });
    describe('fromLiteralExpression', () => {
        test('should create literal nodes for unquoted values with correct primitive types', () => {
            const stringLiteral = node_types_1.nodeTypes.literal.buildNode('foo');
            const booleanFalseLiteral = node_types_1.nodeTypes.literal.buildNode(false);
            const booleanTrueLiteral = node_types_1.nodeTypes.literal.buildNode(true);
            const numberLiteral = node_types_1.nodeTypes.literal.buildNode(42);
            expect(ast_1.fromLiteralExpression('foo')).toEqual(stringLiteral);
            expect(ast_1.fromLiteralExpression('true')).toEqual(booleanTrueLiteral);
            expect(ast_1.fromLiteralExpression('false')).toEqual(booleanFalseLiteral);
            expect(ast_1.fromLiteralExpression('42')).toEqual(numberLiteral);
            expect(ast_1.fromLiteralExpression('.3').value).toEqual(0.3);
            expect(ast_1.fromLiteralExpression('.36').value).toEqual(0.36);
            expect(ast_1.fromLiteralExpression('.00001').value).toEqual(0.00001);
            expect(ast_1.fromLiteralExpression('3').value).toEqual(3);
            expect(ast_1.fromLiteralExpression('-4').value).toEqual(-4);
            expect(ast_1.fromLiteralExpression('0').value).toEqual(0);
            expect(ast_1.fromLiteralExpression('0.0').value).toEqual(0);
            expect(ast_1.fromLiteralExpression('2.0').value).toEqual(2.0);
            expect(ast_1.fromLiteralExpression('0.8').value).toEqual(0.8);
            expect(ast_1.fromLiteralExpression('790.9').value).toEqual(790.9);
            expect(ast_1.fromLiteralExpression('0.0001').value).toEqual(0.0001);
            expect(ast_1.fromLiteralExpression('96565646732345').value).toEqual(96565646732345);
            expect(ast_1.fromLiteralExpression('..4').value).toEqual('..4');
            expect(ast_1.fromLiteralExpression('.3text').value).toEqual('.3text');
            expect(ast_1.fromLiteralExpression('text').value).toEqual('text');
            expect(ast_1.fromLiteralExpression('.').value).toEqual('.');
            expect(ast_1.fromLiteralExpression('-').value).toEqual('-');
            expect(ast_1.fromLiteralExpression('001').value).toEqual('001');
            expect(ast_1.fromLiteralExpression('00.2').value).toEqual('00.2');
            expect(ast_1.fromLiteralExpression('0.0.1').value).toEqual('0.0.1');
            expect(ast_1.fromLiteralExpression('3.').value).toEqual('3.');
            expect(ast_1.fromLiteralExpression('--4').value).toEqual('--4');
            expect(ast_1.fromLiteralExpression('-.4').value).toEqual('-.4');
            expect(ast_1.fromLiteralExpression('-0').value).toEqual('-0');
            expect(ast_1.fromLiteralExpression('00949').value).toEqual('00949');
        });
        test('should allow escaping of special characters with a backslash', () => {
            const expected = node_types_1.nodeTypes.literal.buildNode('\\():<>"*');
            // yo dawg
            const actual = ast_1.fromLiteralExpression('\\\\\\(\\)\\:\\<\\>\\"\\*');
            expect(actual).toEqual(expected);
        });
        test('should support double quoted strings that do not need escapes except for quotes', () => {
            const expected = node_types_1.nodeTypes.literal.buildNode('\\():<>"*');
            const actual = ast_1.fromLiteralExpression('"\\():<>\\"*"');
            expect(actual).toEqual(expected);
        });
        test('should support escaped backslashes inside quoted strings', () => {
            const expected = node_types_1.nodeTypes.literal.buildNode('\\');
            const actual = ast_1.fromLiteralExpression('"\\\\"');
            expect(actual).toEqual(expected);
        });
        test('should detect wildcards and build wildcard AST nodes', () => {
            const expected = node_types_1.nodeTypes.wildcard.buildNode('foo*bar');
            const actual = ast_1.fromLiteralExpression('foo*bar');
            expect(actual).toEqual(expected);
        });
    });
    describe('toElasticsearchQuery', () => {
        test("should return the given node type's ES query representation", () => {
            const node = node_types_1.nodeTypes.function.buildNode('exists', 'response');
            const expected = node_types_1.nodeTypes.function.toElasticsearchQuery(node, indexPattern);
            const result = ast_1.toElasticsearchQuery(node, indexPattern);
            expect(result).toEqual(expected);
        });
        test('should return an empty "and" function for undefined nodes and unknown node types', () => {
            const expected = node_types_1.nodeTypes.function.toElasticsearchQuery(node_types_1.nodeTypes.function.buildNode('and', []), indexPattern);
            expect(ast_1.toElasticsearchQuery(null, undefined)).toEqual(expected);
            const noTypeNode = node_types_1.nodeTypes.function.buildNode('exists', 'foo');
            delete noTypeNode.type;
            expect(ast_1.toElasticsearchQuery(noTypeNode)).toEqual(expected);
            const unknownTypeNode = node_types_1.nodeTypes.function.buildNode('exists', 'foo');
            // @ts-ignore
            unknownTypeNode.type = 'notValid';
            expect(ast_1.toElasticsearchQuery(unknownTypeNode)).toEqual(expected);
        });
        test("should return the given node type's ES query representation including a time zone parameter when one is provided", () => {
            const config = { dateFormatTZ: 'America/Phoenix' };
            const node = node_types_1.nodeTypes.function.buildNode('is', '@timestamp', '"2018-04-03T19:04:17"');
            const expected = node_types_1.nodeTypes.function.toElasticsearchQuery(node, indexPattern, config);
            const result = ast_1.toElasticsearchQuery(node, indexPattern, config);
            expect(result).toEqual(expected);
        });
    });
    describe('doesKueryExpressionHaveLuceneSyntaxError', () => {
        test('should return true for Lucene ranges', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar: [1 TO 10]');
            expect(result).toEqual(true);
        });
        test('should return false for KQL ranges', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar < 1');
            expect(result).toEqual(false);
        });
        test('should return true for Lucene exists', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('_exists_: bar');
            expect(result).toEqual(true);
        });
        test('should return false for KQL exists', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar:*');
            expect(result).toEqual(false);
        });
        test('should return true for Lucene wildcards', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar: ba?');
            expect(result).toEqual(true);
        });
        test('should return false for KQL wildcards', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar: ba*');
            expect(result).toEqual(false);
        });
        test('should return true for Lucene regex', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar: /ba.*/');
            expect(result).toEqual(true);
        });
        test('should return true for Lucene fuzziness', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar: ba~');
            expect(result).toEqual(true);
        });
        test('should return true for Lucene proximity', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar: "ba"~2');
            expect(result).toEqual(true);
        });
        test('should return true for Lucene boosting', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('bar: ba^2');
            expect(result).toEqual(true);
        });
        test('should return true for Lucene + operator', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('+foo: bar');
            expect(result).toEqual(true);
        });
        test('should return true for Lucene - operators', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('-foo: bar');
            expect(result).toEqual(true);
        });
        test('should return true for Lucene && operators', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('foo: bar && baz: qux');
            expect(result).toEqual(true);
        });
        test('should return true for Lucene || operators', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('foo: bar || baz: qux');
            expect(result).toEqual(true);
        });
        test('should return true for mixed KQL/Lucene queries', () => {
            const result = ast_1.doesKueryExpressionHaveLuceneSyntaxError('foo: bar and (baz: qux || bag)');
            expect(result).toEqual(true);
        });
    });
});
