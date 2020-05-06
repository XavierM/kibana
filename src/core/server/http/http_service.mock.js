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
const csp_1 = require("../csp");
const router_mock_1 = require("./router/router.mock");
const config_mock_1 = require("../config/config.mock");
const auth_state_storage_1 = require("./auth_state_storage");
const cookie_session_storage_mocks_1 = require("./cookie_session_storage.mocks");
const createBasePathMock = (serverBasePath = '/mock-server-basepath') => ({
    serverBasePath,
    get: jest.fn().mockReturnValue(serverBasePath),
    set: jest.fn(),
    prepend: jest.fn(),
    remove: jest.fn(),
});
const createAuthMock = () => {
    const mock = {
        get: jest.fn(),
        isAuthenticated: jest.fn(),
    };
    mock.get.mockReturnValue({ status: auth_state_storage_1.AuthStatus.authenticated, state: {} });
    mock.isAuthenticated.mockReturnValue(true);
    return mock;
};
const createSetupContractMock = () => {
    const setupContract = {
        // we can mock other hapi server methods when we need it
        server: {
            name: 'http-server-test',
            version: 'kibana',
            route: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
            config: jest.fn().mockReturnValue(config_mock_1.configMock.create()),
        },
        createCookieSessionStorageFactory: jest.fn(),
        registerOnPreAuth: jest.fn(),
        registerAuth: jest.fn(),
        registerOnPostAuth: jest.fn(),
        registerRouteHandlerContext: jest.fn(),
        registerOnPreResponse: jest.fn(),
        createRouter: jest.fn().mockImplementation(() => router_mock_1.mockRouter.create({})),
        registerStaticDir: jest.fn(),
        basePath: createBasePathMock(),
        csp: csp_1.CspConfig.DEFAULT,
        auth: createAuthMock(),
        getAuthHeaders: jest.fn(),
        isTlsEnabled: false,
        getServerInfo: jest.fn(),
    };
    setupContract.createCookieSessionStorageFactory.mockResolvedValue(cookie_session_storage_mocks_1.sessionStorageMock.createFactory());
    setupContract.createRouter.mockImplementation(() => router_mock_1.mockRouter.create());
    setupContract.getAuthHeaders.mockReturnValue({ authorization: 'authorization-header' });
    setupContract.getServerInfo.mockReturnValue({
        host: 'localhost',
        name: 'kibana',
        port: 80,
        protocol: 'http',
    });
    return setupContract;
};
const createHttpServiceMock = () => {
    const mocked = {
        setup: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
    };
    mocked.setup.mockResolvedValue(createSetupContractMock());
    return mocked;
};
const createOnPreAuthToolkitMock = () => ({
    next: jest.fn(),
    rewriteUrl: jest.fn(),
});
const createOnPostAuthToolkitMock = () => ({
    next: jest.fn(),
});
const createAuthToolkitMock = () => ({
    authenticated: jest.fn(),
    notHandled: jest.fn(),
    redirected: jest.fn(),
});
const createOnPreResponseToolkitMock = () => ({
    next: jest.fn(),
});
exports.httpServiceMock = {
    create: createHttpServiceMock,
    createBasePath: createBasePathMock,
    createAuth: createAuthMock,
    createSetupContract: createSetupContractMock,
    createOnPreAuthToolkit: createOnPreAuthToolkitMock,
    createOnPostAuthToolkit: createOnPostAuthToolkitMock,
    createOnPreResponseToolkit: createOnPreResponseToolkitMock,
    createAuthToolkit: createAuthToolkitMock,
    createRouter: router_mock_1.mockRouter.create,
};
