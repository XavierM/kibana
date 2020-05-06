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
const lodash_1 = require("lodash");
const plugins_service_test_mocks_1 = require("./plugins_service.test.mocks");
const mocks_1 = require("../mocks");
const plugins_service_1 = require("./plugins_service");
const notifications_service_mock_1 = require("../notifications/notifications_service.mock");
const application_service_mock_1 = require("../application/application_service.mock");
const i18n_service_mock_1 = require("../i18n/i18n_service.mock");
const overlay_service_mock_1 = require("../overlays/overlay_service.mock");
const chrome_service_mock_1 = require("../chrome/chrome_service.mock");
const fatal_errors_service_mock_1 = require("../fatal_errors/fatal_errors_service.mock");
const ui_settings_service_mock_1 = require("../ui_settings/ui_settings_service.mock");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const doc_links_service_mock_1 = require("../doc_links/doc_links_service.mock");
const saved_objects_service_mock_1 = require("../saved_objects/saved_objects_service.mock");
const context_service_mock_1 = require("../context/context_service.mock");
plugins_service_test_mocks_1.mockPluginInitializerProvider.mockImplementation(pluginName => exports.mockPluginInitializers.get(pluginName));
let plugins;
const mockCoreContext = mocks_1.coreMock.createCoreContext();
let mockSetupDeps;
let mockSetupContext;
let mockStartDeps;
let mockStartContext;
function createManifest(id, { required = [], optional = [] } = {}) {
    return {
        id,
        version: 'some-version',
        configPath: ['path'],
        requiredPlugins: required,
        optionalPlugins: optional,
    };
}
describe('PluginsService', () => {
    beforeEach(() => {
        plugins = [
            { id: 'pluginA', plugin: createManifest('pluginA') },
            { id: 'pluginB', plugin: createManifest('pluginB', { required: ['pluginA'] }) },
            {
                id: 'pluginC',
                plugin: createManifest('pluginC', { required: ['pluginA'], optional: ['nonexist'] }),
            },
        ];
        mockSetupDeps = {
            application: application_service_mock_1.applicationServiceMock.createInternalSetupContract(),
            context: context_service_mock_1.contextServiceMock.createSetupContract(),
            fatalErrors: fatal_errors_service_mock_1.fatalErrorsServiceMock.createSetupContract(),
            http: http_service_mock_1.httpServiceMock.createSetupContract(),
            injectedMetadata: lodash_1.pick(injected_metadata_service_mock_1.injectedMetadataServiceMock.createStartContract(), 'getInjectedVar'),
            notifications: notifications_service_mock_1.notificationServiceMock.createSetupContract(),
            uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract(),
        };
        mockSetupContext = {
            ...mockSetupDeps,
            application: expect.any(Object),
            getStartServices: expect.any(Function),
        };
        mockStartDeps = {
            application: application_service_mock_1.applicationServiceMock.createInternalStartContract(),
            docLinks: doc_links_service_mock_1.docLinksServiceMock.createStartContract(),
            http: http_service_mock_1.httpServiceMock.createStartContract(),
            chrome: chrome_service_mock_1.chromeServiceMock.createStartContract(),
            i18n: i18n_service_mock_1.i18nServiceMock.createStartContract(),
            injectedMetadata: lodash_1.pick(injected_metadata_service_mock_1.injectedMetadataServiceMock.createStartContract(), 'getInjectedVar'),
            notifications: notifications_service_mock_1.notificationServiceMock.createStartContract(),
            overlays: overlay_service_mock_1.overlayServiceMock.createStartContract(),
            uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createStartContract(),
            savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createStartContract(),
            fatalErrors: fatal_errors_service_mock_1.fatalErrorsServiceMock.createStartContract(),
        };
        mockStartContext = {
            ...mockStartDeps,
            application: expect.any(Object),
            chrome: lodash_1.omit(mockStartDeps.chrome, 'getComponent'),
        };
        // Reset these for each test.
        exports.mockPluginInitializers = new Map([
            [
                'pluginA',
                jest.fn(() => ({
                    setup: jest.fn(() => ({ setupValue: 1 })),
                    start: jest.fn(() => ({ startValue: 2 })),
                    stop: jest.fn(),
                })),
            ],
            [
                'pluginB',
                jest.fn(() => ({
                    setup: jest.fn((core, deps) => ({
                        pluginAPlusB: deps.pluginA.setupValue + 1,
                    })),
                    start: jest.fn((core, deps) => ({
                        pluginAPlusB: deps.pluginA.startValue + 1,
                    })),
                    stop: jest.fn(),
                })),
            ],
            [
                'pluginC',
                jest.fn(() => ({
                    setup: jest.fn(),
                    start: jest.fn(),
                    stop: jest.fn(),
                })),
            ],
        ]);
    });
    describe('#getOpaqueIds()', () => {
        it('returns dependency tree of symbols', () => {
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            expect(pluginsService.getOpaqueIds()).toMatchInlineSnapshot(`
    Map {
      Symbol(pluginA) => Array [],
      Symbol(pluginB) => Array [
        Symbol(pluginA),
      ],
      Symbol(pluginC) => Array [
        Symbol(pluginA),
      ],
    }
  `);
        });
    });
    describe('#setup()', () => {
        it('fails if any plugin instance does not have a setup function', async () => {
            exports.mockPluginInitializers.set('pluginA', (() => ({})));
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await expect(pluginsService.setup(mockSetupDeps)).rejects.toThrowErrorMatchingInlineSnapshot(`"Instance of plugin \\"pluginA\\" does not define \\"setup\\" function."`);
        });
        it('initializes plugins with PluginInitializerContext', async () => {
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            expect(exports.mockPluginInitializers.get('pluginA')).toHaveBeenCalledWith(expect.any(Object));
            expect(exports.mockPluginInitializers.get('pluginB')).toHaveBeenCalledWith(expect.any(Object));
            expect(exports.mockPluginInitializers.get('pluginC')).toHaveBeenCalledWith(expect.any(Object));
        });
        it('initializes plugins with associated client configuration', async () => {
            const pluginConfig = {
                clientProperty: 'some value',
            };
            plugins[0].config = pluginConfig;
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            const initializerContext = exports.mockPluginInitializers.get('pluginA').mock
                .calls[0][0];
            const config = initializerContext.config.get();
            expect(config).toMatchObject(pluginConfig);
        });
        it('exposes dependent setup contracts to plugins', async () => {
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            const pluginAInstance = exports.mockPluginInitializers.get('pluginA').mock.results[0].value;
            const pluginBInstance = exports.mockPluginInitializers.get('pluginB').mock.results[0].value;
            const pluginCInstance = exports.mockPluginInitializers.get('pluginC').mock.results[0].value;
            expect(pluginAInstance.setup).toHaveBeenCalledWith(mockSetupContext, {});
            expect(pluginBInstance.setup).toHaveBeenCalledWith(mockSetupContext, {
                pluginA: { setupValue: 1 },
            });
            // Does not supply value for `nonexist` optional dep
            expect(pluginCInstance.setup).toHaveBeenCalledWith(mockSetupContext, {
                pluginA: { setupValue: 1 },
            });
        });
        it('does not set missing dependent setup contracts', async () => {
            plugins = [{ id: 'pluginD', plugin: createManifest('pluginD', { optional: ['missing'] }) }];
            exports.mockPluginInitializers.set('pluginD', jest.fn(() => ({
                setup: jest.fn(),
                start: jest.fn(),
            })));
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            // If a dependency is missing it should not be in the deps at all, not even as undefined.
            const pluginDInstance = exports.mockPluginInitializers.get('pluginD').mock.results[0].value;
            expect(pluginDInstance.setup).toHaveBeenCalledWith(mockSetupContext, {});
            const pluginDDeps = pluginDInstance.setup.mock.calls[0][1];
            expect(pluginDDeps).not.toHaveProperty('missing');
        });
        it('returns plugin setup contracts', async () => {
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            const { contracts } = await pluginsService.setup(mockSetupDeps);
            // Verify that plugin contracts were available
            expect(contracts.get('pluginA').setupValue).toEqual(1);
            expect(contracts.get('pluginB').pluginAPlusB).toEqual(2);
        });
        describe('timeout', () => {
            const flushPromises = () => new Promise(resolve => setImmediate(resolve));
            beforeAll(() => {
                jest.useFakeTimers();
            });
            afterAll(() => {
                jest.useRealTimers();
            });
            it('throws timeout error if "setup" was not completed in 30 sec.', async () => {
                exports.mockPluginInitializers.set('pluginA', jest.fn(() => ({
                    setup: jest.fn(() => new Promise(i => i)),
                    start: jest.fn(() => ({ value: 1 })),
                    stop: jest.fn(),
                })));
                const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
                const promise = pluginsService.setup(mockSetupDeps);
                await flushPromises();
                jest.runAllTimers(); // setup plugins
                await expect(promise).rejects.toMatchInlineSnapshot(`[Error: Setup lifecycle of "pluginA" plugin wasn't completed in 30sec. Consider disabling the plugin and re-start.]`);
            });
        });
    });
    describe('#start()', () => {
        it('exposes dependent start contracts to plugins', async () => {
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            await pluginsService.start(mockStartDeps);
            const pluginAInstance = exports.mockPluginInitializers.get('pluginA').mock.results[0].value;
            const pluginBInstance = exports.mockPluginInitializers.get('pluginB').mock.results[0].value;
            const pluginCInstance = exports.mockPluginInitializers.get('pluginC').mock.results[0].value;
            expect(pluginAInstance.start).toHaveBeenCalledWith(mockStartContext, {});
            expect(pluginBInstance.start).toHaveBeenCalledWith(mockStartContext, {
                pluginA: { startValue: 2 },
            });
            // Does not supply value for `nonexist` optional dep
            expect(pluginCInstance.start).toHaveBeenCalledWith(mockStartContext, {
                pluginA: { startValue: 2 },
            });
        });
        it('does not set missing dependent start contracts', async () => {
            plugins = [{ id: 'pluginD', plugin: createManifest('pluginD', { optional: ['missing'] }) }];
            exports.mockPluginInitializers.set('pluginD', jest.fn(() => ({
                setup: jest.fn(),
                start: jest.fn(),
            })));
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            await pluginsService.start(mockStartDeps);
            // If a dependency is missing it should not be in the deps at all, not even as undefined.
            const pluginDInstance = exports.mockPluginInitializers.get('pluginD').mock.results[0].value;
            expect(pluginDInstance.start).toHaveBeenCalledWith(mockStartContext, {});
            const pluginDDeps = pluginDInstance.start.mock.calls[0][1];
            expect(pluginDDeps).not.toHaveProperty('missing');
        });
        it('returns plugin start contracts', async () => {
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            const { contracts } = await pluginsService.start(mockStartDeps);
            // Verify that plugin contracts were available
            expect(contracts.get('pluginA').startValue).toEqual(2);
            expect(contracts.get('pluginB').pluginAPlusB).toEqual(3);
        });
        describe('timeout', () => {
            beforeAll(() => {
                jest.useFakeTimers();
            });
            afterAll(() => {
                jest.useRealTimers();
            });
            it('throws timeout error if "start" was not completed in 30 sec.', async () => {
                exports.mockPluginInitializers.set('pluginA', jest.fn(() => ({
                    setup: jest.fn(() => ({ value: 1 })),
                    start: jest.fn(() => new Promise(i => i)),
                    stop: jest.fn(),
                })));
                const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
                await pluginsService.setup(mockSetupDeps);
                const promise = pluginsService.start(mockStartDeps);
                jest.runAllTimers();
                await expect(promise).rejects.toMatchInlineSnapshot(`[Error: Start lifecycle of "pluginA" plugin wasn't completed in 30sec. Consider disabling the plugin and re-start.]`);
            });
        });
    });
    describe('#stop()', () => {
        it('calls the stop function on each plugin', async () => {
            const pluginsService = new plugins_service_1.PluginsService(mockCoreContext, plugins);
            await pluginsService.setup(mockSetupDeps);
            const pluginAInstance = exports.mockPluginInitializers.get('pluginA').mock.results[0].value;
            const pluginBInstance = exports.mockPluginInitializers.get('pluginB').mock.results[0].value;
            const pluginCInstance = exports.mockPluginInitializers.get('pluginC').mock.results[0].value;
            await pluginsService.stop();
            expect(pluginAInstance.stop).toHaveBeenCalled();
            expect(pluginBInstance.stop).toHaveBeenCalled();
            expect(pluginCInstance.stop).toHaveBeenCalled();
        });
    });
});
