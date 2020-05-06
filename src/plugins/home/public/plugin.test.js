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
const plugin_test_mocks_1 = require("./plugin.test.mocks");
const plugin_1 = require("./plugin");
const mocks_1 = require("../../../core/public/mocks");
const mocks_2 = require("../../kibana_legacy/public/mocks");
const mockInitializerContext = mocks_1.coreMock.createPluginInitializerContext();
describe('HomePublicPlugin', () => {
    beforeEach(() => {
        plugin_test_mocks_1.registryMock.setup.mockClear();
        plugin_test_mocks_1.registryMock.start.mockClear();
        plugin_test_mocks_1.tutorialMock.setup.mockClear();
        plugin_test_mocks_1.environmentMock.setup.mockClear();
    });
    describe('setup', () => {
        test('wires up and returns registry', async () => {
            const setup = await new plugin_1.HomePublicPlugin(mockInitializerContext).setup(mocks_1.coreMock.createSetup(), {
                kibanaLegacy: mocks_2.kibanaLegacyPluginMock.createSetupContract(),
            });
            expect(setup).toHaveProperty('featureCatalogue');
            expect(setup.featureCatalogue).toHaveProperty('register');
        });
        test('wires up and returns environment service', async () => {
            const setup = await new plugin_1.HomePublicPlugin(mockInitializerContext).setup(mocks_1.coreMock.createSetup(), {
                kibanaLegacy: mocks_2.kibanaLegacyPluginMock.createSetupContract(),
            });
            expect(setup).toHaveProperty('environment');
            expect(setup.environment).toHaveProperty('update');
        });
        test('wires up and returns tutorial service', async () => {
            const setup = await new plugin_1.HomePublicPlugin(mockInitializerContext).setup(mocks_1.coreMock.createSetup(), {
                kibanaLegacy: mocks_2.kibanaLegacyPluginMock.createSetupContract(),
            });
            expect(setup).toHaveProperty('tutorials');
            expect(setup.tutorials).toHaveProperty('setVariable');
        });
    });
});
