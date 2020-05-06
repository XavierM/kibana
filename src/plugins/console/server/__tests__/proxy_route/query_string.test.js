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
    let request;
    beforeEach(() => {
        requestModule.proxyRequest.mockResolvedValue(stubs_1.createResponseStub('foo'));
        request = async (method, path) => {
            const handler = create_handler_1.createHandler(mocks_1.getProxyRouteHandlerDeps({}));
            return handler({}, { headers: {}, query: { method, path } }, server_1.kibanaResponseFactory);
        };
    });
    afterEach(async () => {
        jest.resetAllMocks();
    });
    describe('query string', () => {
        describe('path', () => {
            describe('contains full url', () => {
                it('treats the url as a path', async () => {
                    await request('GET', 'http://evil.com/test');
                    expect_1.default(requestModule.proxyRequest.mock.calls.length).to.be(1);
                    const [[args]] = requestModule.proxyRequest.mock.calls;
                    expect_1.default(args.uri.href).to.be('http://localhost:9200/http://evil.com/test?pretty=true');
                });
            });
            describe('starts with a slash', () => {
                it('combines well with the base url', async () => {
                    await request('GET', '/index/id');
                    expect_1.default(requestModule.proxyRequest.mock.calls.length).to.be(1);
                    const [[args]] = requestModule.proxyRequest.mock.calls;
                    expect_1.default(args.uri.href).to.be('http://localhost:9200/index/id?pretty=true');
                });
            });
            describe(`doesn't start with a slash`, () => {
                it('combines well with the base url', async () => {
                    await request('GET', 'index/id');
                    expect_1.default(requestModule.proxyRequest.mock.calls.length).to.be(1);
                    const [[args]] = requestModule.proxyRequest.mock.calls;
                    expect_1.default(args.uri.href).to.be('http://localhost:9200/index/id?pretty=true');
                });
            });
        });
    });
});
