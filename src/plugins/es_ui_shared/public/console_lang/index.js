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
// Lib is intentionally not included in this barrel export file to separate worker logic
// from being imported with pure functions
var modes_1 = require("./ace/modes");
exports.ElasticsearchSqlHighlightRules = modes_1.ElasticsearchSqlHighlightRules;
exports.ScriptHighlightRules = modes_1.ScriptHighlightRules;
exports.XJsonHighlightRules = modes_1.XJsonHighlightRules;
exports.addXJsonToRules = modes_1.addXJsonToRules;
exports.XJsonMode = modes_1.XJsonMode;
exports.installXJsonMode = modes_1.installXJsonMode;
var lib_1 = require("./lib");
exports.expandLiteralStrings = lib_1.expandLiteralStrings;
exports.collapseLiteralStrings = lib_1.collapseLiteralStrings;
