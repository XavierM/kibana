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
var proxy_config_1 = require("./proxy_config");
exports.ProxyConfig = proxy_config_1.ProxyConfig;
var proxy_config_collection_1 = require("./proxy_config_collection");
exports.ProxyConfigCollection = proxy_config_collection_1.ProxyConfigCollection;
var proxy_request_1 = require("./proxy_request");
exports.proxyRequest = proxy_request_1.proxyRequest;
var elasticsearch_proxy_config_1 = require("./elasticsearch_proxy_config");
exports.getElasticsearchProxyConfig = elasticsearch_proxy_config_1.getElasticsearchProxyConfig;
var set_headers_1 = require("./set_headers");
exports.setHeaders = set_headers_1.setHeaders;
var spec_definitions_1 = require("./spec_definitions");
exports.jsSpecLoaders = spec_definitions_1.jsSpecLoaders;
