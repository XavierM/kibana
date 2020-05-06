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
const http_service_test_mocks_1 = require("./http_service.test.mocks");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const _1 = require(".");
const http_config_1 = require("./http_config");
const http_server_mocks_1 = require("./http_server.mocks");
const config_1 = require("../config");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const context_service_mock_1 = require("../context/context_service.mock");
const env_1 = require("../config/__mocks__/env");
const csp_1 = require("../csp");
const logger = logging_service_mock_1.loggingServiceMock.create();
const env = config_1.Env.createDefault(env_1.getEnvOptions());
const coreId = Symbol();
const createConfigService = (value = {}) => {
    const configService = new config_1.ConfigService({
        getConfig$: () => new rxjs_1.BehaviorSubject({
            server: value,
        }),
    }, env, logger);
    configService.setSchema(http_config_1.config.path, http_config_1.config.schema);
    configService.setSchema(csp_1.config.path, csp_1.config.schema);
    return configService;
};
const contextSetup = context_service_mock_1.contextServiceMock.createSetupContract();
const setupDeps = {
    context: contextSetup,
};
const fakeHapiServer = {
    start: lodash_1.noop,
    stop: lodash_1.noop,
    route: lodash_1.noop,
};
afterEach(() => {
    jest.clearAllMocks();
});
test('creates and sets up http server', async () => {
    const configService = createConfigService({
        host: 'example.org',
        port: 1234,
    });
    const httpServer = {
        isListening: () => false,
        setup: jest.fn().mockReturnValue({ server: fakeHapiServer }),
        start: jest.fn(),
        stop: jest.fn(),
    };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => httpServer);
    const service = new _1.HttpService({ coreId, configService, env, logger });
    expect(http_service_test_mocks_1.mockHttpServer.mock.instances.length).toBe(1);
    expect(httpServer.setup).not.toHaveBeenCalled();
    await service.setup(setupDeps);
    expect(httpServer.setup).toHaveBeenCalled();
    expect(httpServer.start).not.toHaveBeenCalled();
    await service.start();
    expect(httpServer.start).toHaveBeenCalled();
});
test('spins up notReady server until started if configured with `autoListen:true`', async () => {
    const configService = createConfigService();
    const httpServer = {
        isListening: () => false,
        setup: jest.fn().mockReturnValue({}),
        start: jest.fn(),
        stop: jest.fn(),
    };
    const notReadyHapiServer = {
        start: jest.fn(),
        stop: jest.fn(),
        route: jest.fn(),
    };
    http_service_test_mocks_1.mockHttpServer
        .mockImplementationOnce(() => httpServer)
        .mockImplementationOnce(() => ({
        setup: () => ({ server: notReadyHapiServer }),
    }));
    const service = new _1.HttpService({
        coreId,
        configService,
        env: new config_1.Env('.', env_1.getEnvOptions()),
        logger,
    });
    await service.setup(setupDeps);
    const mockResponse = {
        code: jest.fn().mockImplementation(() => mockResponse),
        header: jest.fn().mockImplementation(() => mockResponse),
    };
    const mockResponseToolkit = {
        response: jest.fn().mockReturnValue(mockResponse),
    };
    const [[{ handler }]] = notReadyHapiServer.route.mock.calls;
    const response503 = await handler(http_server_mocks_1.httpServerMock.createRawRequest(), mockResponseToolkit);
    expect(response503).toBe(mockResponse);
    expect({
        body: mockResponseToolkit.response.mock.calls,
        code: mockResponse.code.mock.calls,
        header: mockResponse.header.mock.calls,
    }).toMatchSnapshot('503 response');
    await service.start();
    expect(httpServer.start).toBeCalledTimes(1);
    expect(notReadyHapiServer.stop).toBeCalledTimes(1);
});
test('logs error if already set up', async () => {
    const configService = createConfigService();
    const httpServer = {
        isListening: () => true,
        setup: jest.fn().mockReturnValue({ server: fakeHapiServer }),
        start: lodash_1.noop,
        stop: lodash_1.noop,
    };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => httpServer);
    const service = new _1.HttpService({ coreId, configService, env, logger });
    await service.setup(setupDeps);
    expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toMatchSnapshot();
});
test('stops http server', async () => {
    const configService = createConfigService();
    const httpServer = {
        isListening: () => false,
        setup: jest.fn().mockReturnValue({ server: fakeHapiServer }),
        start: lodash_1.noop,
        stop: jest.fn(),
    };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => httpServer);
    const service = new _1.HttpService({ coreId, configService, env, logger });
    await service.setup(setupDeps);
    await service.start();
    expect(httpServer.stop).toHaveBeenCalledTimes(0);
    await service.stop();
    expect(httpServer.stop).toHaveBeenCalledTimes(1);
});
test('stops not ready server if it is running', async () => {
    const configService = createConfigService();
    const mockHapiServer = {
        start: jest.fn(),
        stop: jest.fn(),
        route: jest.fn(),
    };
    const httpServer = {
        isListening: () => false,
        setup: jest.fn().mockReturnValue({ server: mockHapiServer }),
        start: lodash_1.noop,
        stop: jest.fn(),
    };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => httpServer);
    const service = new _1.HttpService({ coreId, configService, env, logger });
    await service.setup(setupDeps);
    await service.stop();
    expect(mockHapiServer.stop).toHaveBeenCalledTimes(1);
});
test('register route handler', async () => {
    const configService = createConfigService();
    const registerRouterMock = jest.fn();
    const httpServer = {
        isListening: () => false,
        setup: jest
            .fn()
            .mockReturnValue({ server: fakeHapiServer, registerRouter: registerRouterMock }),
        start: lodash_1.noop,
        stop: lodash_1.noop,
    };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => httpServer);
    const service = new _1.HttpService({ coreId, configService, env, logger });
    const { createRouter } = await service.setup(setupDeps);
    const router = createRouter('/foo');
    expect(registerRouterMock).toHaveBeenCalledTimes(1);
    expect(registerRouterMock).toHaveBeenLastCalledWith(router);
});
test('returns http server contract on setup', async () => {
    const configService = createConfigService();
    const httpServer = { server: fakeHapiServer, options: { someOption: true } };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => ({
        isListening: () => false,
        setup: jest.fn().mockReturnValue(httpServer),
        stop: lodash_1.noop,
    }));
    const service = new _1.HttpService({ coreId, configService, env, logger });
    const setupContract = await service.setup(setupDeps);
    expect(setupContract).toMatchObject(httpServer);
    expect(setupContract).toMatchObject({
        createRouter: expect.any(Function),
    });
});
test('does not start http server if process is dev cluster master', async () => {
    const configService = createConfigService();
    const httpServer = {
        isListening: () => false,
        setup: jest.fn().mockReturnValue({}),
        start: jest.fn(),
        stop: lodash_1.noop,
    };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => httpServer);
    const service = new _1.HttpService({
        coreId,
        configService,
        env: new config_1.Env('.', env_1.getEnvOptions({ isDevClusterMaster: true })),
        logger,
    });
    await service.setup(setupDeps);
    await service.start();
    expect(httpServer.start).not.toHaveBeenCalled();
});
test('does not start http server if configured with `autoListen:false`', async () => {
    const configService = createConfigService({
        autoListen: false,
    });
    const httpServer = {
        isListening: () => false,
        setup: jest.fn().mockReturnValue({}),
        start: jest.fn(),
        stop: lodash_1.noop,
    };
    http_service_test_mocks_1.mockHttpServer.mockImplementation(() => httpServer);
    const service = new _1.HttpService({
        coreId,
        configService,
        env: new config_1.Env('.', env_1.getEnvOptions()),
        logger,
    });
    await service.setup(setupDeps);
    await service.start();
    expect(httpServer.start).not.toHaveBeenCalled();
});
