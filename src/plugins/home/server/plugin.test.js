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
const mocks_1 = require("../../../core/server/mocks");
describe('HomeServerPlugin', () => {
    beforeEach(() => {
        plugin_test_mocks_1.registryForTutorialsMock.setup.mockClear();
        plugin_test_mocks_1.registryForTutorialsMock.start.mockClear();
        plugin_test_mocks_1.registryForSampleDataMock.setup.mockClear();
        plugin_test_mocks_1.registryForSampleDataMock.start.mockClear();
    });
    describe('setup', () => {
        const mockCoreSetup = mocks_1.coreMock.createSetup();
        const initContext = mocks_1.coreMock.createPluginInitializerContext();
        test('wires up tutorials provider service and returns registerTutorial and addScopedTutorialContextFactory', () => {
            const setup = new plugin_1.HomeServerPlugin(initContext).setup(mockCoreSetup, {});
            expect(setup).toHaveProperty('tutorials');
            expect(setup.tutorials).toHaveProperty('registerTutorial');
            expect(setup.tutorials).toHaveProperty('addScopedTutorialContextFactory');
        });
        test('wires up sample data provider service and returns registerTutorial and addScopedTutorialContextFactory', () => {
            const setup = new plugin_1.HomeServerPlugin(initContext).setup(mockCoreSetup, {});
            expect(setup).toHaveProperty('sampleData');
            expect(setup.sampleData).toHaveProperty('registerSampleDataset');
            expect(setup.sampleData).toHaveProperty('getSampleDatasets');
            expect(setup.sampleData).toHaveProperty('addSavedObjectsToSampleDataset');
            expect(setup.sampleData).toHaveProperty('addAppLinksToSampleDataset');
            expect(setup.sampleData).toHaveProperty('replacePanelInSampleDatasetDashboard');
        });
    });
    describe('start', () => {
        const initContext = mocks_1.coreMock.createPluginInitializerContext();
        test('is defined', () => {
            const start = new plugin_1.HomeServerPlugin(initContext).start();
            expect(start).toBeDefined();
            expect(start).toHaveProperty('tutorials');
            expect(start).toHaveProperty('sampleData');
        });
    });
});
