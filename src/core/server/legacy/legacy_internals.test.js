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
const config_mock_1 = require("../config/config.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const http_server_mocks_1 = require("../http/http_server.mocks");
const legacy_service_test_mocks_1 = require("./legacy_service.test.mocks");
const legacy_internals_1 = require("./legacy_internals");
function varsProvider(vars, configValue) {
    return {
        fn: jest.fn().mockReturnValue(vars),
        pluginSpec: {
            readConfigValue: jest.fn().mockReturnValue(configValue),
        },
    };
}
describe('LegacyInternals', () => {
    describe('getInjectedUiAppVars()', () => {
        let uiExports;
        let config;
        let server;
        let legacyInternals;
        beforeEach(async () => {
            uiExports = legacy_service_test_mocks_1.findLegacyPluginSpecsMock().uiExports;
            config = config_mock_1.configMock.create();
            server = http_service_mock_1.httpServiceMock.createSetupContract().server;
            legacyInternals = new legacy_internals_1.LegacyInternals(uiExports, config, server);
        });
        it('gets with no injectors', async () => {
            await expect(legacyInternals.getInjectedUiAppVars('core')).resolves.toMatchInlineSnapshot(`Object {}`);
        });
        it('gets with no matching injectors', async () => {
            const injector = jest.fn().mockResolvedValue({ not: 'core' });
            legacyInternals.injectUiAppVars('not-core', injector);
            await expect(legacyInternals.getInjectedUiAppVars('core')).resolves.toMatchInlineSnapshot(`Object {}`);
            expect(injector).not.toHaveBeenCalled();
        });
        it('gets with single matching injector', async () => {
            const injector = jest.fn().mockResolvedValue({ is: 'core' });
            legacyInternals.injectUiAppVars('core', injector);
            await expect(legacyInternals.getInjectedUiAppVars('core')).resolves.toMatchInlineSnapshot(`
        Object {
          "is": "core",
        }
      `);
            expect(injector).toHaveBeenCalled();
        });
        it('gets with multiple matching injectors', async () => {
            const injectors = [
                jest.fn().mockResolvedValue({ is: 'core' }),
                jest.fn().mockReturnValue({ sync: 'injector' }),
                jest.fn().mockResolvedValue({ is: 'merged-core' }),
            ];
            injectors.forEach(injector => legacyInternals.injectUiAppVars('core', injector));
            await expect(legacyInternals.getInjectedUiAppVars('core')).resolves.toMatchInlineSnapshot(`
        Object {
          "is": "merged-core",
          "sync": "injector",
        }
      `);
            expect(injectors[0]).toHaveBeenCalled();
            expect(injectors[1]).toHaveBeenCalled();
            expect(injectors[2]).toHaveBeenCalled();
        });
    });
    describe('getVars()', () => {
        let uiExports;
        let config;
        let server;
        let legacyInternals;
        beforeEach(async () => {
            uiExports = legacy_service_test_mocks_1.findLegacyPluginSpecsMock().uiExports;
            config = config_mock_1.configMock.create();
            server = http_service_mock_1.httpServiceMock.createSetupContract().server;
            legacyInternals = new legacy_internals_1.LegacyInternals(uiExports, config, server);
        });
        it('gets: no default injectors, no injected vars replacers, no ui app injectors, no inject arg', async () => {
            const vars = await legacyInternals.getVars('core', http_server_mocks_1.httpServerMock.createRawRequest());
            expect(vars).toMatchInlineSnapshot(`Object {}`);
        });
        it('gets: with default injectors, no injected vars replacers, no ui app injectors, no inject arg', async () => {
            uiExports.defaultInjectedVarProviders = [
                varsProvider({ alpha: 'alpha' }),
                varsProvider({ gamma: 'gamma' }),
                varsProvider({ alpha: 'beta' }),
            ];
            const vars = await legacyInternals.getVars('core', http_server_mocks_1.httpServerMock.createRawRequest());
            expect(vars).toMatchInlineSnapshot(`
        Object {
          "alpha": "beta",
          "gamma": "gamma",
        }
      `);
        });
        it('gets: no default injectors, with injected vars replacers, with ui app injectors, no inject arg', async () => {
            uiExports.injectedVarsReplacers = [
                jest.fn(async (vars) => ({ ...vars, added: 'key' })),
                jest.fn(vars => vars),
                jest.fn(vars => ({ replaced: 'all' })),
                jest.fn(async (vars) => ({ ...vars, added: 'last-key' })),
            ];
            const request = http_server_mocks_1.httpServerMock.createRawRequest();
            const vars = await legacyInternals.getVars('core', request);
            expect(vars).toMatchInlineSnapshot(`
        Object {
          "added": "last-key",
          "replaced": "all",
        }
      `);
        });
        it('gets: no default injectors, no injected vars replacers, with ui app injectors, no inject arg', async () => {
            legacyInternals.injectUiAppVars('core', async () => ({ is: 'core' }));
            legacyInternals.injectUiAppVars('core', () => ({ sync: 'injector' }));
            legacyInternals.injectUiAppVars('core', async () => ({ is: 'merged-core' }));
            const vars = await legacyInternals.getVars('core', http_server_mocks_1.httpServerMock.createRawRequest());
            expect(vars).toMatchInlineSnapshot(`
        Object {
          "is": "merged-core",
          "sync": "injector",
        }
      `);
        });
        it('gets: no default injectors, no injected vars replacers, no ui app injectors, with inject arg', async () => {
            const vars = await legacyInternals.getVars('core', http_server_mocks_1.httpServerMock.createRawRequest(), {
                injected: 'arg',
            });
            expect(vars).toMatchInlineSnapshot(`
        Object {
          "injected": "arg",
        }
      `);
        });
        it('gets: with default injectors, with injected vars replacers, with ui app injectors, with inject arg', async () => {
            uiExports.defaultInjectedVarProviders = [
                varsProvider({ alpha: 'alpha' }),
                varsProvider({ gamma: 'gamma' }),
                varsProvider({ alpha: 'beta' }),
            ];
            uiExports.injectedVarsReplacers = [jest.fn(async (vars) => ({ ...vars, gamma: 'delta' }))];
            legacyInternals.injectUiAppVars('core', async () => ({ is: 'core' }));
            legacyInternals.injectUiAppVars('core', () => ({ sync: 'injector' }));
            legacyInternals.injectUiAppVars('core', async () => ({ is: 'merged-core' }));
            const vars = await legacyInternals.getVars('core', http_server_mocks_1.httpServerMock.createRawRequest(), {
                injected: 'arg',
                sync: 'arg',
            });
            expect(vars).toMatchInlineSnapshot(`
        Object {
          "alpha": "beta",
          "gamma": "delta",
          "injected": "arg",
          "is": "merged-core",
          "sync": "arg",
        }
      `);
        });
    });
});
