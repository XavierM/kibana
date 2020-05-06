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
const get_upgradeable_config_1 = require("./get_upgradeable_config");
const saved_objects_client_mock_1 = require("../../saved_objects/service/saved_objects_client.mock");
describe('getUpgradeableConfig', () => {
    it('finds saved objects with type "config"', async () => {
        const savedObjectsClient = saved_objects_client_mock_1.savedObjectsClientMock.create();
        savedObjectsClient.find.mockResolvedValue({
            saved_objects: [{ id: '7.5.0' }],
        });
        await get_upgradeable_config_1.getUpgradeableConfig({ savedObjectsClient, version: '7.5.0' });
        expect(savedObjectsClient.find.mock.calls[0][0].type).toBe('config');
    });
    it('finds saved config with version < than Kibana version', async () => {
        const savedConfig = { id: '7.4.0' };
        const savedObjectsClient = saved_objects_client_mock_1.savedObjectsClientMock.create();
        savedObjectsClient.find.mockResolvedValue({
            saved_objects: [savedConfig],
        });
        const result = await get_upgradeable_config_1.getUpgradeableConfig({ savedObjectsClient, version: '7.5.0' });
        expect(result).toBe(savedConfig);
    });
    it('finds saved config with RC version === Kibana version', async () => {
        const savedConfig = { id: '7.5.0-rc1' };
        const savedObjectsClient = saved_objects_client_mock_1.savedObjectsClientMock.create();
        savedObjectsClient.find.mockResolvedValue({
            saved_objects: [savedConfig],
        });
        const result = await get_upgradeable_config_1.getUpgradeableConfig({ savedObjectsClient, version: '7.5.0' });
        expect(result).toBe(savedConfig);
    });
    it('does not find saved config with version === Kibana version', async () => {
        const savedConfig = { id: '7.5.0' };
        const savedObjectsClient = saved_objects_client_mock_1.savedObjectsClientMock.create();
        savedObjectsClient.find.mockResolvedValue({
            saved_objects: [savedConfig],
        });
        const result = await get_upgradeable_config_1.getUpgradeableConfig({ savedObjectsClient, version: '7.5.0' });
        expect(result).toBe(undefined);
    });
    it('does not find saved config with version > Kibana version', async () => {
        const savedConfig = { id: '7.6.0' };
        const savedObjectsClient = saved_objects_client_mock_1.savedObjectsClientMock.create();
        savedObjectsClient.find.mockResolvedValue({
            saved_objects: [savedConfig],
        });
        const result = await get_upgradeable_config_1.getUpgradeableConfig({ savedObjectsClient, version: '7.5.0' });
        expect(result).toBe(undefined);
    });
    it('handles empty config', async () => {
        const savedObjectsClient = saved_objects_client_mock_1.savedObjectsClientMock.create();
        savedObjectsClient.find.mockResolvedValue({
            saved_objects: [],
        });
        const result = await get_upgradeable_config_1.getUpgradeableConfig({ savedObjectsClient, version: '7.5.0' });
        expect(result).toBe(undefined);
    });
});
