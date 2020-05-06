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
const rxjs_1 = require("rxjs");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const dedent_1 = tslib_1.__importDefault(require("dedent"));
const advanced_settings_1 = require("./advanced_settings");
const mocks_1 = require("../../../../core/public/mocks");
const component_registry_1 = require("../component_registry");
jest.mock('ui/new_platform', () => ({
    npStart: mockConfig(),
}));
jest.mock('./components/field', () => ({
    Field: () => {
        return 'field';
    },
}));
jest.mock('./components/call_outs', () => ({
    CallOuts: () => {
        return 'callOuts';
    },
}));
jest.mock('./components/search', () => ({
    Search: () => {
        return 'search';
    },
}));
function mockConfig() {
    const defaultConfig = {
        displayName: 'defaultName',
        requiresPageReload: false,
        isOverridden: false,
        ariaName: 'ariaName',
        readOnly: false,
        isCustom: false,
        defVal: 'defVal',
        type: 'string',
        category: ['category'],
    };
    const config = {
        set: (key, value) => Promise.resolve(true),
        remove: (key) => Promise.resolve(true),
        isCustom: (key) => false,
        isOverridden: (key) => Boolean(config.getAll()[key].isOverridden),
        getRegistered: () => ({}),
        overrideLocalDefault: (key, value) => { },
        getUpdate$: () => new rxjs_1.Observable(),
        isDeclared: (key) => true,
        isDefault: (key) => true,
        getSaved$: () => new rxjs_1.Observable(),
        getUpdateErrors$: () => new rxjs_1.Observable(),
        get: (key, defaultOverride) => config.getAll()[key] || defaultOverride,
        get$: (key) => new rxjs_1.Observable(config.get(key)),
        getAll: () => {
            return {
                'test:array:setting': {
                    ...defaultConfig,
                    value: ['default_value'],
                    name: 'Test array setting',
                    description: 'Description for Test array setting',
                    category: ['elasticsearch'],
                },
                'test:boolean:setting': {
                    ...defaultConfig,
                    value: true,
                    name: 'Test boolean setting',
                    description: 'Description for Test boolean setting',
                    category: ['elasticsearch'],
                },
                'test:image:setting': {
                    ...defaultConfig,
                    value: null,
                    name: 'Test image setting',
                    description: 'Description for Test image setting',
                    type: 'image',
                },
                'test:json:setting': {
                    ...defaultConfig,
                    value: '{"foo": "bar"}',
                    name: 'Test json setting',
                    description: 'Description for Test json setting',
                    type: 'json',
                },
                'test:markdown:setting': {
                    ...defaultConfig,
                    value: '',
                    name: 'Test markdown setting',
                    description: 'Description for Test markdown setting',
                    type: 'markdown',
                },
                'test:number:setting': {
                    ...defaultConfig,
                    value: 5,
                    name: 'Test number setting',
                    description: 'Description for Test number setting',
                },
                'test:select:setting': {
                    ...defaultConfig,
                    value: 'orange',
                    name: 'Test select setting',
                    description: 'Description for Test select setting',
                    type: 'select',
                    options: ['apple', 'orange', 'banana'],
                },
                'test:string:setting': {
                    ...defaultConfig,
                    ...{
                        value: null,
                        name: 'Test string setting',
                        description: 'Description for Test string setting',
                        type: 'string',
                        isCustom: true,
                    },
                },
                'test:readonlystring:setting': {
                    ...defaultConfig,
                    ...{
                        value: null,
                        name: 'Test readonly string setting',
                        description: 'Description for Test readonly string setting',
                        type: 'string',
                        readOnly: true,
                    },
                },
                'test:customstring:setting': {
                    ...defaultConfig,
                    ...{
                        value: null,
                        name: 'Test custom string setting',
                        description: 'Description for Test custom string setting',
                        type: 'string',
                        isCustom: true,
                    },
                },
                'test:isOverridden:string': {
                    ...defaultConfig,
                    isOverridden: true,
                    value: 'foo',
                    name: 'An overridden string',
                    description: 'Description for overridden string',
                    type: 'string',
                },
                'test:isOverridden:number': {
                    ...defaultConfig,
                    isOverridden: true,
                    value: 1234,
                    name: 'An overridden number',
                    description: 'Description for overridden number',
                    type: 'number',
                },
                'test:isOverridden:json': {
                    ...defaultConfig,
                    isOverridden: true,
                    value: dedent_1.default `
            {
              "foo": "bar"
            }
          `,
                    name: 'An overridden json',
                    description: 'Description for overridden json',
                    type: 'json',
                },
                'test:isOverridden:select': {
                    ...defaultConfig,
                    isOverridden: true,
                    value: 'orange',
                    name: 'Test overridden select setting',
                    description: 'Description for overridden select setting',
                    type: 'select',
                    options: ['apple', 'orange', 'banana'],
                },
            };
        },
    };
    return {
        core: {
            uiSettings: config,
        },
        plugins: {
            advancedSettings: {
                componentRegistry: {
                    get: () => {
                        const foo = () => react_1.default.createElement("div", null, "Hello");
                        foo.displayName = 'foo_component';
                        return foo;
                    },
                    componentType: {
                        PAGE_TITLE_COMPONENT: 'page_title_component',
                        PAGE_SUBTITLE_COMPONENT: 'page_subtitle_component',
                    },
                },
            },
        },
    };
}
describe('AdvancedSettings', () => {
    it('should render specific setting if given setting key', async () => {
        const component = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(advanced_settings_1.AdvancedSettingsComponent, { queryText: "test:string:setting", enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links, uiSettings: mockConfig().core.uiSettings, componentRegistry: new component_registry_1.ComponentRegistry().start }));
        expect(component
            .find('Field')
            .filterWhere((n) => n.prop('setting').name === 'test:string:setting')).toHaveLength(1);
    });
    it('should render read-only when saving is disabled', async () => {
        const component = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(advanced_settings_1.AdvancedSettingsComponent, { queryText: "test:string:setting", enableSaving: false, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links, uiSettings: mockConfig().core.uiSettings, componentRegistry: new component_registry_1.ComponentRegistry().start }));
        expect(component
            .find('Field')
            .filterWhere((n) => n.prop('setting').name === 'test:string:setting')
            .prop('enableSaving')).toBe(false);
    });
});
