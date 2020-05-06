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
const server_test_mocks_1 = require("./server.test.mocks");
const rxjs_1 = require("rxjs");
const config_1 = require("./config");
const server_1 = require("./server");
const env_1 = require("./config/__mocks__/env");
const logging_service_mock_1 = require("./logging/logging_service.mock");
const raw_config_service_mock_1 = require("./config/raw_config_service.mock");
const env = new config_1.Env('.', env_1.getEnvOptions());
const logger = logging_service_mock_1.loggingServiceMock.create();
const rawConfigService = raw_config_service_mock_1.rawConfigServiceMock.create({});
beforeEach(() => {
    server_test_mocks_1.mockConfigService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ autoListen: true }));
    server_test_mocks_1.mockPluginsService.discover.mockResolvedValue({
        pluginTree: new Map(),
        uiPlugins: { internal: new Map(), public: new Map(), browserConfigs: new Map() },
    });
});
afterEach(() => {
    jest.clearAllMocks();
});
test('sets up services on "setup"', async () => {
    const server = new server_1.Server(rawConfigService, env, logger);
    expect(server_test_mocks_1.mockHttpService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockElasticsearchService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockPluginsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockLegacyService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockSavedObjectsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockUiSettingsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockRenderingService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockMetricsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockStatusService.setup).not.toHaveBeenCalled();
    await server.setup();
    expect(server_test_mocks_1.mockHttpService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockElasticsearchService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockPluginsService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockLegacyService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockSavedObjectsService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockUiSettingsService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockRenderingService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockMetricsService.setup).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockStatusService.setup).toHaveBeenCalledTimes(1);
});
test('injects legacy dependency to context#setup()', async () => {
    const server = new server_1.Server(rawConfigService, env, logger);
    const pluginA = Symbol();
    const pluginB = Symbol();
    const pluginDependencies = new Map([
        [pluginA, []],
        [pluginB, [pluginA]],
    ]);
    server_test_mocks_1.mockPluginsService.discover.mockResolvedValue({
        pluginTree: pluginDependencies,
        uiPlugins: { internal: new Map(), public: new Map(), browserConfigs: new Map() },
    });
    await server.setup();
    expect(server_test_mocks_1.mockContextService.setup).toHaveBeenCalledWith({
        pluginDependencies: new Map([
            [pluginA, []],
            [pluginB, [pluginA]],
            [server_test_mocks_1.mockLegacyService.legacyId, [pluginA, pluginB]],
        ]),
    });
});
test('runs services on "start"', async () => {
    const server = new server_1.Server(rawConfigService, env, logger);
    expect(server_test_mocks_1.mockHttpService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockLegacyService.start).not.toHaveBeenCalled();
    await server.setup();
    expect(server_test_mocks_1.mockHttpService.start).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockLegacyService.start).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockSavedObjectsService.start).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockUiSettingsService.start).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockMetricsService.start).not.toHaveBeenCalled();
    await server.start();
    expect(server_test_mocks_1.mockHttpService.start).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockLegacyService.start).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockSavedObjectsService.start).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockUiSettingsService.start).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockMetricsService.start).toHaveBeenCalledTimes(1);
});
test('does not fail on "setup" if there are unused paths detected', async () => {
    server_test_mocks_1.mockConfigService.getUnusedPaths.mockResolvedValue(['some.path', 'another.path']);
    const server = new server_1.Server(rawConfigService, env, logger);
    await expect(server.setup()).resolves.toBeDefined();
});
test('stops services on "stop"', async () => {
    const server = new server_1.Server(rawConfigService, env, logger);
    await server.setup();
    expect(server_test_mocks_1.mockHttpService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockElasticsearchService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockPluginsService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockLegacyService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockSavedObjectsService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockUiSettingsService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockMetricsService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockStatusService.stop).not.toHaveBeenCalled();
    await server.stop();
    expect(server_test_mocks_1.mockHttpService.stop).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockElasticsearchService.stop).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockPluginsService.stop).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockLegacyService.stop).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockSavedObjectsService.stop).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockUiSettingsService.stop).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockMetricsService.stop).toHaveBeenCalledTimes(1);
    expect(server_test_mocks_1.mockStatusService.stop).toHaveBeenCalledTimes(1);
});
test(`doesn't setup core services if config validation fails`, async () => {
    server_test_mocks_1.mockConfigService.validate.mockImplementationOnce(() => {
        return Promise.reject(new Error('invalid config'));
    });
    const server = new server_1.Server(rawConfigService, env, logger);
    await expect(server.setup()).rejects.toThrowErrorMatchingInlineSnapshot(`"invalid config"`);
    expect(server_test_mocks_1.mockHttpService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockElasticsearchService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockPluginsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockLegacyService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockUiSettingsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockRenderingService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockMetricsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockStatusService.setup).not.toHaveBeenCalled();
});
test(`doesn't setup core services if legacy config validation fails`, async () => {
    server_test_mocks_1.mockEnsureValidConfiguration.mockImplementation(() => {
        throw new Error('Unknown configuration keys');
    });
    const server = new server_1.Server(rawConfigService, env, logger);
    await expect(server.setup()).rejects.toThrowErrorMatchingInlineSnapshot(`"Unknown configuration keys"`);
    expect(server_test_mocks_1.mockHttpService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockElasticsearchService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockPluginsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockLegacyService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockSavedObjectsService.stop).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockUiSettingsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockMetricsService.setup).not.toHaveBeenCalled();
    expect(server_test_mocks_1.mockStatusService.setup).not.toHaveBeenCalled();
});
