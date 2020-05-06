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
const moment_service_test_mocks_1 = require("./moment_service.test.mocks");
const moment_service_1 = require("./moment_service");
const ui_settings_service_mock_1 = require("../../ui_settings/ui_settings_service.mock");
const rxjs_1 = require("rxjs");
describe('MomentService', () => {
    let service;
    beforeEach(() => {
        moment_service_test_mocks_1.momentMock.tz.setDefault.mockClear();
        moment_service_test_mocks_1.momentMock.weekdays.mockClear();
        moment_service_test_mocks_1.momentMock.updateLocale.mockClear();
        service = new moment_service_1.MomentService();
    });
    afterEach(() => service.stop());
    const flushPromises = () => new Promise(resolve => setTimeout(resolve, 100));
    test('sets initial moment config', async () => {
        const tz$ = new rxjs_1.BehaviorSubject('tz1');
        const dow$ = new rxjs_1.BehaviorSubject('dow1');
        const uiSettings = ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract();
        uiSettings.get$.mockReturnValueOnce(tz$).mockReturnValueOnce(dow$);
        service.start({ uiSettings });
        await flushPromises();
        expect(moment_service_test_mocks_1.momentMock.tz.setDefault).toHaveBeenCalledWith('tz1');
        expect(moment_service_test_mocks_1.momentMock.updateLocale).toHaveBeenCalledWith('default-locale', { week: { dow: 0 } });
    });
    it('does not set unknkown zone', async () => {
        const tz$ = new rxjs_1.BehaviorSubject('timezone/undefined');
        const uiSettings = ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract();
        uiSettings.get$.mockReturnValueOnce(tz$);
        service.start({ uiSettings });
        await flushPromises();
        expect(moment_service_test_mocks_1.momentMock.tz.setDefault).not.toHaveBeenCalled();
    });
    it('sets timezone when a zone is defined', async () => {
        const tz$ = new rxjs_1.BehaviorSubject('tz3');
        const uiSettings = ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract();
        uiSettings.get$.mockReturnValueOnce(tz$);
        service.start({ uiSettings });
        await flushPromises();
        expect(moment_service_test_mocks_1.momentMock.tz.setDefault).toHaveBeenCalledWith('tz3');
    });
    test('updates moment config', async () => {
        const tz$ = new rxjs_1.BehaviorSubject('tz1');
        const dow$ = new rxjs_1.BehaviorSubject('dow1');
        const uiSettings = ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract();
        uiSettings.get$.mockReturnValueOnce(tz$).mockReturnValueOnce(dow$);
        service.start({ uiSettings });
        tz$.next('tz2');
        tz$.next('tz3');
        dow$.next('dow3');
        dow$.next('dow2');
        await flushPromises();
        expect(moment_service_test_mocks_1.momentMock.tz.setDefault.mock.calls).toEqual([['tz1'], ['tz2'], ['tz3']]);
        expect(moment_service_test_mocks_1.momentMock.updateLocale.mock.calls).toEqual([
            ['default-locale', { week: { dow: 0 } }],
            ['default-locale', { week: { dow: 2 } }],
            ['default-locale', { week: { dow: 1 } }],
        ]);
    });
});
