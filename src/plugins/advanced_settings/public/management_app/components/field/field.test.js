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
const react_2 = require("@kbn/i18n/react");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const enzyme_1 = require("enzyme");
const mocks_1 = require("../../../../../../core/public/mocks");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const field_1 = require("./field");
jest.mock('brace/theme/textmate', () => 'brace/theme/textmate');
jest.mock('brace/mode/markdown', () => 'brace/mode/markdown');
const defaults = {
    requiresPageReload: false,
    readOnly: false,
    category: ['category'],
};
const exampleValues = {
    array: ['example_value'],
    boolean: false,
    image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
    json: { foo: 'bar2' },
    markdown: 'Hello World',
    number: 1,
    select: 'banana',
    string: 'hello world',
    stringWithValidation: 'foo',
};
const settings = {
    array: {
        name: 'array:test:setting',
        ariaName: 'array test setting',
        displayName: 'Array test setting',
        description: 'Description for Array test setting',
        type: 'array',
        value: undefined,
        defVal: ['default_value'],
        isCustom: false,
        isOverridden: false,
        ...defaults,
    },
    boolean: {
        name: 'boolean:test:setting',
        ariaName: 'boolean test setting',
        displayName: 'Boolean test setting',
        description: 'Description for Boolean test setting',
        type: 'boolean',
        value: undefined,
        defVal: true,
        isCustom: false,
        isOverridden: false,
        ...defaults,
    },
    image: {
        name: 'image:test:setting',
        ariaName: 'image test setting',
        displayName: 'Image test setting',
        description: 'Description for Image test setting',
        type: 'image',
        value: undefined,
        defVal: null,
        isCustom: false,
        isOverridden: false,
        validation: {
            maxSize: {
                length: 1000,
                description: 'Description for 1 kB',
            },
        },
        ...defaults,
    },
    json: {
        name: 'json:test:setting',
        ariaName: 'json test setting',
        displayName: 'Json test setting',
        description: 'Description for Json test setting',
        type: 'json',
        value: '{"foo": "bar"}',
        defVal: '{}',
        isCustom: false,
        isOverridden: false,
        ...defaults,
    },
    markdown: {
        name: 'markdown:test:setting',
        ariaName: 'markdown test setting',
        displayName: 'Markdown test setting',
        description: 'Description for Markdown test setting',
        type: 'markdown',
        value: undefined,
        defVal: '',
        isCustom: false,
        isOverridden: false,
        ...defaults,
    },
    number: {
        name: 'number:test:setting',
        ariaName: 'number test setting',
        displayName: 'Number test setting',
        description: 'Description for Number test setting',
        type: 'number',
        value: undefined,
        defVal: 5,
        isCustom: false,
        isOverridden: false,
        ...defaults,
    },
    select: {
        name: 'select:test:setting',
        ariaName: 'select test setting',
        displayName: 'Select test setting',
        description: 'Description for Select test setting',
        type: 'select',
        value: undefined,
        defVal: 'orange',
        isCustom: false,
        isOverridden: false,
        options: ['apple', 'orange', 'banana'],
        optionLabels: {
            apple: 'Apple',
            orange: 'Orange',
        },
        ...defaults,
    },
    string: {
        name: 'string:test:setting',
        ariaName: 'string test setting',
        displayName: 'String test setting',
        description: 'Description for String test setting',
        type: 'string',
        value: undefined,
        defVal: null,
        isCustom: false,
        isOverridden: false,
        ...defaults,
    },
    stringWithValidation: {
        name: 'string:test-validation:setting',
        ariaName: 'string test validation setting',
        displayName: 'String test validation setting',
        description: 'Description for String test validation setting',
        type: 'string',
        validation: {
            regex: new RegExp('^foo'),
            message: 'must start with "foo"',
        },
        value: undefined,
        defVal: 'foo-default',
        isCustom: false,
        isOverridden: false,
        ...defaults,
    },
};
const userValues = {
    array: ['user', 'value'],
    boolean: false,
    image: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    json: '{"hello": "world"}',
    markdown: '**bold**',
    number: 10,
    select: 'banana',
    string: 'foo',
    stringWithValidation: 'fooUserValue',
};
const invalidUserValues = {
    stringWithValidation: 'invalidUserValue',
};
const handleChange = jest.fn();
const clearChange = jest.fn();
const getFieldSettingValue = (wrapper, name, type) => {
    const field = test_1.findTestSubject(wrapper, `advancedSetting-editField-${name}`);
    if (type === 'boolean') {
        return field.props()['aria-checked'];
    }
    else {
        return field.props().value;
    }
};
describe('Field', () => {
    Object.keys(settings).forEach(type => {
        const setting = settings[type];
        describe(`for ${type} setting`, () => {
            it('should render default value if there is no user value set', async () => {
                const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_1.Field, { setting: setting, handleChange: handleChange, enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links }));
                expect(component).toMatchSnapshot();
            });
            it('should render as read only with help text if overridden', async () => {
                const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_1.Field, { setting: {
                        ...setting,
                        // @ts-ignore
                        value: userValues[type],
                        isOverridden: true,
                    }, handleChange: handleChange, enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links }));
                expect(component).toMatchSnapshot();
            });
            it('should render as read only if saving is disabled', async () => {
                const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_1.Field, { setting: setting, handleChange: handleChange, enableSaving: false, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links }));
                expect(component).toMatchSnapshot();
            });
            it('should render user value if there is user value is set', async () => {
                const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_1.Field, { setting: {
                        ...setting,
                        // @ts-ignore
                        value: userValues[type],
                    }, handleChange: handleChange, enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links }));
                expect(component).toMatchSnapshot();
            });
            it('should render custom setting icon if it is custom', async () => {
                const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_1.Field, { setting: {
                        ...setting,
                        isCustom: true,
                    }, handleChange: handleChange, enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links }));
                expect(component).toMatchSnapshot();
            });
            it('should render unsaved value if there are unsaved changes', async () => {
                const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_1.Field, { setting: {
                        ...setting,
                        isCustom: true,
                    }, handleChange: handleChange, enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links, unsavedChanges: {
                        // @ts-ignore
                        value: exampleValues[setting.type],
                    } }));
                expect(component).toMatchSnapshot();
            });
        });
        if (type === 'select') {
            it('should use options for rendering values and optionsLabels for rendering labels', () => {
                const component = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(field_1.Field, { setting: {
                        ...setting,
                        isCustom: true,
                    }, handleChange: handleChange, enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links }));
                const select = test_1.findTestSubject(component, `advancedSetting-editField-${setting.name}`);
                // @ts-ignore
                const values = select.find('option').map(option => option.prop('value'));
                expect(values).toEqual(['apple', 'orange', 'banana']);
                // @ts-ignore
                const labels = select.find('option').map(option => option.text());
                expect(labels).toEqual(['Apple', 'Orange', 'banana']);
            });
        }
        const setup = () => {
            const Wrapper = (props) => (react_1.default.createElement(react_2.I18nProvider, null,
                react_1.default.createElement(field_1.Field, Object.assign({ setting: setting, clearChange: clearChange, handleChange: handleChange, enableSaving: true, toasts: mocks_1.notificationServiceMock.createStartContract().toasts, dockLinks: mocks_1.docLinksServiceMock.createStartContract().links }, props))));
            const wrapper = enzyme_1.mount(react_1.default.createElement(Wrapper, null));
            const component = wrapper.find(react_2.I18nProvider).find(field_1.Field);
            return {
                wrapper,
                component,
            };
        };
        if (type === 'image') {
            describe(`for changing ${type} setting`, () => {
                const { wrapper, component } = setup();
                const userValue = userValues[type];
                component.instance().getImageAsBase64 = ({}) => Promise.resolve('');
                it('should be able to change value and cancel', async () => {
                    component.instance().onImageChange([userValue]);
                    expect(handleChange).toBeCalled();
                    await wrapper.setProps({
                        unsavedChanges: {
                            value: userValue,
                            changeImage: true,
                        },
                        setting: {
                            ...component.instance().props.setting,
                            value: userValue,
                        },
                    });
                    await component.instance().cancelChangeImage();
                    expect(clearChange).toBeCalledWith(setting.name);
                    wrapper.update();
                });
                it('should be able to change value from existing value', async () => {
                    await wrapper.setProps({
                        unsavedChanges: {},
                    });
                    const updated = wrapper.update();
                    test_1.findTestSubject(updated, `advancedSetting-changeImage-${setting.name}`).simulate('click');
                    const newUserValue = `${userValue}=`;
                    await component.instance().onImageChange([
                        newUserValue,
                    ]);
                    expect(handleChange).toBeCalled();
                });
                it('should be able to reset to default value', async () => {
                    const updated = wrapper.update();
                    test_1.findTestSubject(updated, `advancedSetting-resetField-${setting.name}`).simulate('click');
                    expect(handleChange).toBeCalledWith(setting.name, {
                        value: field_1.getEditableValue(setting.type, setting.defVal),
                        changeImage: true,
                    });
                });
            });
        }
        else if (type === 'markdown' || type === 'json') {
            describe(`for changing ${type} setting`, () => {
                const { wrapper, component } = setup();
                const userValue = userValues[type];
                it('should be able to change value', async () => {
                    component.instance().onCodeEditorChange(userValue);
                    expect(handleChange).toBeCalledWith(setting.name, { value: userValue });
                    await wrapper.setProps({
                        setting: {
                            ...component.instance().props.setting,
                            value: userValue,
                        },
                    });
                    wrapper.update();
                });
                it('should be able to reset to default value', async () => {
                    const updated = wrapper.update();
                    test_1.findTestSubject(updated, `advancedSetting-resetField-${setting.name}`).simulate('click');
                    expect(handleChange).toBeCalledWith(setting.name, {
                        value: field_1.getEditableValue(setting.type, setting.defVal),
                    });
                });
                if (type === 'json') {
                    it('should be able to clear value and have empty object populate', async () => {
                        await component.instance().onCodeEditorChange('');
                        wrapper.update();
                        expect(handleChange).toBeCalledWith(setting.name, { value: setting.defVal });
                    });
                }
            });
        }
        else {
            describe(`for changing ${type} setting`, () => {
                const { wrapper, component } = setup();
                // @ts-ignore
                const userValue = userValues[type];
                const fieldUserValue = type === 'array' ? userValue.join(', ') : userValue;
                if (setting.validation) {
                    // @ts-ignore
                    const invalidUserValue = invalidUserValues[type];
                    it('should display an error when validation fails', async () => {
                        await component.instance().onFieldChange(invalidUserValue);
                        const expectedUnsavedChanges = {
                            value: invalidUserValue,
                            error: setting.validation.message,
                            isInvalid: true,
                        };
                        expect(handleChange).toBeCalledWith(setting.name, expectedUnsavedChanges);
                        wrapper.setProps({ unsavedChanges: expectedUnsavedChanges });
                        const updated = wrapper.update();
                        const errorMessage = updated.find('.euiFormErrorText').text();
                        expect(errorMessage).toEqual(expectedUnsavedChanges.error);
                    });
                }
                it('should be able to change value', async () => {
                    await component.instance().onFieldChange(fieldUserValue);
                    const updated = wrapper.update();
                    expect(handleChange).toBeCalledWith(setting.name, { value: fieldUserValue });
                    updated.setProps({ unsavedChanges: { value: fieldUserValue } });
                    const currentValue = getFieldSettingValue(updated, setting.name, type);
                    expect(currentValue).toEqual(fieldUserValue);
                });
                it('should be able to reset to default value', async () => {
                    await wrapper.setProps({
                        unsavedChanges: {},
                        setting: { ...setting, value: fieldUserValue },
                    });
                    const updated = wrapper.update();
                    test_1.findTestSubject(updated, `advancedSetting-resetField-${setting.name}`).simulate('click');
                    const expectedEditableValue = field_1.getEditableValue(setting.type, setting.defVal);
                    expect(handleChange).toBeCalledWith(setting.name, {
                        value: expectedEditableValue,
                    });
                    updated.setProps({ unsavedChanges: { value: expectedEditableValue } });
                    const currentValue = getFieldSettingValue(updated, setting.name, type);
                    expect(currentValue).toEqual(expectedEditableValue);
                });
            });
        }
    });
});
