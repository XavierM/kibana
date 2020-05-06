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
var lib_1 = require("./lib");
exports.ILLEGAL_CHARACTERS_KEY = lib_1.ILLEGAL_CHARACTERS_KEY;
exports.CONTAINS_SPACES_KEY = lib_1.CONTAINS_SPACES_KEY;
exports.ILLEGAL_CHARACTERS_VISIBLE = lib_1.ILLEGAL_CHARACTERS_VISIBLE;
exports.ILLEGAL_CHARACTERS = lib_1.ILLEGAL_CHARACTERS;
exports.validateIndexPattern = lib_1.validateIndexPattern;
exports.getFromSavedObject = lib_1.getFromSavedObject;
exports.isDefault = lib_1.isDefault;
var utils_1 = require("./utils");
exports.getRoutes = utils_1.getRoutes;
var index_patterns_1 = require("./index_patterns");
exports.flattenHitWrapper = index_patterns_1.flattenHitWrapper;
exports.formatHitProvider = index_patterns_1.formatHitProvider;
var fields_1 = require("./fields");
exports.Field = fields_1.Field;
exports.FieldList = fields_1.FieldList;
// TODO: figure out how to replace IndexPatterns in get_inner_angular.
var index_patterns_2 = require("./index_patterns");
exports.IndexPatternsService = index_patterns_2.IndexPatternsService;
exports.IndexPattern = index_patterns_2.IndexPattern;
