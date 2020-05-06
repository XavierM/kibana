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
var search_1 = require("./search");
exports.searchSavedObjectType = search_1.searchSavedObjectType;
var query_1 = require("./query");
exports.querySavedObjectType = query_1.querySavedObjectType;
var index_patterns_1 = require("./index_patterns");
exports.indexPatternSavedObjectType = index_patterns_1.indexPatternSavedObjectType;
var kql_telementry_1 = require("./kql_telementry");
exports.kqlTelemetry = kql_telementry_1.kqlTelemetry;
