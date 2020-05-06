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
const toasts_service_test_mocks_1 = require("./toasts_service.test.mocks");
const toasts_service_1 = require("./toasts_service");
const toasts_api_1 = require("./toasts_api");
const overlay_service_mock_1 = require("../../overlays/overlay_service.mock");
const ui_settings_service_mock_1 = require("../../ui_settings/ui_settings_service.mock");
const mockI18n = {
    Context: function I18nContext() {
        return '';
    },
};
const mockOverlays = overlay_service_mock_1.overlayServiceMock.createStartContract();
describe('#setup()', () => {
    it('returns a ToastsApi', () => {
        const toasts = new toasts_service_1.ToastsService();
        expect(toasts.setup({ uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract() })).toBeInstanceOf(toasts_api_1.ToastsApi);
    });
});
describe('#start()', () => {
    it('renders the GlobalToastList into the targetDomElement param', async () => {
        const targetDomElement = document.createElement('div');
        targetDomElement.setAttribute('test', 'target-dom-element');
        const toasts = new toasts_service_1.ToastsService();
        expect(toasts_service_test_mocks_1.mockReactDomRender).not.toHaveBeenCalled();
        toasts.setup({ uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract() });
        toasts.start({ i18n: mockI18n, targetDomElement, overlays: mockOverlays });
        expect(toasts_service_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
    });
    it('returns a ToastsApi', () => {
        const targetDomElement = document.createElement('div');
        const toasts = new toasts_service_1.ToastsService();
        expect(toasts.setup({ uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract() })).toBeInstanceOf(toasts_api_1.ToastsApi);
        expect(toasts.start({ i18n: mockI18n, targetDomElement, overlays: mockOverlays })).toBeInstanceOf(toasts_api_1.ToastsApi);
    });
});
describe('#stop()', () => {
    it('unmounts the GlobalToastList from the targetDomElement', () => {
        const targetDomElement = document.createElement('div');
        targetDomElement.setAttribute('test', 'target-dom-element');
        const toasts = new toasts_service_1.ToastsService();
        toasts.setup({ uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract() });
        toasts.start({ i18n: mockI18n, targetDomElement, overlays: mockOverlays });
        expect(toasts_service_test_mocks_1.mockReactDomUnmount).not.toHaveBeenCalled();
        toasts.stop();
        expect(toasts_service_test_mocks_1.mockReactDomUnmount.mock.calls).toMatchSnapshot();
    });
    it('does not fail if setup() was never called', () => {
        const toasts = new toasts_service_1.ToastsService();
        expect(() => {
            toasts.stop();
        }).not.toThrowError();
    });
    it('empties the content of the targetDomElement', () => {
        const targetDomElement = document.createElement('div');
        const toasts = new toasts_service_1.ToastsService();
        toasts.setup({ uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract() });
        toasts.start({ i18n: mockI18n, targetDomElement, overlays: mockOverlays });
        toasts.stop();
        expect(targetDomElement.childNodes).toHaveLength(0);
    });
});
