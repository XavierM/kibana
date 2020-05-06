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
jest.mock('../../../../../core/server/http/router/request', () => ({
    ensureRawRequest: jest.fn(),
}));
const server_1 = require("../../../../../core/server");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const request_1 = require("../../../../../core/server/http/router/request");
const mocks_1 = require("./mocks");
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const requestModule = tslib_1.__importStar(require("../../lib/proxy_request"));
const create_handler_1 = require("../../routes/api/console/proxy/create_handler");
const stubs_1 = require("./stubs");
describe('Console Proxy Route', () => {
    let handler;
    beforeEach(() => {
        requestModule.proxyRequest.mockResolvedValue(stubs_1.createResponseStub(''));
        handler = create_handler_1.createHandler(mocks_1.getProxyRouteHandlerDeps({}));
    });
    afterEach(async () => {
        jest.resetAllMocks();
    });
    describe('headers', () => {
        it('forwards the remote header info', async () => {
            request_1.ensureRawRequest.mockReturnValue({
                // This mocks the shape of the hapi request object, will probably change
                info: {
                    remoteAddress: '0.0.0.0',
                    remotePort: '1234',
                    host: 'test',
                },
                server: {
                    info: {
                        protocol: 'http',
                    },
                },
            });
            await handler({}, {
                headers: {},
                query: {
                    method: 'POST',
                    path: '/api/console/proxy?method=GET&path=/',
                },
            }, server_1.kibanaResponseFactory);
            expect_1.default(requestModule.proxyRequest.mock.calls.length).to.be(1);
            const [[{ headers }]] = requestModule.proxyRequest.mock.calls;
            expect_1.default(headers).to.have.property('x-forwarded-for');
            expect_1.default(headers['x-forwarded-for']).to.be('0.0.0.0');
            expect_1.default(headers).to.have.property('x-forwarded-port');
            expect_1.default(headers['x-forwarded-port']).to.be('1234');
            expect_1.default(headers).to.have.property('x-forwarded-proto');
            expect_1.default(headers['x-forwarded-proto']).to.be('http');
            expect_1.default(headers).to.have.property('x-forwarded-host');
            expect_1.default(headers['x-forwarded-host']).to.be('test');
        });
    });
});
