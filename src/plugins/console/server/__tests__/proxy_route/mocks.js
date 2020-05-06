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
jest.mock('../../lib/proxy_request', () => ({
    proxyRequest: jest.fn(),
}));
const moment_1 = require("moment");
const lib_1 = require("../../lib");
const mocks_1 = require("../../../../../core/server/mocks");
exports.getProxyRouteHandlerDeps = ({ proxyConfigCollection = new lib_1.ProxyConfigCollection([]), pathFilters = [/.*/], readLegacyESConfig = () => ({
    requestTimeout: moment_1.duration(30000),
    customHeaders: {},
    requestHeadersWhitelist: [],
    hosts: ['http://localhost:9200'],
}), log = mocks_1.coreMock.createPluginInitializerContext().logger.get(), }) => ({
    proxyConfigCollection,
    pathFilters,
    readLegacyESConfig,
    log,
});
