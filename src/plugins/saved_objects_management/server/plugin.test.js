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
describe('SavedObjectsManagementPlugin', () => {
    let plugin;
    beforeEach(() => {
        plugin = new plugin_1.SavedObjectsManagementPlugin(mocks_1.coreMock.createPluginInitializerContext());
    });
    describe('#setup', () => {
        it('registers the routes', async () => {
            const coreSetup = mocks_1.coreMock.createSetup();
            await plugin.setup(coreSetup);
            expect(plugin_test_mocks_1.registerRoutesMock).toHaveBeenCalledTimes(1);
            expect(plugin_test_mocks_1.registerRoutesMock).toHaveBeenCalledWith(expect.objectContaining({
                http: coreSetup.http,
            }));
        });
    });
});
