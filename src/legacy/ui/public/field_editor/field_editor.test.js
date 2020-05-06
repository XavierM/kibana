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
const new_platform_1 = require("ui/new_platform");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
// eslint-disable-next-line
const doc_links_service_mock_1 = require("../../../../core/public/doc_links/doc_links_service.mock");
jest.mock('brace/mode/groovy', () => ({}));
jest.mock('ui/new_platform');
const field_editor_1 = require("./field_editor");
jest.mock('@elastic/eui', () => ({
    EuiBasicTable: 'eui-basic-table',
    EuiButton: 'eui-button',
    EuiButtonEmpty: 'eui-button-empty',
    EuiCallOut: 'eui-call-out',
    EuiCode: 'eui-code',
    EuiConfirmModal: 'eui-confirm-modal',
    EuiFieldNumber: 'eui-field-number',
    EuiFieldText: 'eui-field-text',
    EuiFlexGroup: 'eui-flex-group',
    EuiFlexItem: 'eui-flex-item',
    EuiForm: 'eui-form',
    EuiFormRow: 'eui-form-row',
    EuiIcon: 'eui-icon',
    EuiLink: 'eui-link',
    EuiOverlayMask: 'eui-overlay-mask',
    EuiSelect: 'eui-select',
    EuiSpacer: 'eui-spacer',
    EuiText: 'eui-text',
    EuiTextArea: 'eui-textArea',
    htmlIdGenerator: () => 42,
    euiPaletteColorBlind: () => ['red'],
}));
jest.mock('ui/scripting_languages', () => ({
    getEnabledScriptingLanguages: () => ['painless', 'testlang'],
    getSupportedScriptingLanguages: () => ['painless'],
    getDeprecatedScriptingLanguages: () => ['testlang'],
}));
jest.mock('./components/scripting_call_outs', () => ({
    ScriptingDisabledCallOut: 'scripting-disabled-callOut',
    ScriptingWarningCallOut: 'scripting-warning-callOut',
    ScriptingHelpFlyout: 'scripting-help-flyout',
}));
jest.mock('./components/field_format_editor', () => ({
    FieldFormatEditor: 'field-format-editor',
}));
const fields = [
    {
        name: 'foobar',
    },
];
// @ts-ignore
fields.getByName = (name) => {
    return fields.find(field => field.name === name);
};
class Format {
    params() { }
}
Format.id = 'test_format';
Format.title = 'Test format';
const field = {
    scripted: true,
    type: 'number',
    lang: 'painless',
    format: new Format(),
};
const helpers = {
    Field: () => { },
    getConfig: () => { },
    getHttpStart: () => ({}),
    fieldFormatEditors: [],
    redirectAway: () => { },
    docLinksScriptedFields: doc_links_service_mock_1.docLinksServiceMock.createStartContract().links.scriptedFields,
};
describe('FieldEditor', () => {
    let indexPattern;
    beforeEach(() => {
        indexPattern = {
            fields: fields,
        };
        new_platform_1.npStart.plugins.data.fieldFormats.getDefaultType = jest.fn(() => ({}));
        new_platform_1.npStart.plugins.data.fieldFormats.getByFieldType = jest.fn(fieldType => {
            if (fieldType === 'number') {
                return [{}];
            }
            else {
                return [];
            }
        });
    });
    it('should render create new scripted field correctly', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_editor_1.FieldEditor, { indexPattern: indexPattern, field: field, helpers: helpers }));
        await new Promise(resolve => process.nextTick(resolve));
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should render edit scripted field correctly', async () => {
        const testField = {
            ...field,
            name: 'test',
            script: 'doc.test.value',
        };
        indexPattern.fields.push(testField);
        indexPattern.fields.getByName = name => {
            const flds = {
                [testField.name]: testField,
            };
            return flds[name];
        };
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_editor_1.FieldEditor, { indexPattern: indexPattern, field: testField, helpers: helpers }));
        await new Promise(resolve => process.nextTick(resolve));
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should show deprecated lang warning', async () => {
        const testField = {
            ...field,
            name: 'test',
            script: 'doc.test.value',
            lang: 'testlang',
        };
        indexPattern.fields.push(testField);
        indexPattern.fields.getByName = name => {
            const flds = {
                [testField.name]: testField,
            };
            return flds[name];
        };
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_editor_1.FieldEditor, { indexPattern: indexPattern, field: testField, helpers: helpers }));
        await new Promise(resolve => process.nextTick(resolve));
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should show conflict field warning', async () => {
        const testField = { ...field };
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_editor_1.FieldEditor, { indexPattern: indexPattern, field: testField, helpers: helpers }));
        await new Promise(resolve => process.nextTick(resolve));
        component.instance().onFieldChange('name', 'foobar');
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should show multiple type field warning with a table containing indices', async () => {
        const testField = {
            ...field,
            name: 'test-conflict',
            conflictDescriptions: {
                long: ['index_name_1', 'index_name_2'],
                text: ['index_name_3'],
            },
        };
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(field_editor_1.FieldEditor, { indexPattern: indexPattern, field: testField, helpers: helpers }));
        await new Promise(resolve => process.nextTick(resolve));
        component.instance().onFieldChange('name', 'foobar');
        component.update();
        expect(component).toMatchSnapshot();
    });
});
