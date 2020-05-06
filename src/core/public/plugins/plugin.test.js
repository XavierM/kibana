"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const plugin_test_mocks_1 = require("./plugin.test.mocks");
const mocks_1 = require("../mocks");
const plugin_1 = require("./plugin");
function createManifest(id, { required = [], optional = [] } = {}) {
    return {
        id,
        version: 'some-version',
        configPath: ['path'],
        requiredPlugins: required,
        optionalPlugins: optional,
    };
}
let plugin;
const opaqueId = Symbol();
const initializerContext = mocks_1.coreMock.createPluginInitializerContext();
beforeEach(() => {
    plugin_test_mocks_1.mockPluginReader.mockClear();
    plugin_test_mocks_1.mockPlugin.setup.mockClear();
    plugin_test_mocks_1.mockPlugin.start.mockClear();
    plugin_test_mocks_1.mockPlugin.stop.mockClear();
    plugin = new plugin_1.PluginWrapper(createManifest('plugin-a'), opaqueId, initializerContext);
});
describe('PluginWrapper', () => {
    test('`setup` fails if plugin.setup is not a function', async () => {
        plugin_test_mocks_1.mockInitializer.mockReturnValueOnce({ start: jest.fn() });
        await expect(plugin.setup({}, {})).rejects.toThrowErrorMatchingInlineSnapshot(`"Instance of plugin \\"plugin-a\\" does not define \\"setup\\" function."`);
    });
    test('`setup` fails if plugin.start is not a function', async () => {
        plugin_test_mocks_1.mockInitializer.mockReturnValueOnce({ setup: jest.fn() });
        await expect(plugin.setup({}, {})).rejects.toThrowErrorMatchingInlineSnapshot(`"Instance of plugin \\"plugin-a\\" does not define \\"start\\" function."`);
    });
    test('`setup` calls initializer with initializer context', async () => {
        await plugin.setup({}, {});
        expect(plugin_test_mocks_1.mockInitializer).toHaveBeenCalledWith(initializerContext);
    });
    test('`setup` calls plugin.setup with context and dependencies', async () => {
        const context = { any: 'thing' };
        const deps = { otherDep: 'value' };
        await plugin.setup(context, deps);
        expect(plugin_test_mocks_1.mockPlugin.setup).toHaveBeenCalledWith(context, deps);
    });
    test('`start` fails if setup is not called first', async () => {
        await expect(plugin.start({}, {})).rejects.toThrowErrorMatchingInlineSnapshot(`"Plugin \\"plugin-a\\" can't be started since it isn't set up."`);
    });
    test('`start` calls plugin.start with context and dependencies', async () => {
        await plugin.setup({}, {});
        const context = { any: 'thing' };
        const deps = { otherDep: 'value' };
        await plugin.start(context, deps);
        expect(plugin_test_mocks_1.mockPlugin.start).toHaveBeenCalledWith(context, deps);
    });
    test("`start` resolves `startDependencies` Promise after plugin's start", async () => {
        expect.assertions(2);
        const pluginStartContract = {
            someApi: () => 'foo',
        };
        let startDependenciesResolved = false;
        plugin_test_mocks_1.mockPluginReader.mockReturnValueOnce(jest.fn(() => ({
            setup: jest.fn(),
            start: jest.fn(async () => {
                // Add small delay to ensure startDependencies is not resolved until after the plugin instance's start resolves.
                await new Promise(resolve => setTimeout(resolve, 10));
                expect(startDependenciesResolved).toBe(false);
                return pluginStartContract;
            }),
            stop: jest.fn(),
        })));
        await plugin.setup({}, {});
        const context = { any: 'thing' };
        const deps = { otherDep: 'value' };
        // Add promise callback prior to calling `start` to ensure calls in `setup` will not resolve before `start` is
        // called.
        const startDependenciesCheck = plugin.startDependencies.then(res => {
            startDependenciesResolved = true;
            expect(res).toEqual([context, deps, pluginStartContract]);
        });
        await plugin.start(context, deps);
        await startDependenciesCheck;
    });
    test('`stop` fails if plugin is not setup up', async () => {
        expect(() => plugin.stop()).toThrowErrorMatchingInlineSnapshot(`"Plugin \\"plugin-a\\" can't be stopped since it isn't set up."`);
    });
    test('`stop` calls plugin.stop', async () => {
        await plugin.setup({}, {});
        await plugin.stop();
        expect(plugin_test_mocks_1.mockPlugin.stop).toHaveBeenCalled();
    });
    test('`stop` does not fail if plugin.stop does not exist', async () => {
        plugin_test_mocks_1.mockInitializer.mockReturnValueOnce({ setup: jest.fn(), start: jest.fn() });
        await plugin.setup({}, {});
        expect(() => plugin.stop()).not.toThrow();
    });
});
