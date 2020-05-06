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
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const mocks_1 = require("../../../../../../core/public/mocks");
const form_1 = require("./form");
jest.mock('../field', () => ({
    Field: () => {
        return 'field';
    },
}));
beforeAll(() => {
    const localStorage = {
        'core.chrome.isLocked': true,
    };
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: (key) => {
                return localStorage[key] || null;
            },
        },
        writable: true,
    });
});
afterAll(() => {
    delete window.localStorage;
});
const defaults = {
    requiresPageReload: false,
    readOnly: false,
    value: 'value',
    description: 'description',
    isOverridden: false,
    type: 'string',
    isCustom: false,
    defVal: 'defVal',
};
const settings = {
    dashboard: [
        {
            ...defaults,
            name: 'dashboard:test:setting',
            ariaName: 'dashboard test setting',
            displayName: 'Dashboard test setting',
            category: ['dashboard'],
            requiresPageReload: true,
        },
    ],
    general: [
        {
            ...defaults,
            name: 'general:test:date',
            ariaName: 'general test date',
            displayName: 'Test date',
            description: 'bar',
            category: ['general'],
        },
        {
            ...defaults,
            name: 'setting:test',
            ariaName: 'setting test',
            displayName: 'Test setting',
            description: 'foo',
            category: ['general'],
        },
    ],
    'x-pack': [
        {
            ...defaults,
            name: 'xpack:test:setting',
            ariaName: 'xpack test setting',
            displayName: 'X-Pack test setting',
            category: ['x-pack'],
            description: 'bar',
        },
    ],
};
const categories = ['general', 'dashboard', 'hiddenCategory', 'x-pack'];
const categoryCounts = {
    general: 2,
    dashboard: 1,
    'x-pack': 10,
};
const save = jest.fn((changes) => Promise.resolve([true]));
const clearQuery = () => { };
describe('Form', () => {
    it('should render normally', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(form_1.Form, { settings: settings, visibleSettings: settings, categories: categories, categoryCounts: categoryCounts, save: save, clearQuery: clearQuery, showNoResultsMessage: true, enableSaving: true, toasts: {}, dockLinks: {} }));
        expect(component).toMatchSnapshot();
    });
    it('should render read-only when saving is disabled', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(form_1.Form, { settings: settings, visibleSettings: settings, categories: categories, categoryCounts: categoryCounts, save: save, clearQuery: clearQuery, showNoResultsMessage: true, enableSaving: false, toasts: {}, dockLinks: {} }));
        expect(component).toMatchSnapshot();
    });
    it('should render no settings message when there are no settings', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(form_1.Form, { settings: {}, visibleSettings: settings, categories: categories, categoryCounts: categoryCounts, save: save, clearQuery: clearQuery, showNoResultsMessage: true, enableSaving: true, toasts: {}, dockLinks: {} }));
        expect(component).toMatchSnapshot();
    });
    it('should not render no settings message when instructed not to', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(form_1.Form, { settings: {}, visibleSettings: settings, categories: categories, categoryCounts: categoryCounts, save: save, clearQuery: clearQuery, showNoResultsMessage: false, enableSaving: true, toasts: {}, dockLinks: {} }));
        expect(component).toMatchSnapshot();
    });
    it('should hide bottom bar when clicking on the cancel changes button', async () => {
        const wrapper = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(form_1.Form, { settings: settings, visibleSettings: settings, categories: categories, categoryCounts: categoryCounts, save: save, clearQuery: clearQuery, showNoResultsMessage: true, enableSaving: false, toasts: {}, dockLinks: {} }));
        wrapper.instance().setState({
            unsavedChanges: {
                'dashboard:test:setting': {
                    value: 'changedValue',
                },
            },
        });
        const updated = wrapper.update();
        expect(updated.exists('[data-test-subj="advancedSetting-bottomBar"]')).toEqual(true);
        await test_1.findTestSubject(updated, `advancedSetting-cancelButton`).simulate('click');
        updated.update();
        expect(updated.exists('[data-test-subj="advancedSetting-bottomBar"]')).toEqual(false);
    });
    it('should show a reload toast when saving setting requiring a page reload', async () => {
        const toasts = mocks_1.notificationServiceMock.createStartContract().toasts;
        const wrapper = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(form_1.Form, { settings: settings, visibleSettings: settings, categories: categories, categoryCounts: categoryCounts, save: save, clearQuery: clearQuery, showNoResultsMessage: true, enableSaving: false, toasts: toasts, dockLinks: {} }));
        wrapper.instance().setState({
            unsavedChanges: {
                'dashboard:test:setting': {
                    value: 'changedValue',
                },
            },
        });
        const updated = wrapper.update();
        test_1.findTestSubject(updated, `advancedSetting-saveButton`).simulate('click');
        expect(save).toHaveBeenCalled();
        await save({ 'dashboard:test:setting': 'changedValue' });
        expect(toasts.add).toHaveBeenCalledWith(expect.objectContaining({
            title: expect.stringContaining('One or more settings require you to reload the page to take effect.'),
        }));
    });
});
