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
const _ = tslib_1.__importStar(require("lodash"));
const brace_1 = tslib_1.__importDefault(require("brace"));
require("brace/mode/json");
const elasticsearch_sql_highlight_rules_1 = require("./elasticsearch_sql_highlight_rules");
const script_highlight_rules_1 = require("./script_highlight_rules");
const { JsonHighlightRules } = brace_1.default.acequire('ace/mode/json_highlight_rules');
const oop = brace_1.default.acequire('ace/lib/oop');
const jsonRules = function (root) {
    root = root ? root : 'json';
    const rules = {};
    const xJsonRules = [
        {
            token: [
                'variable',
                'whitespace',
                'ace.punctuation.colon',
                'whitespace',
                'punctuation.start_triple_quote',
            ],
            regex: '("(?:[^"]*_)?script"|"inline"|"source")(\\s*?)(:)(\\s*?)(""")',
            next: 'script-start',
            merge: false,
            push: true,
        },
        {
            token: 'variable',
            regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)',
        },
        {
            token: 'punctuation.start_triple_quote',
            regex: '"""',
            next: 'string_literal',
            merge: false,
            push: true,
        },
        {
            token: 'string',
            regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
        },
        {
            token: 'constant.numeric',
            regex: '0[xX][0-9a-fA-F]+\\b',
        },
        {
            token: 'constant.numeric',
            regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b',
        },
        {
            token: 'constant.language.boolean',
            regex: '(?:true|false)\\b',
        },
        {
            token: 'invalid.illegal',
            regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
        },
        {
            token: 'invalid.illegal',
            regex: '\\/\\/.*$',
        },
        {
            token: 'paren.lparen',
            merge: false,
            regex: '{',
            next: root,
            push: true,
        },
        {
            token: 'paren.lparen',
            merge: false,
            regex: '[[(]',
        },
        {
            token: 'paren.rparen',
            merge: false,
            regex: '[\\])]',
        },
        {
            token: 'paren.rparen',
            regex: '}',
            merge: false,
            next: 'pop',
        },
        {
            token: 'punctuation.comma',
            regex: ',',
        },
        {
            token: 'punctuation.colon',
            regex: ':',
        },
        {
            token: 'whitespace',
            regex: '\\s+',
        },
        {
            token: 'text',
            regex: '.+?',
        },
    ];
    rules[root] = xJsonRules;
    rules[root + '-sql'] = [
        {
            token: [
                'variable',
                'whitespace',
                'ace.punctuation.colon',
                'whitespace',
                'punctuation.start_triple_quote',
            ],
            regex: '("query")(\\s*?)(:)(\\s*?)(""")',
            next: 'sql-start',
            merge: false,
            push: true,
        },
    ].concat(xJsonRules);
    rules.string_literal = [
        {
            token: 'punctuation.end_triple_quote',
            regex: '"""',
            next: 'pop',
        },
        {
            token: 'multi_string',
            regex: '.',
        },
    ];
    return rules;
};
function XJsonHighlightRules() {
    this.$rules = {
        ...jsonRules('start'),
    };
    this.embedRules(script_highlight_rules_1.ScriptHighlightRules, 'script-', [
        {
            token: 'punctuation.end_triple_quote',
            regex: '"""',
            next: 'pop',
        },
    ]);
    this.embedRules(elasticsearch_sql_highlight_rules_1.ElasticsearchSqlHighlightRules, 'sql-', [
        {
            token: 'punctuation.end_triple_quote',
            regex: '"""',
            next: 'pop',
        },
    ]);
}
exports.XJsonHighlightRules = XJsonHighlightRules;
oop.inherits(XJsonHighlightRules, JsonHighlightRules);
function addToRules(otherRules, embedUnder) {
    otherRules.$rules = _.defaultsDeep(otherRules.$rules, jsonRules(embedUnder));
    otherRules.embedRules(script_highlight_rules_1.ScriptHighlightRules, 'script-', [
        {
            token: 'punctuation.end_triple_quote',
            regex: '"""',
            next: 'pop',
        },
    ]);
    otherRules.embedRules(elasticsearch_sql_highlight_rules_1.ElasticsearchSqlHighlightRules, 'sql-', [
        {
            token: 'punctuation.end_triple_quote',
            regex: '"""',
            next: 'pop',
        },
    ]);
}
exports.addToRules = addToRules;
