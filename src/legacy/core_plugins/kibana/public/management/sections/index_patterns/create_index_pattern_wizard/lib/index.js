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
var can_append_wildcard_1 = require("./can_append_wildcard");
exports.canAppendWildcard = can_append_wildcard_1.canAppendWildcard;
var ensure_minimum_time_1 = require("./ensure_minimum_time");
exports.ensureMinimumTime = ensure_minimum_time_1.ensureMinimumTime;
var get_indices_1 = require("./get_indices");
exports.getIndices = get_indices_1.getIndices;
var get_matched_indices_1 = require("./get_matched_indices");
exports.getMatchedIndices = get_matched_indices_1.getMatchedIndices;
var contains_illegal_characters_1 = require("./contains_illegal_characters");
exports.containsIllegalCharacters = contains_illegal_characters_1.containsIllegalCharacters;
var extract_time_fields_1 = require("./extract_time_fields");
exports.extractTimeFields = extract_time_fields_1.extractTimeFields;
