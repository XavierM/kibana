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
const mocks_1 = require("./mocks");
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const server_1 = require("../../../../../core/server");
const create_handler_1 = require("../../routes/api/console/proxy/create_handler");
const requestModule = tslib_1.__importStar(require("../../lib/proxy_request"));
const stubs_1 = require("./stubs");
describe('Console Proxy Route', () => {
    let request;
    beforeEach(() => {
        request = (method, path, response) => {
            requestModule.proxyRequest.mockResolvedValue(stubs_1.createResponseStub(response));
            const handler = create_handler_1.createHandler(mocks_1.getProxyRouteHandlerDeps({}));
            return handler({}, {
                headers: {},
                query: { method, path },
            }, server_1.kibanaResponseFactory);
        };
    });
    const readStream = (s) => new Promise(resolve => {
        let v = '';
        s.on('data', data => {
            v += data;
        });
        s.on('end', () => resolve(v));
    });
    afterEach(async () => {
        jest.resetAllMocks();
    });
    describe('response body', () => {
        describe('GET request', () => {
            it('returns the exact body', async () => {
                const { payload } = await request('GET', '/', 'foobar');
                expect_1.default(await readStream(payload)).to.be('foobar');
            });
        });
        describe('POST request', () => {
            it('returns the exact body', async () => {
                const { payload } = await request('POST', '/', 'foobar');
                expect_1.default(await readStream(payload)).to.be('foobar');
            });
        });
        describe('PUT request', () => {
            it('returns the exact body', async () => {
                const { payload } = await request('PUT', '/', 'foobar');
                expect_1.default(await readStream(payload)).to.be('foobar');
            });
        });
        describe('DELETE request', () => {
            it('returns the exact body', async () => {
                const { payload } = await request('DELETE', '/', 'foobar');
                expect_1.default(await readStream(payload)).to.be('foobar');
            });
        });
        describe('HEAD request', () => {
            it('returns the status code and text', async () => {
                const { payload } = await request('HEAD', '/');
                expect_1.default(typeof payload).to.be('string');
                expect_1.default(payload).to.be('200 - OK');
            });
            describe('mixed casing', () => {
                it('returns the status code and text', async () => {
                    const { payload } = await request('HeAd', '/');
                    expect_1.default(typeof payload).to.be('string');
                    expect_1.default(payload).to.be('200 - OK');
                });
            });
        });
    });
});
