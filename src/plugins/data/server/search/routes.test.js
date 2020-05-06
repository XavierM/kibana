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
const mocks_1 = require("../../../../../src/core/server/mocks");
const routes_1 = require("./routes");
describe('Search service', () => {
    let routerMock;
    beforeEach(() => {
        routerMock = mocks_1.httpServiceMock.createRouter();
    });
    it('registers a post route', async () => {
        routes_1.registerSearchRoute(routerMock);
        expect(routerMock.post).toBeCalled();
    });
    it('handler calls context.search.search with the given request and strategy', async () => {
        const mockSearch = jest.fn().mockResolvedValue('yay');
        const mockContext = {
            core: {
                elasticsearch: {
                    dataClient: {},
                    adminClient: {},
                },
            },
            search: {
                search: mockSearch,
            },
        };
        const mockBody = { params: {} };
        const mockParams = { strategy: 'foo' };
        const mockRequest = mocks_1.httpServerMock.createKibanaRequest({
            body: mockBody,
            params: mockParams,
        });
        const mockResponse = mocks_1.httpServerMock.createResponseFactory();
        routes_1.registerSearchRoute(routerMock);
        const handler = routerMock.post.mock.calls[0][1];
        await handler(mockContext, mockRequest, mockResponse);
        expect(mockSearch).toBeCalled();
        expect(mockSearch.mock.calls[0][0]).toStrictEqual(mockBody);
        expect(mockSearch.mock.calls[0][2]).toBe(mockParams.strategy);
        expect(mockResponse.ok).toBeCalled();
        expect(mockResponse.ok.mock.calls[0][0]).toEqual({ body: 'yay' });
    });
    it('handler throws an error if the search throws an error', async () => {
        const mockSearch = jest.fn().mockRejectedValue({
            message: 'oh no',
            body: {
                error: 'oops',
            },
        });
        const mockContext = {
            core: {
                elasticsearch: {
                    dataClient: {},
                    adminClient: {},
                },
            },
            search: {
                search: mockSearch,
            },
        };
        const mockBody = { params: {} };
        const mockParams = { strategy: 'foo' };
        const mockRequest = mocks_1.httpServerMock.createKibanaRequest({
            body: mockBody,
            params: mockParams,
        });
        const mockResponse = mocks_1.httpServerMock.createResponseFactory();
        routes_1.registerSearchRoute(routerMock);
        const handler = routerMock.post.mock.calls[0][1];
        await handler(mockContext, mockRequest, mockResponse);
        expect(mockSearch).toBeCalled();
        expect(mockSearch.mock.calls[0][0]).toStrictEqual(mockBody);
        expect(mockSearch.mock.calls[0][2]).toBe(mockParams.strategy);
        expect(mockResponse.customError).toBeCalled();
        const error = mockResponse.customError.mock.calls[0][0];
        expect(error.body.message).toBe('oh no');
        expect(error.body.attributes.error).toBe('oops');
    });
});
