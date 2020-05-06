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
const integrations_service_test_mocks_1 = require("./integrations_service.test.mocks");
const integrations_service_1 = require("./integrations_service");
const ui_settings_service_mock_1 = require("../ui_settings/ui_settings_service.mock");
describe('IntegrationsService', () => {
    test('it wires up styles and moment', async () => {
        const uiSettings = ui_settings_service_mock_1.uiSettingsServiceMock.createStartContract();
        const service = new integrations_service_1.IntegrationsService();
        await service.setup();
        expect(integrations_service_test_mocks_1.styleServiceMock.setup).toHaveBeenCalledWith();
        expect(integrations_service_test_mocks_1.momentServiceMock.setup).toHaveBeenCalledWith();
        await service.start({ uiSettings });
        expect(integrations_service_test_mocks_1.styleServiceMock.start).toHaveBeenCalledWith({ uiSettings });
        expect(integrations_service_test_mocks_1.momentServiceMock.start).toHaveBeenCalledWith({ uiSettings });
        await service.stop();
        expect(integrations_service_test_mocks_1.styleServiceMock.stop).toHaveBeenCalledWith();
        expect(integrations_service_test_mocks_1.momentServiceMock.stop).toHaveBeenCalledWith();
    });
});
