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
const plugins_service_test_mocks_1 = require("./plugins_service.test.mocks");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const config_schema_1 = require("@kbn/config-schema");
const dev_utils_1 = require("@kbn/dev-utils");
const config_1 = require("../config");
const raw_config_service_mock_1 = require("../config/raw_config_service.mock");
const env_1 = require("../config/__mocks__/env");
const mocks_1 = require("../mocks");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const discovery_1 = require("./discovery");
const plugin_1 = require("./plugin");
const plugins_service_1 = require("./plugins_service");
const plugins_system_1 = require("./plugins_system");
const plugins_config_1 = require("./plugins_config");
const operators_1 = require("rxjs/operators");
const MockPluginsSystem = plugins_system_1.PluginsSystem;
let pluginsService;
let config$;
let configService;
let coreId;
let env;
let mockPluginSystem;
const setupDeps = mocks_1.coreMock.createInternalSetup();
const logger = logging_service_mock_1.loggingServiceMock.create();
expect.addSnapshotSerializer(dev_utils_1.createAbsolutePathSerializer());
['path-1', 'path-2', 'path-3', 'path-4', 'path-5'].forEach(path => {
    jest.doMock(path_1.join(path, 'server'), () => ({}), {
        virtual: true,
    });
});
const createPlugin = (id, { path = id, disabled = false, version = 'some-version', requiredPlugins = [], optionalPlugins = [], kibanaVersion = '7.0.0', configPath = [path], server = true, ui = true, }) => {
    return new plugin_1.PluginWrapper({
        path,
        manifest: {
            id,
            version,
            configPath: `${configPath}${disabled ? '-disabled' : ''}`,
            kibanaVersion,
            requiredPlugins,
            optionalPlugins,
            server,
            ui,
        },
        opaqueId: Symbol(id),
        initializerContext: { logger },
    });
};
describe('PluginsService', () => {
    beforeEach(async () => {
        plugins_service_test_mocks_1.mockPackage.raw = {
            branch: 'feature-v1',
            version: 'v1',
            build: {
                distributable: true,
                number: 100,
                sha: 'feature-v1-build-sha',
            },
        };
        coreId = Symbol('core');
        env = config_1.Env.createDefault(env_1.getEnvOptions());
        config$ = new rxjs_1.BehaviorSubject({ plugins: { initialize: true } });
        const rawConfigService = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig$: config$ });
        configService = new config_1.ConfigService(rawConfigService, env, logger);
        await configService.setSchema(plugins_config_1.config.path, plugins_config_1.config.schema);
        pluginsService = new plugins_service_1.PluginsService({ coreId, env, logger, configService });
        [mockPluginSystem] = MockPluginsSystem.mock.instances;
        mockPluginSystem.uiPlugins.mockReturnValue(new Map());
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('#discover()', () => {
        it('throws if plugin has an invalid manifest', async () => {
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([discovery_1.PluginDiscoveryError.invalidManifest('path-1', new Error('Invalid JSON'))]),
                plugin$: rxjs_1.from([]),
            });
            await expect(pluginsService.discover()).rejects.toMatchInlineSnapshot(`
              [Error: Failed to initialize plugins:
              	Invalid JSON (invalid-manifest, path-1)]
            `);
            expect(logging_service_mock_1.loggingServiceMock.collect(logger).error).toMatchInlineSnapshot(`
        Array [
          Array [
            [Error: Invalid JSON (invalid-manifest, path-1)],
          ],
        ]
      `);
        });
        it('throws if plugin required Kibana version is incompatible with the current version', async () => {
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([
                    discovery_1.PluginDiscoveryError.incompatibleVersion('path-3', new Error('Incompatible version')),
                ]),
                plugin$: rxjs_1.from([]),
            });
            await expect(pluginsService.discover()).rejects.toMatchInlineSnapshot(`
              [Error: Failed to initialize plugins:
              	Incompatible version (incompatible-version, path-3)]
            `);
            expect(logging_service_mock_1.loggingServiceMock.collect(logger).error).toMatchInlineSnapshot(`
        Array [
          Array [
            [Error: Incompatible version (incompatible-version, path-3)],
          ],
        ]
      `);
        });
        it('throws if discovered plugins with conflicting names', async () => {
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([
                    createPlugin('conflicting-id', {
                        path: 'path-4',
                        version: 'some-version',
                        configPath: 'path',
                        requiredPlugins: ['some-required-plugin', 'some-required-plugin-2'],
                        optionalPlugins: ['some-optional-plugin'],
                    }),
                    createPlugin('conflicting-id', {
                        path: 'path-4',
                        version: 'some-version',
                        configPath: 'path',
                        requiredPlugins: ['some-required-plugin', 'some-required-plugin-2'],
                        optionalPlugins: ['some-optional-plugin'],
                    }),
                ]),
            });
            await expect(pluginsService.discover()).rejects.toMatchInlineSnapshot(`[Error: Plugin with id "conflicting-id" is already registered!]`);
            expect(mockPluginSystem.addPlugin).not.toHaveBeenCalled();
            expect(mockPluginSystem.setupPlugins).not.toHaveBeenCalled();
        });
        it('properly detects plugins that should be disabled.', async () => {
            jest
                .spyOn(configService, 'isEnabledAtPath')
                .mockImplementation(path => Promise.resolve(!path.includes('disabled')));
            mockPluginSystem.setupPlugins.mockResolvedValue(new Map());
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([
                    createPlugin('explicitly-disabled-plugin', {
                        disabled: true,
                        path: 'path-1',
                        configPath: 'path-1',
                    }),
                    createPlugin('plugin-with-missing-required-deps', {
                        path: 'path-2',
                        configPath: 'path-2',
                        requiredPlugins: ['missing-plugin'],
                    }),
                    createPlugin('plugin-with-disabled-transitive-dep', {
                        path: 'path-3',
                        configPath: 'path-3',
                        requiredPlugins: ['another-explicitly-disabled-plugin'],
                    }),
                    createPlugin('another-explicitly-disabled-plugin', {
                        disabled: true,
                        path: 'path-4',
                        configPath: 'path-4-disabled',
                    }),
                ]),
            });
            await pluginsService.discover();
            const setup = await pluginsService.setup(setupDeps);
            expect(setup.contracts).toBeInstanceOf(Map);
            expect(mockPluginSystem.addPlugin).not.toHaveBeenCalled();
            expect(mockPluginSystem.setupPlugins).toHaveBeenCalledTimes(1);
            expect(mockPluginSystem.setupPlugins).toHaveBeenCalledWith(setupDeps);
            expect(logging_service_mock_1.loggingServiceMock.collect(logger).info).toMatchInlineSnapshot(`
        Array [
          Array [
            "Plugin \\"explicitly-disabled-plugin\\" is disabled.",
          ],
          Array [
            "Plugin \\"plugin-with-missing-required-deps\\" has been disabled since some of its direct or transitive dependencies are missing or disabled.",
          ],
          Array [
            "Plugin \\"plugin-with-disabled-transitive-dep\\" has been disabled since some of its direct or transitive dependencies are missing or disabled.",
          ],
          Array [
            "Plugin \\"another-explicitly-disabled-plugin\\" is disabled.",
          ],
        ]
      `);
        });
        it('does not throw in case of mutual plugin dependencies', async () => {
            const firstPlugin = createPlugin('first-plugin', {
                path: 'path-1',
                requiredPlugins: ['second-plugin'],
            });
            const secondPlugin = createPlugin('second-plugin', {
                path: 'path-2',
                requiredPlugins: ['first-plugin'],
            });
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([firstPlugin, secondPlugin]),
            });
            const { pluginTree } = await pluginsService.discover();
            expect(pluginTree).toBeUndefined();
            expect(plugins_service_test_mocks_1.mockDiscover).toHaveBeenCalledTimes(1);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledTimes(2);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(firstPlugin);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(secondPlugin);
        });
        it('does not throw in case of cyclic plugin dependencies', async () => {
            const firstPlugin = createPlugin('first-plugin', {
                path: 'path-1',
                requiredPlugins: ['second-plugin'],
            });
            const secondPlugin = createPlugin('second-plugin', {
                path: 'path-2',
                requiredPlugins: ['third-plugin', 'last-plugin'],
            });
            const thirdPlugin = createPlugin('third-plugin', {
                path: 'path-3',
                requiredPlugins: ['last-plugin', 'first-plugin'],
            });
            const lastPlugin = createPlugin('last-plugin', {
                path: 'path-4',
                requiredPlugins: ['first-plugin'],
            });
            const missingDepsPlugin = createPlugin('missing-deps-plugin', {
                path: 'path-5',
                requiredPlugins: ['not-a-plugin'],
            });
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([firstPlugin, secondPlugin, thirdPlugin, lastPlugin, missingDepsPlugin]),
            });
            const { pluginTree } = await pluginsService.discover();
            expect(pluginTree).toBeUndefined();
            expect(plugins_service_test_mocks_1.mockDiscover).toHaveBeenCalledTimes(1);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledTimes(4);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(firstPlugin);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(secondPlugin);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(thirdPlugin);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(lastPlugin);
        });
        it('properly invokes plugin discovery and ignores non-critical errors.', async () => {
            const firstPlugin = createPlugin('some-id', {
                path: 'path-1',
                configPath: 'path',
                requiredPlugins: ['some-other-id'],
                optionalPlugins: ['missing-optional-dep'],
            });
            const secondPlugin = createPlugin('some-other-id', {
                path: 'path-2',
                version: 'some-other-version',
                configPath: ['plugin', 'path'],
            });
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([
                    discovery_1.PluginDiscoveryError.missingManifest('path-2', new Error('No manifest')),
                    discovery_1.PluginDiscoveryError.invalidSearchPath('dir-1', new Error('No dir')),
                    discovery_1.PluginDiscoveryError.invalidPluginPath('path4-1', new Error('No path')),
                ]),
                plugin$: rxjs_1.from([firstPlugin, secondPlugin]),
            });
            await pluginsService.discover();
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledTimes(2);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(firstPlugin);
            expect(mockPluginSystem.addPlugin).toHaveBeenCalledWith(secondPlugin);
            expect(plugins_service_test_mocks_1.mockDiscover).toHaveBeenCalledTimes(1);
            expect(plugins_service_test_mocks_1.mockDiscover).toHaveBeenCalledWith({
                additionalPluginPaths: [],
                initialize: true,
                pluginSearchPaths: [
                    path_1.resolve(process.cwd(), 'src', 'plugins'),
                    path_1.resolve(process.cwd(), 'x-pack', 'plugins'),
                    path_1.resolve(process.cwd(), 'plugins'),
                    path_1.resolve(process.cwd(), '..', 'kibana-extra'),
                ],
            }, { coreId, env, logger, configService });
            const logs = logging_service_mock_1.loggingServiceMock.collect(logger);
            expect(logs.info).toHaveLength(0);
            expect(logs.error).toHaveLength(0);
        });
        it('registers plugin config schema in config service', async () => {
            const configSchema = config_schema_1.schema.string();
            jest.spyOn(configService, 'setSchema').mockImplementation(() => Promise.resolve());
            jest.doMock(path_1.join('path-with-schema', 'server'), () => ({
                config: {
                    schema: configSchema,
                },
            }), {
                virtual: true,
            });
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([
                    createPlugin('some-id', {
                        path: 'path-with-schema',
                        configPath: 'path',
                    }),
                ]),
            });
            await pluginsService.discover();
            expect(configService.setSchema).toBeCalledWith('path', configSchema);
        });
        it('registers plugin config deprecation provider in config service', async () => {
            const configSchema = config_schema_1.schema.string();
            jest.spyOn(configService, 'setSchema').mockImplementation(() => Promise.resolve());
            jest.spyOn(configService, 'addDeprecationProvider');
            const deprecationProvider = () => [];
            jest.doMock(path_1.join('path-with-provider', 'server'), () => ({
                config: {
                    schema: configSchema,
                    deprecations: deprecationProvider,
                },
            }), {
                virtual: true,
            });
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([
                    createPlugin('some-id', {
                        path: 'path-with-provider',
                        configPath: 'config-path',
                    }),
                ]),
            });
            await pluginsService.discover();
            expect(configService.addDeprecationProvider).toBeCalledWith('config-path', deprecationProvider);
        });
    });
    describe('#generateUiPluginsConfigs()', () => {
        const pluginToDiscoveredEntry = (plugin) => [
            plugin.name,
            {
                id: plugin.name,
                configPath: plugin.manifest.configPath,
                requiredPlugins: [],
                optionalPlugins: [],
            },
        ];
        it('properly generates client configs for plugins according to `exposeToBrowser`', async () => {
            jest.doMock(path_1.join('plugin-with-expose', 'server'), () => ({
                config: {
                    exposeToBrowser: {
                        sharedProp: true,
                    },
                    schema: config_schema_1.schema.object({
                        serverProp: config_schema_1.schema.string({ defaultValue: 'serverProp default value' }),
                        sharedProp: config_schema_1.schema.string({ defaultValue: 'sharedProp default value' }),
                    }),
                },
            }), {
                virtual: true,
            });
            const plugin = createPlugin('plugin-with-expose', {
                path: 'plugin-with-expose',
                configPath: 'path',
            });
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([plugin]),
            });
            mockPluginSystem.uiPlugins.mockReturnValue(new Map([pluginToDiscoveredEntry(plugin)]));
            const { uiPlugins } = await pluginsService.discover();
            const uiConfig$ = uiPlugins.browserConfigs.get('plugin-with-expose');
            expect(uiConfig$).toBeDefined();
            const uiConfig = await uiConfig$.pipe(operators_1.take(1)).toPromise();
            expect(uiConfig).toMatchInlineSnapshot(`
        Object {
          "sharedProp": "sharedProp default value",
        }
      `);
        });
        it('does not generate config for plugins not exposing to client', async () => {
            jest.doMock(path_1.join('plugin-without-expose', 'server'), () => ({
                config: {
                    schema: config_schema_1.schema.object({
                        serverProp: config_schema_1.schema.string({ defaultValue: 'serverProp default value' }),
                    }),
                },
            }), {
                virtual: true,
            });
            const plugin = createPlugin('plugin-without-expose', {
                path: 'plugin-without-expose',
                configPath: 'path',
            });
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([plugin]),
            });
            mockPluginSystem.uiPlugins.mockReturnValue(new Map([pluginToDiscoveredEntry(plugin)]));
            const { uiPlugins } = await pluginsService.discover();
            expect([...uiPlugins.browserConfigs.entries()]).toHaveLength(0);
        });
    });
    describe('#setup()', () => {
        beforeEach(() => {
            plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
                error$: rxjs_1.from([]),
                plugin$: rxjs_1.from([
                    createPlugin('plugin-1', {
                        path: 'path-1',
                        version: 'some-version',
                        configPath: 'plugin1',
                    }),
                    createPlugin('plugin-2', {
                        path: 'path-2',
                        version: 'some-version',
                        configPath: 'plugin2',
                    }),
                ]),
            });
            mockPluginSystem.uiPlugins.mockReturnValue(new Map());
        });
        describe('uiPlugins.internal', () => {
            it('includes disabled plugins', async () => {
                config$.next({ plugins: { initialize: true }, plugin1: { enabled: false } });
                const { uiPlugins } = await pluginsService.discover();
                expect(uiPlugins.internal).toMatchInlineSnapshot(`
          Map {
            "plugin-1" => Object {
              "publicAssetsDir": <absolute path>/path-1/public/assets,
              "publicTargetDir": <absolute path>/path-1/target/public,
            },
            "plugin-2" => Object {
              "publicAssetsDir": <absolute path>/path-2/public/assets,
              "publicTargetDir": <absolute path>/path-2/target/public,
            },
          }
        `);
            });
        });
        describe('plugin initialization', () => {
            it('does initialize if plugins.initialize is true', async () => {
                config$.next({ plugins: { initialize: true } });
                await pluginsService.discover();
                const { initialized } = await pluginsService.setup(setupDeps);
                expect(mockPluginSystem.setupPlugins).toHaveBeenCalled();
                expect(initialized).toBe(true);
            });
            it('does not initialize if plugins.initialize is false', async () => {
                config$.next({ plugins: { initialize: false } });
                await pluginsService.discover();
                const { initialized } = await pluginsService.setup(setupDeps);
                expect(mockPluginSystem.setupPlugins).not.toHaveBeenCalled();
                expect(initialized).toBe(false);
            });
        });
    });
    describe('#stop()', () => {
        it('`stop` stops plugins system', async () => {
            await pluginsService.stop();
            expect(mockPluginSystem.stopPlugins).toHaveBeenCalledTimes(1);
        });
    });
});
