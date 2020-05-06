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
const plugins_service_1 = require("../plugins_service");
const config_1 = require("../../config");
const env_1 = require("../../config/__mocks__/env");
const rxjs_1 = require("rxjs");
const raw_config_service_mock_1 = require("../../config/raw_config_service.mock");
const plugins_config_1 = require("../plugins_config");
const logging_service_mock_1 = require("../../logging/logging_service.mock");
const mocks_1 = require("../../mocks");
const plugin_1 = require("../plugin");
describe('PluginsService', () => {
    const logger = logging_service_mock_1.loggingServiceMock.create();
    let pluginsService;
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
        const env = config_1.Env.createDefault(env_1.getEnvOptions());
        const config$ = new rxjs_1.BehaviorSubject({
            plugins: {
                initialize: true,
            },
        });
        const rawConfigService = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig$: config$ });
        const configService = new config_1.ConfigService(rawConfigService, env, logger);
        await configService.setSchema(plugins_config_1.config.path, plugins_config_1.config.schema);
        pluginsService = new plugins_service_1.PluginsService({
            coreId: Symbol('core'),
            env,
            logger,
            configService,
        });
    });
    it("properly resolves `getStartServices` in plugin's lifecycle", async () => {
        expect.assertions(6);
        const pluginPath = 'plugin-path';
        plugins_service_test_mocks_1.mockDiscover.mockReturnValue({
            error$: rxjs_1.from([]),
            plugin$: rxjs_1.from([
                createPlugin('plugin-id', {
                    path: pluginPath,
                    configPath: 'path',
                }),
            ]),
        });
        let startDependenciesResolved = false;
        let contextFromStart = null;
        let contextFromStartService = null;
        const pluginStartContract = {
            someApi: () => 'foo',
        };
        const pluginInitializer = () => ({
            setup: async (coreSetup, deps) => {
                coreSetup.getStartServices().then(([core, plugins, pluginStart]) => {
                    startDependenciesResolved = true;
                    contextFromStartService = { core, plugins, pluginStart };
                });
            },
            start: async (core, plugins) => {
                contextFromStart = { core, plugins };
                await new Promise(resolve => setTimeout(resolve, 10));
                expect(startDependenciesResolved).toBe(false);
                return pluginStartContract;
            },
        });
        jest.doMock(path_1.join(pluginPath, 'server'), () => ({
            plugin: pluginInitializer,
        }), {
            virtual: true,
        });
        await pluginsService.discover();
        const setupDeps = mocks_1.coreMock.createInternalSetup();
        await pluginsService.setup(setupDeps);
        expect(startDependenciesResolved).toBe(false);
        const startDeps = mocks_1.coreMock.createInternalStart();
        await pluginsService.start(startDeps);
        expect(startDependenciesResolved).toBe(true);
        expect(contextFromStart.core).toEqual(contextFromStartService.core);
        expect(contextFromStart.plugins).toEqual(contextFromStartService.plugins);
        expect(contextFromStartService.pluginStart).toEqual(pluginStartContract);
    });
});
