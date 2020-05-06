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
var get_search_params_1 = require("./get_search_params");
exports.getSearchParams = get_search_params_1.getSearchParams;
exports.getPreference = get_search_params_1.getPreference;
exports.getTimeout = get_search_params_1.getTimeout;
exports.getIgnoreThrottled = get_search_params_1.getIgnoreThrottled;
exports.getMaxConcurrentShardRequests = get_search_params_1.getMaxConcurrentShardRequests;
var search_error_1 = require("./search_error");
exports.SearchError = search_error_1.SearchError;
exports.getSearchErrorType = search_error_1.getSearchErrorType;
var request_error_1 = require("./request_error");
exports.RequestFailure = request_error_1.RequestFailure;
var handle_response_1 = require("./handle_response");
exports.handleResponse = handle_response_1.handleResponse;
