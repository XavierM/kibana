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
jest.mock('../../../legacy/server/kbn_server');
jest.mock('../../../cli/cluster/cluster_manager');
jest.mock('./config/legacy_deprecation_adapters', () => ({
    convertLegacyDeprecationProvider: (provider) => Promise.resolve(provider),
}));
const legacy_service_test_mocks_1 = require("./legacy_service.test.mocks");
const rxjs_1 = require("rxjs");
// @ts-ignore: implicit any for JS file
const cluster_manager_1 = require("../../../cli/cluster/cluster_manager");
const kbn_server_1 = tslib_1.__importDefault(require("../../../legacy/server/kbn_server"));
const config_1 = require("../config");
const env_1 = require("../config/__mocks__/env");
const http_1 = require("../http");
const config_service_mock_1 = require("../config/config_service.mock");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const context_service_mock_1 = require("../context/context_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const ui_settings_service_mock_1 = require("../ui_settings/ui_settings_service.mock");
const saved_objects_service_mock_1 = require("../saved_objects/saved_objects_service.mock");
const capabilities_service_mock_1 = require("../capabilities/capabilities_service.mock");
const http_resources_service_mock_1 = require("../http_resources/http_resources_service.mock");
const rendering_service_1 = require("../rendering/__mocks__/rendering_service");
const uuid_service_mock_1 = require("../uuid/uuid_service.mock");
const metrics_service_mock_1 = require("../metrics/metrics_service.mock");
const plugins_1 = require("./plugins");
const legacy_service_1 = require("./legacy_service");
const mocks_1 = require("../mocks");
const status_service_mock_1 = require("../status/status_service.mock");
const MockKbnServer = kbn_server_1.default;
let coreId;
let env;
let config$;
let setupDeps;
let startDeps;
const logger = logging_service_mock_1.loggingServiceMock.create();
let configService;
let uuidSetup;
beforeEach(() => {
    coreId = Symbol();
    env = config_1.Env.createDefault(env_1.getEnvOptions());
    configService = config_service_mock_1.configServiceMock.create();
    uuidSetup = uuid_service_mock_1.uuidServiceMock.createSetupContract();
    legacy_service_test_mocks_1.findLegacyPluginSpecsMock.mockClear();
    MockKbnServer.prototype.ready = jest.fn().mockReturnValue(Promise.resolve());
    MockKbnServer.prototype.listen = jest.fn();
    setupDeps = {
        core: {
            capabilities: capabilities_service_mock_1.capabilitiesServiceMock.createSetupContract(),
            context: context_service_mock_1.contextServiceMock.createSetupContract(),
            elasticsearch: { legacy: {} },
            uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract(),
            http: {
                ...http_service_mock_1.httpServiceMock.createSetupContract(),
                auth: {
                    getAuthHeaders: () => undefined,
                },
            },
            httpResources: http_resources_service_mock_1.httpResourcesMock.createSetupContract(),
            savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createInternalSetupContract(),
            plugins: {
                initialized: true,
                contracts: new Map([['plugin-id', 'plugin-value']]),
            },
            rendering: rendering_service_1.setupMock,
            metrics: metrics_service_mock_1.metricsServiceMock.createInternalSetupContract(),
            uuid: uuidSetup,
            status: status_service_mock_1.statusServiceMock.createInternalSetupContract(),
        },
        plugins: { 'plugin-id': 'plugin-value' },
        uiPlugins: {
            public: new Map([['plugin-id', {}]]),
            internal: new Map([
                [
                    'plugin-id',
                    {
                        publicTargetDir: 'path/to/target/public',
                        publicAssetsDir: '/plugins/name/assets/',
                    },
                ],
            ]),
            browserConfigs: new Map(),
        },
    };
    startDeps = {
        core: {
            ...mocks_1.coreMock.createStart(),
            savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createInternalStartContract(),
            plugins: { contracts: new Map() },
        },
        plugins: {},
    };
    config$ = new rxjs_1.BehaviorSubject(new config_1.ObjectToConfigAdapter({
        elasticsearch: { hosts: ['http://127.0.0.1'] },
        server: { autoListen: true },
    }));
    configService.getConfig$.mockReturnValue(config$);
    configService.getUsedPaths.mockResolvedValue(['foo.bar']);
});
afterEach(() => {
    jest.clearAllMocks();
});
describe('once LegacyService is set up with connection info', () => {
    test('creates legacy kbnServer and calls `listen`.', async () => {
        configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ autoListen: true }));
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        await legacyService.setup(setupDeps);
        await legacyService.start(startDeps);
        expect(MockKbnServer).toHaveBeenCalledTimes(1);
        expect(MockKbnServer).toHaveBeenCalledWith({ path: { autoListen: true }, server: { autoListen: true } }, // Because of the mock, path also gets the value
        expect.objectContaining({ get: expect.any(Function) }), expect.any(Object), { disabledPluginSpecs: [], pluginSpecs: [], uiExports: {}, navLinks: [] });
        expect(MockKbnServer.mock.calls[0][1].get()).toEqual({
            path: { autoListen: true },
            server: { autoListen: true },
        });
        const [mockKbnServer] = MockKbnServer.mock.instances;
        expect(mockKbnServer.listen).toHaveBeenCalledTimes(1);
        expect(mockKbnServer.close).not.toHaveBeenCalled();
    });
    test('creates legacy kbnServer but does not call `listen` if `autoListen: false`.', async () => {
        configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ autoListen: false }));
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        await legacyService.setup(setupDeps);
        await legacyService.start(startDeps);
        expect(MockKbnServer).toHaveBeenCalledTimes(1);
        expect(MockKbnServer).toHaveBeenCalledWith({ path: { autoListen: false }, server: { autoListen: true } }, expect.objectContaining({ get: expect.any(Function) }), expect.any(Object), { disabledPluginSpecs: [], pluginSpecs: [], uiExports: {}, navLinks: [] });
        expect(MockKbnServer.mock.calls[0][1].get()).toEqual({
            path: { autoListen: false },
            server: { autoListen: true },
        });
        const [mockKbnServer] = MockKbnServer.mock.instances;
        expect(mockKbnServer.ready).toHaveBeenCalledTimes(1);
        expect(mockKbnServer.listen).not.toHaveBeenCalled();
        expect(mockKbnServer.close).not.toHaveBeenCalled();
    });
    test('creates legacy kbnServer and closes it if `listen` fails.', async () => {
        configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ autoListen: true }));
        MockKbnServer.prototype.listen.mockRejectedValue(new Error('something failed'));
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        await legacyService.setup(setupDeps);
        await expect(legacyService.start(startDeps)).rejects.toThrowErrorMatchingInlineSnapshot(`"something failed"`);
        const [mockKbnServer] = MockKbnServer.mock.instances;
        expect(mockKbnServer.listen).toHaveBeenCalled();
        expect(mockKbnServer.close).toHaveBeenCalled();
    });
    test('throws if fails to retrieve initial config.', async () => {
        configService.getConfig$.mockReturnValue(rxjs_1.throwError(new Error('something failed')));
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await expect(legacyService.discoverPlugins()).rejects.toThrowErrorMatchingInlineSnapshot(`"something failed"`);
        await expect(legacyService.setup(setupDeps)).rejects.toThrowErrorMatchingInlineSnapshot(`"Legacy service has not discovered legacy plugins yet. Ensure LegacyService.discoverPlugins() is called before LegacyService.setup()"`);
        await expect(legacyService.start(startDeps)).rejects.toThrowErrorMatchingInlineSnapshot(`"Legacy service is not setup yet."`);
        expect(MockKbnServer).not.toHaveBeenCalled();
        expect(cluster_manager_1.ClusterManager).not.toHaveBeenCalled();
    });
    test('reconfigures logging configuration if new config is received.', async () => {
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        await legacyService.setup(setupDeps);
        await legacyService.start(startDeps);
        const [mockKbnServer] = MockKbnServer.mock.instances;
        expect(mockKbnServer.applyLoggingConfiguration).not.toHaveBeenCalled();
        config$.next(new config_1.ObjectToConfigAdapter({ logging: { verbose: true } }));
        expect(mockKbnServer.applyLoggingConfiguration.mock.calls).toMatchSnapshot(`applyLoggingConfiguration params`);
    });
    test('logs error if re-configuring fails.', async () => {
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        await legacyService.setup(setupDeps);
        await legacyService.start(startDeps);
        const [mockKbnServer] = MockKbnServer.mock.instances;
        expect(mockKbnServer.applyLoggingConfiguration).not.toHaveBeenCalled();
        expect(logging_service_mock_1.loggingServiceMock.collect(logger).error).toEqual([]);
        const configError = new Error('something went wrong');
        mockKbnServer.applyLoggingConfiguration.mockImplementation(() => {
            throw configError;
        });
        config$.next(new config_1.ObjectToConfigAdapter({ logging: { verbose: true } }));
        expect(logging_service_mock_1.loggingServiceMock.collect(logger).error).toEqual([[configError]]);
    });
    test('logs error if config service fails.', async () => {
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        await legacyService.setup(setupDeps);
        await legacyService.start(startDeps);
        const [mockKbnServer] = MockKbnServer.mock.instances;
        expect(mockKbnServer.applyLoggingConfiguration).not.toHaveBeenCalled();
        expect(logging_service_mock_1.loggingServiceMock.collect(logger).error).toEqual([]);
        const configError = new Error('something went wrong');
        config$.error(configError);
        expect(mockKbnServer.applyLoggingConfiguration).not.toHaveBeenCalled();
        expect(logging_service_mock_1.loggingServiceMock.collect(logger).error).toEqual([[configError]]);
    });
});
describe('once LegacyService is set up without connection info', () => {
    let legacyService;
    beforeEach(async () => {
        legacyService = new legacy_service_1.LegacyService({ coreId, env, logger, configService: configService });
        await legacyService.discoverPlugins();
        await legacyService.setup(setupDeps);
        await legacyService.start(startDeps);
    });
    test('creates legacy kbnServer with `autoListen: false`.', () => {
        expect(MockKbnServer).toHaveBeenCalledTimes(1);
        expect(MockKbnServer).toHaveBeenCalledWith({ path: {}, server: { autoListen: true } }, expect.objectContaining({ get: expect.any(Function) }), expect.any(Object), { disabledPluginSpecs: [], pluginSpecs: [], uiExports: {}, navLinks: [] });
        expect(MockKbnServer.mock.calls[0][1].get()).toEqual({
            path: {},
            server: { autoListen: true },
        });
    });
    test('reconfigures logging configuration if new config is received.', async () => {
        const [mockKbnServer] = MockKbnServer.mock.instances;
        expect(mockKbnServer.applyLoggingConfiguration).not.toHaveBeenCalled();
        config$.next(new config_1.ObjectToConfigAdapter({ logging: { verbose: true } }));
        expect(mockKbnServer.applyLoggingConfiguration.mock.calls).toMatchSnapshot(`applyLoggingConfiguration params`);
    });
});
describe('once LegacyService is set up in `devClusterMaster` mode', () => {
    beforeEach(() => {
        configService.atPath.mockImplementation(path => {
            return new rxjs_1.BehaviorSubject(path === 'dev' ? { basePathProxyTargetPort: 100500 } : { basePath: '/abc' });
        });
    });
    test('creates ClusterManager without base path proxy.', async () => {
        const devClusterLegacyService = new legacy_service_1.LegacyService({
            coreId,
            env: config_1.Env.createDefault(env_1.getEnvOptions({
                cliArgs: { silent: true, basePath: false },
                isDevClusterMaster: true,
            })),
            logger,
            configService: configService,
        });
        await devClusterLegacyService.discoverPlugins();
        await devClusterLegacyService.setup(setupDeps);
        await devClusterLegacyService.start(startDeps);
        expect(cluster_manager_1.ClusterManager).toHaveBeenCalledTimes(1);
        expect(cluster_manager_1.ClusterManager).toHaveBeenCalledWith(expect.objectContaining({ silent: true, basePath: false }), expect.objectContaining({
            get: expect.any(Function),
            set: expect.any(Function),
        }), undefined);
    });
    test('creates ClusterManager with base path proxy.', async () => {
        const devClusterLegacyService = new legacy_service_1.LegacyService({
            coreId,
            env: config_1.Env.createDefault(env_1.getEnvOptions({
                cliArgs: { quiet: true, basePath: true },
                isDevClusterMaster: true,
            })),
            logger,
            configService: configService,
        });
        await devClusterLegacyService.discoverPlugins();
        await devClusterLegacyService.setup(setupDeps);
        await devClusterLegacyService.start(startDeps);
        expect(cluster_manager_1.ClusterManager).toHaveBeenCalledTimes(1);
        expect(cluster_manager_1.ClusterManager).toHaveBeenCalledWith(expect.objectContaining({ quiet: true, basePath: true }), expect.objectContaining({
            get: expect.any(Function),
            set: expect.any(Function),
        }), expect.any(http_1.BasePathProxyServer));
    });
});
describe('start', () => {
    test('Cannot start without setup phase', async () => {
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await expect(legacyService.start(startDeps)).rejects.toThrowErrorMatchingInlineSnapshot(`"Legacy service is not setup yet."`);
    });
});
describe('#discoverPlugins()', () => {
    it('calls findLegacyPluginSpecs with correct parameters', async () => {
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        expect(plugins_1.findLegacyPluginSpecs).toHaveBeenCalledTimes(1);
        expect(plugins_1.findLegacyPluginSpecs).toHaveBeenCalledWith(expect.any(Object), logger, env.packageInfo);
    });
    it(`register legacy plugin's deprecation providers`, async () => {
        legacy_service_test_mocks_1.findLegacyPluginSpecsMock.mockImplementation(settings => Promise.resolve({
            pluginSpecs: [
                {
                    getDeprecationsProvider: () => undefined,
                },
                {
                    getDeprecationsProvider: () => 'providerA',
                },
                {
                    getDeprecationsProvider: () => 'providerB',
                },
            ],
            pluginExtendedConfig: settings,
            disabledPluginSpecs: [],
            uiExports: {},
            navLinks: [],
        }));
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        expect(configService.addDeprecationProvider).toHaveBeenCalledTimes(2);
        expect(configService.addDeprecationProvider).toHaveBeenCalledWith('', 'providerA');
        expect(configService.addDeprecationProvider).toHaveBeenCalledWith('', 'providerB');
    });
    it(`logs deprecations for legacy third party plugins`, async () => {
        const pluginSpecs = [
            { getId: () => 'pluginA', getDeprecationsProvider: () => undefined },
            { getId: () => 'pluginB', getDeprecationsProvider: () => undefined },
        ];
        legacy_service_test_mocks_1.findLegacyPluginSpecsMock.mockImplementation(settings => Promise.resolve({
            pluginSpecs,
            pluginExtendedConfig: settings,
            disabledPluginSpecs: [],
            uiExports: {},
            navLinks: [],
        }));
        const legacyService = new legacy_service_1.LegacyService({
            coreId,
            env,
            logger,
            configService: configService,
        });
        await legacyService.discoverPlugins();
        expect(legacy_service_test_mocks_1.logLegacyThirdPartyPluginDeprecationWarningMock).toHaveBeenCalledTimes(1);
        expect(legacy_service_test_mocks_1.logLegacyThirdPartyPluginDeprecationWarningMock).toHaveBeenCalledWith({
            specs: pluginSpecs,
            log: expect.any(Object),
        });
    });
});
test('Sets the server.uuid property on the legacy configuration', async () => {
    configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ autoListen: true }));
    const legacyService = new legacy_service_1.LegacyService({
        coreId,
        env,
        logger,
        configService: configService,
    });
    uuidSetup.getInstanceUuid.mockImplementation(() => 'UUID_FROM_SERVICE');
    const configSetMock = jest.fn();
    legacy_service_test_mocks_1.findLegacyPluginSpecsMock.mockImplementation((settings) => ({
        pluginSpecs: [],
        pluginExtendedConfig: {
            has: jest.fn(),
            get: jest.fn().mockReturnValue(settings),
            set: configSetMock,
        },
        disabledPluginSpecs: [],
        uiExports: {},
        navLinks: [],
    }));
    await legacyService.discoverPlugins();
    await legacyService.setup(setupDeps);
    expect(configSetMock).toHaveBeenCalledTimes(1);
    expect(configSetMock).toHaveBeenCalledWith('server.uuid', 'UUID_FROM_SERVICE');
});
