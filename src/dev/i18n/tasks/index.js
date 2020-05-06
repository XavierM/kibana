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
var extract_default_translations_1 = require("./extract_default_translations");
exports.extractDefaultMessages = extract_default_translations_1.extractDefaultMessages;
var extract_untracked_translations_1 = require("./extract_untracked_translations");
exports.extractUntrackedMessages = extract_untracked_translations_1.extractUntrackedMessages;
var check_compatibility_1 = require("./check_compatibility");
exports.checkCompatibility = check_compatibility_1.checkCompatibility;
var merge_configs_1 = require("./merge_configs");
exports.mergeConfigs = merge_configs_1.mergeConfigs;
var check_configs_1 = require("./check_configs");
exports.checkConfigs = check_configs_1.checkConfigs;
