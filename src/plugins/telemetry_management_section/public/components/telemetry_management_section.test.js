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
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const telemetry_management_section_1 = require("./telemetry_management_section");
const services_1 = require("../../../telemetry/public/services");
const mocks_1 = require("../../../../core/public/mocks");
const telemetry_management_section_wrapper_1 = require("./telemetry_management_section_wrapper");
describe('TelemetryManagementSectionComponent', () => {
    const coreStart = mocks_1.coreMock.createStart();
    const coreSetup = mocks_1.coreMock.createSetup();
    it('renders as expected', () => {
        const onQueryMatchChange = jest.fn();
        const telemetryService = new services_1.TelemetryService({
            config: {
                enabled: true,
                url: '',
                banner: true,
                allowChangingOptInStatus: true,
                optIn: true,
                optInStatusUrl: '',
                sendUsageFrom: 'browser',
            },
            reportOptInStatusChange: false,
            notifications: coreStart.notifications,
            http: coreSetup.http,
        });
        expect(enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(telemetry_management_section_1.TelemetryManagementSection, { telemetryService: telemetryService, onQueryMatchChange: onQueryMatchChange, showAppliesSettingMessage: true, enableSaving: true, toasts: coreStart.notifications.toasts }))).toMatchSnapshot();
    });
    it('renders null because query does not match the SEARCH_TERMS', () => {
        const onQueryMatchChange = jest.fn();
        const telemetryService = new services_1.TelemetryService({
            config: {
                enabled: true,
                url: '',
                banner: true,
                allowChangingOptInStatus: true,
                optIn: false,
                optInStatusUrl: '',
                sendUsageFrom: 'browser',
            },
            reportOptInStatusChange: false,
            notifications: coreStart.notifications,
            http: coreSetup.http,
        });
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(telemetry_management_section_1.TelemetryManagementSection, { telemetryService: telemetryService, onQueryMatchChange: onQueryMatchChange, showAppliesSettingMessage: false, enableSaving: true, toasts: coreStart.notifications.toasts }));
        try {
            expect(component.setProps({ ...component.props(), query: { text: 'asssdasdsad' } })).toMatchSnapshot();
            expect(onQueryMatchChange).toHaveBeenCalledWith(false);
            expect(onQueryMatchChange).toHaveBeenCalledTimes(1);
        }
        finally {
            component.unmount();
        }
    });
    it('renders because query matches the SEARCH_TERMS', () => {
        const onQueryMatchChange = jest.fn();
        const telemetryService = new services_1.TelemetryService({
            config: {
                enabled: true,
                url: '',
                banner: true,
                allowChangingOptInStatus: true,
                optIn: false,
                optInStatusUrl: '',
                sendUsageFrom: 'browser',
            },
            reportOptInStatusChange: false,
            notifications: coreStart.notifications,
            http: coreSetup.http,
        });
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(telemetry_management_section_1.TelemetryManagementSection, { telemetryService: telemetryService, onQueryMatchChange: onQueryMatchChange, showAppliesSettingMessage: false, enableSaving: true, toasts: coreStart.notifications.toasts }));
        try {
            expect(component.setProps({ ...component.props(), query: { text: 'TeLEMetry' } }).html()).not.toBe(''); // Renders something.
            // I can't check against snapshot because of https://github.com/facebook/jest/issues/8618
            // expect(component).toMatchSnapshot();
            // It should also render if there is no query at all.
            expect(component.setProps({ ...component.props(), query: {} }).html()).not.toBe('');
            expect(onQueryMatchChange).toHaveBeenCalledWith(true);
            // Should only be called once because the second time does not change the result
            expect(onQueryMatchChange).toHaveBeenCalledTimes(1);
        }
        finally {
            component.unmount();
        }
    });
    it('renders null because allowChangingOptInStatus is false', () => {
        const onQueryMatchChange = jest.fn();
        const telemetryService = new services_1.TelemetryService({
            config: {
                enabled: true,
                url: '',
                banner: true,
                allowChangingOptInStatus: false,
                optIn: true,
                optInStatusUrl: '',
                sendUsageFrom: 'browser',
            },
            reportOptInStatusChange: false,
            notifications: coreStart.notifications,
            http: coreSetup.http,
        });
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(telemetry_management_section_1.TelemetryManagementSection, { telemetryService: telemetryService, onQueryMatchChange: onQueryMatchChange, showAppliesSettingMessage: true, enableSaving: true, toasts: coreStart.notifications.toasts }));
        try {
            expect(component).toMatchSnapshot();
            component.setProps({ ...component.props(), query: { text: 'TeLEMetry' } });
            expect(onQueryMatchChange).toHaveBeenCalledWith(false);
        }
        finally {
            component.unmount();
        }
    });
    it('shows the OptInExampleFlyout', () => {
        const onQueryMatchChange = jest.fn();
        const telemetryService = new services_1.TelemetryService({
            config: {
                enabled: true,
                url: '',
                banner: true,
                allowChangingOptInStatus: true,
                optIn: false,
                optInStatusUrl: '',
                sendUsageFrom: 'browser',
            },
            reportOptInStatusChange: false,
            notifications: coreStart.notifications,
            http: coreSetup.http,
        });
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(telemetry_management_section_1.TelemetryManagementSection, { telemetryService: telemetryService, onQueryMatchChange: onQueryMatchChange, showAppliesSettingMessage: false, enableSaving: true, toasts: coreStart.notifications.toasts }));
        try {
            const toggleExampleComponent = component.find('p > EuiLink[onClick]');
            const updatedView = toggleExampleComponent.simulate('click');
            updatedView.find('OptInExampleFlyout');
            updatedView.simulate('close');
        }
        finally {
            component.unmount();
        }
    });
    it('toggles the OptIn button', async () => {
        const onQueryMatchChange = jest.fn();
        const telemetryService = new services_1.TelemetryService({
            config: {
                enabled: true,
                url: '',
                banner: true,
                allowChangingOptInStatus: true,
                optIn: false,
                optInStatusUrl: '',
                sendUsageFrom: 'browser',
            },
            reportOptInStatusChange: false,
            notifications: coreStart.notifications,
            http: coreSetup.http,
        });
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(telemetry_management_section_1.TelemetryManagementSection, { telemetryService: telemetryService, onQueryMatchChange: onQueryMatchChange, showAppliesSettingMessage: false, enableSaving: true, toasts: coreStart.notifications.toasts }));
        try {
            const toggleOptInComponent = component.find('Field');
            await expect(toggleOptInComponent.prop('handleChange')()).resolves.toBe(true);
            expect(component.state().enabled).toBe(true);
            await expect(toggleOptInComponent.prop('handleChange')()).resolves.toBe(true);
            expect(component.state().enabled).toBe(false);
            telemetryService.setOptIn = jest.fn().mockRejectedValue(Error('test-error'));
            await expect(toggleOptInComponent.prop('handleChange')()).rejects.toStrictEqual(Error('test-error'));
        }
        finally {
            component.unmount();
        }
    });
    it('test the wrapper (for coverage purposes)', () => {
        const onQueryMatchChange = jest.fn();
        const telemetryService = new services_1.TelemetryService({
            config: {
                enabled: true,
                url: '',
                banner: true,
                allowChangingOptInStatus: false,
                optIn: false,
                optInStatusUrl: '',
                sendUsageFrom: 'browser',
            },
            reportOptInStatusChange: false,
            notifications: coreStart.notifications,
            http: coreSetup.http,
        });
        const Wrapper = telemetry_management_section_wrapper_1.telemetryManagementSectionWrapper(telemetryService);
        expect(enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(Wrapper, { onQueryMatchChange: onQueryMatchChange, enableSaving: true, toasts: coreStart.notifications.toasts })).html()).toMatchSnapshot();
    });
});
