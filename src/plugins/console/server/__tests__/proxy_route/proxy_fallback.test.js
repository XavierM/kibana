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
const moment_1 = require("moment");
const mocks_1 = require("./mocks");
const server_1 = require("../../../../../core/server");
const create_handler_1 = require("../../routes/api/console/proxy/create_handler");
const requestModule = tslib_1.__importStar(require("../../lib/proxy_request"));
describe('Console Proxy Route', () => {
    afterEach(async () => {
        jest.resetAllMocks();
    });
    describe('fallback behaviour', () => {
        it('falls back to all configured endpoints regardless of error', async () => {
            // Describe a situation where all three configured nodes reject
            requestModule.proxyRequest.mockRejectedValueOnce(new Error('ECONNREFUSED'));
            requestModule.proxyRequest.mockRejectedValueOnce(new Error('EHOSTUNREACH'));
            requestModule.proxyRequest.mockRejectedValueOnce(new Error('ESOCKETTIMEDOUT'));
            const handler = create_handler_1.createHandler(mocks_1.getProxyRouteHandlerDeps({
                readLegacyESConfig: () => ({
                    requestTimeout: moment_1.duration(30000),
                    customHeaders: {},
                    requestHeadersWhitelist: [],
                    hosts: ['http://localhost:9201', 'http://localhost:9202', 'http://localhost:9203'],
                }),
            }));
            const response = await handler({}, {
                headers: {},
                query: { method: 'get', path: 'test' },
            }, server_1.kibanaResponseFactory);
            expect(response.status).toBe(502);
            // Return the message from the ES node we attempted last.
            expect(response.payload.message).toBe('ESOCKETTIMEDOUT');
        });
    });
});
