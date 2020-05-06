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
const plugins_system_test_mocks_1 = require("./plugins_system.test.mocks");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const env_1 = require("../config/__mocks__/env");
const config_service_mock_1 = require("../config/config_service.mock");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const plugin_1 = require("./plugin");
const plugins_system_1 = require("./plugins_system");
const mocks_1 = require("../mocks");
const logger = logging_service_mock_1.loggingServiceMock.create();
function createPlugin(id, { required = [], optional = [], server = true, ui = true, } = {}) {
    return new plugin_1.PluginWrapper({
        path: 'some-path',
        manifest: {
            id,
            version: 'some-version',
            configPath: 'path',
            kibanaVersion: '7.0.0',
            requiredPlugins: required,
            optionalPlugins: optional,
            server,
            ui,
        },
        opaqueId: Symbol(id),
        initializerContext: { logger },
    });
}
let pluginsSystem;
const configService = config_service_mock_1.configServiceMock.create();
configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ initialize: true }));
let env;
let coreContext;
const setupDeps = mocks_1.coreMock.createInternalSetup();
const startDeps = mocks_1.coreMock.createInternalStart();
beforeEach(() => {
    env = config_1.Env.createDefault(env_1.getEnvOptions());
    coreContext = { coreId: Symbol(), env, logger, configService: configService };
    pluginsSystem = new plugins_system_1.PluginsSystem(coreContext);
});
afterEach(() => {
    jest.clearAllMocks();
});
test('can be setup even without plugins', async () => {
    const pluginsSetup = await pluginsSystem.setupPlugins(setupDeps);
    expect(pluginsSetup).toBeInstanceOf(Map);
    expect(pluginsSetup.size).toBe(0);
});
test('getPluginDependencies returns dependency tree of symbols', () => {
    pluginsSystem.addPlugin(createPlugin('plugin-a', { required: ['no-dep'] }));
    pluginsSystem.addPlugin(createPlugin('plugin-b', { required: ['plugin-a'], optional: ['no-dep', 'other'] }));
    pluginsSystem.addPlugin(createPlugin('no-dep'));
    expect(pluginsSystem.getPluginDependencies()).toMatchInlineSnapshot(`
    Map {
      Symbol(plugin-a) => Array [
        Symbol(no-dep),
      ],
      Symbol(plugin-b) => Array [
        Symbol(plugin-a),
        Symbol(no-dep),
      ],
      Symbol(no-dep) => Array [],
    }
  `);
});
test('`setupPlugins` throws plugin has missing required dependency', async () => {
    pluginsSystem.addPlugin(createPlugin('some-id', { required: ['missing-dep'] }));
    await expect(pluginsSystem.setupPlugins(setupDeps)).rejects.toMatchInlineSnapshot(`[Error: Topological ordering of plugins did not complete, these plugins have cyclic or missing dependencies: ["some-id"]]`);
});
test('`setupPlugins` throws if plugins have circular required dependency', async () => {
    pluginsSystem.addPlugin(createPlugin('no-dep'));
    pluginsSystem.addPlugin(createPlugin('depends-on-1', { required: ['depends-on-2'] }));
    pluginsSystem.addPlugin(createPlugin('depends-on-2', { required: ['depends-on-1'] }));
    await expect(pluginsSystem.setupPlugins(setupDeps)).rejects.toMatchInlineSnapshot(`[Error: Topological ordering of plugins did not complete, these plugins have cyclic or missing dependencies: ["depends-on-1","depends-on-2"]]`);
});
test('`setupPlugins` throws if plugins have circular optional dependency', async () => {
    pluginsSystem.addPlugin(createPlugin('no-dep'));
    pluginsSystem.addPlugin(createPlugin('depends-on-1', { optional: ['depends-on-2'] }));
    pluginsSystem.addPlugin(createPlugin('depends-on-2', { optional: ['depends-on-1'] }));
    await expect(pluginsSystem.setupPlugins(setupDeps)).rejects.toMatchInlineSnapshot(`[Error: Topological ordering of plugins did not complete, these plugins have cyclic or missing dependencies: ["depends-on-1","depends-on-2"]]`);
});
test('`setupPlugins` ignores missing optional dependency', async () => {
    const plugin = createPlugin('some-id', { optional: ['missing-dep'] });
    jest.spyOn(plugin, 'setup').mockResolvedValue('test');
    pluginsSystem.addPlugin(plugin);
    expect([...(await pluginsSystem.setupPlugins(setupDeps))]).toMatchInlineSnapshot(`
    Array [
      Array [
        "some-id",
        "test",
      ],
    ]
  `);
});
test('correctly orders plugins and returns exposed values for "setup" and "start"', async () => {
    const plugins = new Map([
        [
            createPlugin('order-4', { required: ['order-2'] }),
            {
                setup: { 'order-2': 'added-as-2' },
                start: { 'order-2': 'started-as-2' },
            },
        ],
        [
            createPlugin('order-0'),
            {
                setup: {},
                start: {},
            },
        ],
        [
            createPlugin('order-2', { required: ['order-1'], optional: ['order-0'] }),
            {
                setup: { 'order-1': 'added-as-3', 'order-0': 'added-as-1' },
                start: { 'order-1': 'started-as-3', 'order-0': 'started-as-1' },
            },
        ],
        [
            createPlugin('order-1', { required: ['order-0'] }),
            {
                setup: { 'order-0': 'added-as-1' },
                start: { 'order-0': 'started-as-1' },
            },
        ],
        [
            createPlugin('order-3', { required: ['order-2'], optional: ['missing-dep'] }),
            {
                setup: { 'order-2': 'added-as-2' },
                start: { 'order-2': 'started-as-2' },
            },
        ],
    ]);
    const setupContextMap = new Map();
    const startContextMap = new Map();
    [...plugins.keys()].forEach((plugin, index) => {
        jest.spyOn(plugin, 'setup').mockResolvedValue(`added-as-${index}`);
        jest.spyOn(plugin, 'start').mockResolvedValue(`started-as-${index}`);
        setupContextMap.set(plugin.name, `setup-for-${plugin.name}`);
        startContextMap.set(plugin.name, `start-for-${plugin.name}`);
        pluginsSystem.addPlugin(plugin);
    });
    plugins_system_test_mocks_1.mockCreatePluginSetupContext.mockImplementation((context, deps, plugin) => setupContextMap.get(plugin.name));
    plugins_system_test_mocks_1.mockCreatePluginStartContext.mockImplementation((context, deps, plugin) => startContextMap.get(plugin.name));
    expect([...(await pluginsSystem.setupPlugins(setupDeps))]).toMatchInlineSnapshot(`
    Array [
      Array [
        "order-0",
        "added-as-1",
      ],
      Array [
        "order-1",
        "added-as-3",
      ],
      Array [
        "order-2",
        "added-as-2",
      ],
      Array [
        "order-3",
        "added-as-4",
      ],
      Array [
        "order-4",
        "added-as-0",
      ],
    ]
  `);
    for (const [plugin, deps] of plugins) {
        expect(plugins_system_test_mocks_1.mockCreatePluginSetupContext).toHaveBeenCalledWith(coreContext, setupDeps, plugin);
        expect(plugin.setup).toHaveBeenCalledTimes(1);
        expect(plugin.setup).toHaveBeenCalledWith(setupContextMap.get(plugin.name), deps.setup);
    }
    expect([...(await pluginsSystem.startPlugins(startDeps))]).toMatchInlineSnapshot(`
    Array [
      Array [
        "order-0",
        "started-as-1",
      ],
      Array [
        "order-1",
        "started-as-3",
      ],
      Array [
        "order-2",
        "started-as-2",
      ],
      Array [
        "order-3",
        "started-as-4",
      ],
      Array [
        "order-4",
        "started-as-0",
      ],
    ]
  `);
    for (const [plugin, deps] of plugins) {
        expect(plugins_system_test_mocks_1.mockCreatePluginStartContext).toHaveBeenCalledWith(coreContext, startDeps, plugin);
        expect(plugin.start).toHaveBeenCalledTimes(1);
        expect(plugin.start).toHaveBeenCalledWith(startContextMap.get(plugin.name), deps.start);
    }
});
test('`setupPlugins` only setups plugins that have server side', async () => {
    const firstPluginToRun = createPlugin('order-0');
    const secondPluginNotToRun = createPlugin('order-not-run', { server: false });
    const thirdPluginToRun = createPlugin('order-1');
    [firstPluginToRun, secondPluginNotToRun, thirdPluginToRun].forEach((plugin, index) => {
        jest.spyOn(plugin, 'setup').mockResolvedValue(`added-as-${index}`);
        pluginsSystem.addPlugin(plugin);
    });
    expect([...(await pluginsSystem.setupPlugins(setupDeps))]).toMatchInlineSnapshot(`
    Array [
      Array [
        "order-1",
        "added-as-2",
      ],
      Array [
        "order-0",
        "added-as-0",
      ],
    ]
  `);
    expect(plugins_system_test_mocks_1.mockCreatePluginSetupContext).toHaveBeenCalledWith(coreContext, setupDeps, firstPluginToRun);
    expect(plugins_system_test_mocks_1.mockCreatePluginSetupContext).not.toHaveBeenCalledWith(coreContext, secondPluginNotToRun);
    expect(plugins_system_test_mocks_1.mockCreatePluginSetupContext).toHaveBeenCalledWith(coreContext, setupDeps, thirdPluginToRun);
    expect(firstPluginToRun.setup).toHaveBeenCalledTimes(1);
    expect(secondPluginNotToRun.setup).not.toHaveBeenCalled();
    expect(thirdPluginToRun.setup).toHaveBeenCalledTimes(1);
});
test('`uiPlugins` returns empty Map before plugins are added', async () => {
    expect(pluginsSystem.uiPlugins()).toMatchInlineSnapshot(`Map {}`);
});
test('`uiPlugins` returns ordered Maps of all plugin manifests', async () => {
    const plugins = new Map([
        [createPlugin('order-4', { required: ['order-2'] }), { 'order-2': 'added-as-2' }],
        [createPlugin('order-0'), {}],
        [
            createPlugin('order-2', { required: ['order-1'], optional: ['order-0'] }),
            { 'order-1': 'added-as-3', 'order-0': 'added-as-1' },
        ],
        [createPlugin('order-1', { required: ['order-0'] }), { 'order-0': 'added-as-1' }],
        [
            createPlugin('order-3', { required: ['order-2'], optional: ['missing-dep'] }),
            { 'order-2': 'added-as-2' },
        ],
    ]);
    [...plugins.keys()].forEach(plugin => {
        pluginsSystem.addPlugin(plugin);
    });
    expect([...pluginsSystem.uiPlugins().keys()]).toMatchInlineSnapshot(`
    Array [
      "order-0",
      "order-1",
      "order-2",
      "order-3",
      "order-4",
    ]
  `);
});
test('`uiPlugins` returns only ui plugin dependencies', async () => {
    const plugins = [
        createPlugin('ui-plugin', {
            required: ['req-ui', 'req-no-ui'],
            optional: ['opt-ui', 'opt-no-ui'],
            ui: true,
            server: false,
        }),
        createPlugin('req-ui', { ui: true, server: false }),
        createPlugin('req-no-ui', { ui: false, server: true }),
        createPlugin('opt-ui', { ui: true, server: false }),
        createPlugin('opt-no-ui', { ui: false, server: true }),
    ];
    plugins.forEach(plugin => {
        pluginsSystem.addPlugin(plugin);
    });
    const plugin = pluginsSystem.uiPlugins().get('ui-plugin');
    expect(plugin.requiredPlugins).toEqual(['req-ui']);
    expect(plugin.optionalPlugins).toEqual(['opt-ui']);
});
test('can start without plugins', async () => {
    await pluginsSystem.setupPlugins(setupDeps);
    const pluginsStart = await pluginsSystem.startPlugins(startDeps);
    expect(pluginsStart).toBeInstanceOf(Map);
    expect(pluginsStart.size).toBe(0);
});
test('`startPlugins` only starts plugins that were setup', async () => {
    const firstPluginToRun = createPlugin('order-0');
    const secondPluginNotToRun = createPlugin('order-not-run', { server: false });
    const thirdPluginToRun = createPlugin('order-1');
    [firstPluginToRun, secondPluginNotToRun, thirdPluginToRun].forEach((plugin, index) => {
        jest.spyOn(plugin, 'setup').mockResolvedValue(`setup-as-${index}`);
        jest.spyOn(plugin, 'start').mockResolvedValue(`started-as-${index}`);
        pluginsSystem.addPlugin(plugin);
    });
    await pluginsSystem.setupPlugins(setupDeps);
    const result = await pluginsSystem.startPlugins(startDeps);
    expect([...result]).toMatchInlineSnapshot(`
    Array [
      Array [
        "order-1",
        "started-as-2",
      ],
      Array [
        "order-0",
        "started-as-0",
      ],
    ]
  `);
});
describe('setup', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    it('throws timeout error if "setup" was not completed in 30 sec.', async () => {
        const plugin = createPlugin('timeout-setup');
        jest.spyOn(plugin, 'setup').mockImplementation(() => new Promise(i => i));
        pluginsSystem.addPlugin(plugin);
        plugins_system_test_mocks_1.mockCreatePluginSetupContext.mockImplementation(() => ({}));
        const promise = pluginsSystem.setupPlugins(setupDeps);
        jest.runAllTimers();
        await expect(promise).rejects.toMatchInlineSnapshot(`[Error: Setup lifecycle of "timeout-setup" plugin wasn't completed in 30sec. Consider disabling the plugin and re-start.]`);
    });
});
describe('start', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    it('throws timeout error if "start" was not completed in 30 sec.', async () => {
        const plugin = createPlugin('timeout-start');
        jest.spyOn(plugin, 'setup').mockResolvedValue({});
        jest.spyOn(plugin, 'start').mockImplementation(() => new Promise(i => i));
        pluginsSystem.addPlugin(plugin);
        plugins_system_test_mocks_1.mockCreatePluginSetupContext.mockImplementation(() => ({}));
        plugins_system_test_mocks_1.mockCreatePluginStartContext.mockImplementation(() => ({}));
        await pluginsSystem.setupPlugins(setupDeps);
        const promise = pluginsSystem.startPlugins(startDeps);
        jest.runAllTimers();
        await expect(promise).rejects.toMatchInlineSnapshot(`[Error: Start lifecycle of "timeout-start" plugin wasn't completed in 30sec. Consider disabling the plugin and re-start.]`);
    });
});
