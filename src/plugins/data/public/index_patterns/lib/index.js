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
var get_title_1 = require("./get_title");
exports.getTitle = get_title_1.getTitle;
tslib_1.__exportStar(require("./types"), exports);
var validate_index_pattern_1 = require("./validate_index_pattern");
exports.validateIndexPattern = validate_index_pattern_1.validateIndexPattern;
var errors_1 = require("./errors");
exports.IndexPatternMissingIndices = errors_1.IndexPatternMissingIndices;
var get_from_saved_object_1 = require("./get_from_saved_object");
exports.getFromSavedObject = get_from_saved_object_1.getFromSavedObject;
var is_default_1 = require("./is_default");
exports.isDefault = is_default_1.isDefault;
