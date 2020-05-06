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
const mocks_1 = require("../../../core/public/mocks");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const mocks_2 = require("../../home/public/mocks");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const mocks_3 = require("../../management/public/mocks");
const mocks_4 = require("../../data/public/mocks");
const plugin_1 = require("./plugin");
describe('SavedObjectsManagementPlugin', () => {
    let plugin;
    beforeEach(() => {
        plugin = new plugin_1.SavedObjectsManagementPlugin();
    });
    describe('#setup', () => {
        it('registers the saved_objects feature to the home plugin', async () => {
            const coreSetup = mocks_1.coreMock.createSetup({
                pluginStartDeps: { data: mocks_4.dataPluginMock.createStartContract() },
            });
            const homeSetup = mocks_2.homePluginMock.createSetupContract();
            const managementSetup = mocks_3.managementPluginMock.createSetupContract();
            await plugin.setup(coreSetup, { home: homeSetup, management: managementSetup });
            expect(homeSetup.featureCatalogue.register).toHaveBeenCalledTimes(1);
            expect(homeSetup.featureCatalogue.register).toHaveBeenCalledWith(expect.objectContaining({
                id: 'saved_objects',
            }));
        });
    });
});
