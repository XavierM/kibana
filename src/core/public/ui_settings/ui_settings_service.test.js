"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const Rx = tslib_1.__importStar(require("rxjs"));
const http_service_mock_1 = require("../http/http_service.mock");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const ui_settings_service_1 = require("./ui_settings_service");
const httpSetup = http_service_mock_1.httpServiceMock.createSetupContract();
const defaultDeps = {
    http: httpSetup,
    injectedMetadata: injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract(),
};
describe('#stop', () => {
    it('runs fine if service never set up', () => {
        const service = new ui_settings_service_1.UiSettingsService();
        expect(() => service.stop()).not.toThrowError();
    });
    it('stops the uiSettingsClient and uiSettingsApi', async () => {
        const service = new ui_settings_service_1.UiSettingsService();
        let loadingCount$;
        defaultDeps.http.addLoadingCountSource.mockImplementation(obs$ => (loadingCount$ = obs$));
        const client = service.setup(defaultDeps);
        service.stop();
        await expect(Rx.combineLatest(client.getUpdate$(), client.getSaved$(), client.getUpdateErrors$(), loadingCount$).toPromise()).resolves.toBe(undefined);
    });
});
