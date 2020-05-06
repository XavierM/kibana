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
const index_test_mocks_1 = require("./index.test.mocks");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const _1 = require(".");
const config_1 = require("../config");
const env_1 = require("../config/__mocks__/env");
const env = new config_1.Env('.', env_1.getEnvOptions());
let mockConsoleError;
beforeEach(() => {
    jest.spyOn(global.process, 'exit').mockReturnValue(undefined);
    mockConsoleError = jest.spyOn(console, 'error').mockReturnValue(undefined);
    index_test_mocks_1.rawConfigService.getConfig$.mockReturnValue(new rxjs_1.BehaviorSubject({ someValue: 'foo' }));
    index_test_mocks_1.configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ someValue: 'foo' }));
});
afterEach(() => {
    jest.restoreAllMocks();
    index_test_mocks_1.logger.asLoggerFactory.mockClear();
    index_test_mocks_1.logger.stop.mockClear();
    index_test_mocks_1.rawConfigService.getConfig$.mockClear();
    index_test_mocks_1.logger.upgrade.mockReset();
    index_test_mocks_1.configService.atPath.mockReset();
    index_test_mocks_1.mockServer.setup.mockReset();
    index_test_mocks_1.mockServer.stop.mockReset();
});
test('sets up services on "setup"', async () => {
    const root = new _1.Root(index_test_mocks_1.rawConfigService, env);
    expect(index_test_mocks_1.logger.upgrade).not.toHaveBeenCalled();
    expect(index_test_mocks_1.mockServer.setup).not.toHaveBeenCalled();
    await root.setup();
    expect(index_test_mocks_1.logger.upgrade).toHaveBeenCalledTimes(1);
    expect(index_test_mocks_1.logger.upgrade).toHaveBeenLastCalledWith({ someValue: 'foo' });
    expect(index_test_mocks_1.mockServer.setup).toHaveBeenCalledTimes(1);
});
test('upgrades logging configuration after setup', async () => {
    const mockLoggingConfig$ = new rxjs_1.BehaviorSubject({ someValue: 'foo' });
    index_test_mocks_1.configService.atPath.mockReturnValue(mockLoggingConfig$);
    const root = new _1.Root(index_test_mocks_1.rawConfigService, env);
    await root.setup();
    expect(index_test_mocks_1.logger.upgrade).toHaveBeenCalledTimes(1);
    expect(index_test_mocks_1.logger.upgrade).toHaveBeenLastCalledWith({ someValue: 'foo' });
    index_test_mocks_1.logger.upgrade.mockClear();
    mockLoggingConfig$.next({ someValue: 'bar' });
    expect(index_test_mocks_1.logger.upgrade).toHaveBeenCalledTimes(1);
    expect(index_test_mocks_1.logger.upgrade).toHaveBeenLastCalledWith({ someValue: 'bar' });
});
test('stops services on "shutdown"', async () => {
    const mockOnShutdown = jest.fn();
    const root = new _1.Root(index_test_mocks_1.rawConfigService, env, mockOnShutdown);
    await root.setup();
    expect(mockOnShutdown).not.toHaveBeenCalled();
    expect(index_test_mocks_1.logger.stop).not.toHaveBeenCalled();
    expect(index_test_mocks_1.mockServer.stop).not.toHaveBeenCalled();
    await root.shutdown();
    expect(mockOnShutdown).toHaveBeenCalledTimes(1);
    expect(mockOnShutdown).toHaveBeenCalledWith(undefined);
    expect(index_test_mocks_1.logger.stop).toHaveBeenCalledTimes(1);
    expect(index_test_mocks_1.mockServer.stop).toHaveBeenCalledTimes(1);
});
test('stops services on "shutdown" an calls `onShutdown` with error passed to `shutdown`', async () => {
    const mockOnShutdown = jest.fn();
    const root = new _1.Root(index_test_mocks_1.rawConfigService, env, mockOnShutdown);
    await root.setup();
    expect(mockOnShutdown).not.toHaveBeenCalled();
    expect(index_test_mocks_1.logger.stop).not.toHaveBeenCalled();
    expect(index_test_mocks_1.mockServer.stop).not.toHaveBeenCalled();
    const someFatalError = new Error('some fatal error');
    await root.shutdown(someFatalError);
    expect(mockOnShutdown).toHaveBeenCalledTimes(1);
    expect(mockOnShutdown).toHaveBeenCalledWith(someFatalError);
    expect(index_test_mocks_1.logger.stop).toHaveBeenCalledTimes(1);
    expect(index_test_mocks_1.mockServer.stop).toHaveBeenCalledTimes(1);
});
test('fails and stops services if server setup fails', async () => {
    const mockOnShutdown = jest.fn();
    const root = new _1.Root(index_test_mocks_1.rawConfigService, env, mockOnShutdown);
    const serverError = new Error('server failed');
    index_test_mocks_1.mockServer.setup.mockRejectedValue(serverError);
    expect(mockOnShutdown).not.toHaveBeenCalled();
    expect(index_test_mocks_1.logger.stop).not.toHaveBeenCalled();
    expect(index_test_mocks_1.mockServer.stop).not.toHaveBeenCalled();
    await expect(root.setup()).rejects.toThrowError('server failed');
    expect(mockOnShutdown).toHaveBeenCalledTimes(1);
    expect(mockOnShutdown).toHaveBeenCalledWith(serverError);
    expect(index_test_mocks_1.logger.stop).toHaveBeenCalledTimes(1);
    expect(index_test_mocks_1.mockServer.stop).toHaveBeenCalledTimes(1);
});
test('fails and stops services if initial logger upgrade fails', async () => {
    const mockOnShutdown = jest.fn();
    const root = new _1.Root(index_test_mocks_1.rawConfigService, env, mockOnShutdown);
    const loggingUpgradeError = new Error('logging config upgrade failed');
    index_test_mocks_1.logger.upgrade.mockImplementation(() => {
        throw loggingUpgradeError;
    });
    expect(mockOnShutdown).not.toHaveBeenCalled();
    expect(index_test_mocks_1.logger.stop).not.toHaveBeenCalled();
    expect(index_test_mocks_1.mockServer.setup).not.toHaveBeenCalled();
    await expect(root.setup()).rejects.toThrowError('logging config upgrade failed');
    expect(mockOnShutdown).toHaveBeenCalledTimes(1);
    expect(mockOnShutdown).toHaveBeenCalledWith(loggingUpgradeError);
    expect(index_test_mocks_1.mockServer.setup).not.toHaveBeenCalled();
    expect(index_test_mocks_1.logger.stop).toHaveBeenCalledTimes(1);
    expect(mockConsoleError.mock.calls).toMatchSnapshot();
});
test('stops services if consequent logger upgrade fails', async () => {
    const onShutdown = new rxjs_1.BehaviorSubject(null);
    const mockOnShutdown = jest.fn(() => {
        onShutdown.next('completed');
        onShutdown.complete();
    });
    const mockLoggingConfig$ = new rxjs_1.BehaviorSubject({ someValue: 'foo' });
    index_test_mocks_1.configService.atPath.mockReturnValue(mockLoggingConfig$);
    const root = new _1.Root(index_test_mocks_1.rawConfigService, env, mockOnShutdown);
    await root.setup();
    expect(mockOnShutdown).not.toHaveBeenCalled();
    expect(index_test_mocks_1.logger.stop).not.toHaveBeenCalled();
    expect(index_test_mocks_1.mockServer.stop).not.toHaveBeenCalled();
    const loggingUpgradeError = new Error('logging config consequent upgrade failed');
    index_test_mocks_1.logger.upgrade.mockImplementation(() => {
        throw loggingUpgradeError;
    });
    mockLoggingConfig$.next({ someValue: 'bar' });
    // Wait for shutdown to be called.
    await onShutdown
        .pipe(operators_1.filter(e => e !== null), operators_1.first())
        .toPromise();
    expect(mockOnShutdown).toHaveBeenCalledTimes(1);
    expect(mockOnShutdown).toHaveBeenCalledWith(loggingUpgradeError);
    expect(index_test_mocks_1.logger.stop).toHaveBeenCalledTimes(1);
    expect(index_test_mocks_1.mockServer.stop).toHaveBeenCalledTimes(1);
    expect(mockConsoleError.mock.calls).toMatchSnapshot();
});
