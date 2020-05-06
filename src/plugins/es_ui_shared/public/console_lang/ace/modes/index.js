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
var lexer_rules_1 = require("./lexer_rules");
exports.ElasticsearchSqlHighlightRules = lexer_rules_1.ElasticsearchSqlHighlightRules;
exports.ScriptHighlightRules = lexer_rules_1.ScriptHighlightRules;
exports.XJsonHighlightRules = lexer_rules_1.XJsonHighlightRules;
exports.addXJsonToRules = lexer_rules_1.addXJsonToRules;
var x_json_1 = require("./x_json");
exports.installXJsonMode = x_json_1.installXJsonMode;
exports.XJsonMode = x_json_1.XJsonMode;
