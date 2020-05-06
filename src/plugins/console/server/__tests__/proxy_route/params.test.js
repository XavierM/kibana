"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const server_1 = require("../../../../../core/server");
const mocks_1 = require("./mocks");
const stubs_1 = require("./stubs");
const requestModule = tslib_1.__importStar(require("../../lib/proxy_request"));
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const create_handler_1 = require("../../routes/api/console/proxy/create_handler");
describe('Console Proxy Route', () => {
    let handler;
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('params', () => {
        describe('pathFilters', () => {
            describe('no matches', () => {
                it('rejects with 403', async () => {
                    handler = create_handler_1.createHandler(mocks_1.getProxyRouteHandlerDeps({ pathFilters: [/^\/foo\//, /^\/bar\//] }));
                    const { status } = await handler({}, { query: { method: 'POST', path: '/baz/id' } }, server_1.kibanaResponseFactory);
                    expect_1.default(status).to.be(403);
                });
            });
            describe('one match', () => {
                it('allows the request', async () => {
                    handler = create_handler_1.createHandler(mocks_1.getProxyRouteHandlerDeps({ pathFilters: [/^\/foo\//, /^\/bar\//] }));
                    requestModule.proxyRequest.mockResolvedValue(stubs_1.createResponseStub('foo'));
                    const { status } = await handler({}, { headers: {}, query: { method: 'POST', path: '/foo/id' } }, server_1.kibanaResponseFactory);
                    expect_1.default(status).to.be(200);
                    expect_1.default(requestModule.proxyRequest.mock.calls.length).to.be(1);
                });
            });
            describe('all match', () => {
                it('allows the request', async () => {
                    handler = create_handler_1.createHandler(mocks_1.getProxyRouteHandlerDeps({ pathFilters: [/^\/foo\//] }));
                    requestModule.proxyRequest.mockResolvedValue(stubs_1.createResponseStub('foo'));
                    const { status } = await handler({}, { headers: {}, query: { method: 'GET', path: '/foo/id' } }, server_1.kibanaResponseFactory);
                    expect_1.default(status).to.be(200);
                    expect_1.default(requestModule.proxyRequest.mock.calls.length).to.be(1);
                });
            });
        });
    });
});
