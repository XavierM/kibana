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
var extract_default_translations_1 = require("./extract_default_translations");
exports.extractMessagesFromPathToMap = extract_default_translations_1.extractMessagesFromPathToMap;
// @ts-ignore
var extract_default_translations_2 = require("./extract_default_translations");
exports.matchEntriesWithExctractors = extract_default_translations_2.matchEntriesWithExctractors;
// @ts-ignore
var utils_1 = require("./utils");
exports.arrayify = utils_1.arrayify;
exports.writeFileAsync = utils_1.writeFileAsync;
exports.readFileAsync = utils_1.readFileAsync;
exports.normalizePath = utils_1.normalizePath;
exports.ErrorReporter = utils_1.ErrorReporter;
var serializers_1 = require("./serializers");
exports.serializeToJson = serializers_1.serializeToJson;
exports.serializeToJson5 = serializers_1.serializeToJson5;
var config_1 = require("./config");
exports.filterConfigPaths = config_1.filterConfigPaths;
exports.assignConfigFromPath = config_1.assignConfigFromPath;
exports.checkConfigNamespacePrefix = config_1.checkConfigNamespacePrefix;
var integrate_locale_files_1 = require("./integrate_locale_files");
exports.integrateLocaleFiles = integrate_locale_files_1.integrateLocaleFiles;
