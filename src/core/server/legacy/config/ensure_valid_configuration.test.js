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
const ensure_valid_configuration_1 = require("./ensure_valid_configuration");
const get_unused_config_keys_1 = require("./get_unused_config_keys");
const config_service_mock_1 = require("../../config/config_service.mock");
jest.mock('./get_unused_config_keys');
describe('ensureValidConfiguration', () => {
    let configService;
    beforeEach(() => {
        jest.clearAllMocks();
        configService = config_service_mock_1.configServiceMock.create();
        configService.getUsedPaths.mockReturnValue(Promise.resolve(['core', 'elastic']));
        get_unused_config_keys_1.getUnusedConfigKeys.mockImplementation(() => []);
    });
    it('calls getUnusedConfigKeys with correct parameters', async () => {
        await ensure_valid_configuration_1.ensureValidConfiguration(configService, {
            settings: 'settings',
            pluginSpecs: 'pluginSpecs',
            disabledPluginSpecs: 'disabledPluginSpecs',
            pluginExtendedConfig: 'pluginExtendedConfig',
            uiExports: 'uiExports',
        });
        expect(get_unused_config_keys_1.getUnusedConfigKeys).toHaveBeenCalledTimes(1);
        expect(get_unused_config_keys_1.getUnusedConfigKeys).toHaveBeenCalledWith({
            coreHandledConfigPaths: ['core', 'elastic'],
            pluginSpecs: 'pluginSpecs',
            disabledPluginSpecs: 'disabledPluginSpecs',
            settings: 'settings',
            legacyConfig: 'pluginExtendedConfig',
        });
    });
    it('returns normally when there is no unused keys', async () => {
        await expect(ensure_valid_configuration_1.ensureValidConfiguration(configService, {})).resolves.toBeUndefined();
        expect(get_unused_config_keys_1.getUnusedConfigKeys).toHaveBeenCalledTimes(1);
    });
    it('throws when there are some unused keys', async () => {
        get_unused_config_keys_1.getUnusedConfigKeys.mockImplementation(() => ['some.key', 'some.other.key']);
        await expect(ensure_valid_configuration_1.ensureValidConfiguration(configService, {})).rejects.toMatchInlineSnapshot(`[Error: Unknown configuration key(s): "some.key", "some.other.key". Check for spelling errors and ensure that expected plugins are installed.]`);
    });
});
