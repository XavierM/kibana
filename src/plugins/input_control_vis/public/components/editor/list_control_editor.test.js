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
const sinon_1 = tslib_1.__importDefault(require("sinon"));
const enzyme_1 = require("enzyme");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const get_index_pattern_mock_1 = require("../../test_utils/get_index_pattern_mock");
const list_control_editor_1 = require("./list_control_editor");
const test_utils_1 = require("../../test_utils");
const controlParamsBase = {
    id: '1',
    indexPattern: 'indexPattern1',
    fieldName: 'keywordField',
    label: 'custom label',
    type: 'list',
    options: {
        type: 'terms',
        multiselect: true,
        dynamicOptions: false,
        size: 10,
    },
    parent: '',
};
const deps = test_utils_1.getDepsMock();
let handleFieldNameChange;
let handleIndexPatternChange;
let handleOptionsChange;
beforeEach(() => {
    handleFieldNameChange = sinon_1.default.spy();
    handleIndexPatternChange = sinon_1.default.spy();
    handleOptionsChange = sinon_1.default.spy();
});
describe('renders', () => {
    test('should not display any options until field is selected', async () => {
        const controlParams = {
            id: '1',
            label: 'mock',
            indexPattern: 'mockIndexPattern',
            fieldName: '',
            type: 'list',
            options: {
                type: 'terms',
                multiselect: true,
                dynamicOptions: true,
                size: 5,
            },
            parent: '',
        };
        const component = enzyme_1.shallow(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParams, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: [] }));
        await test_utils_1.updateComponent(component);
        expect(component).toMatchSnapshot();
    });
    test('should display chaining input when parents are provided', async () => {
        const parentCandidates = [
            { value: '1', text: 'fieldA' },
            { value: '2', text: 'fieldB' },
        ];
        const component = enzyme_1.shallow(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParamsBase, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: parentCandidates }));
        await test_utils_1.updateComponent(component);
        expect(component).toMatchSnapshot();
    });
    describe('dynamic options', () => {
        test('should display dynamic options for string fields', async () => {
            const controlParams = {
                id: '1',
                label: 'mock',
                indexPattern: 'mockIndexPattern',
                fieldName: 'keywordField',
                type: 'list',
                options: {
                    type: 'terms',
                    multiselect: true,
                    dynamicOptions: true,
                    size: 5,
                },
                parent: '',
            };
            const component = enzyme_1.shallow(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParams, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: [] }));
            await test_utils_1.updateComponent(component);
            expect(component).toMatchSnapshot();
        });
        test('should display size field when dynamic options is disabled', async () => {
            const controlParams = {
                id: '1',
                label: 'mock',
                indexPattern: 'mockIndexPattern',
                fieldName: 'keywordField',
                type: 'list',
                options: {
                    type: 'terms',
                    multiselect: true,
                    dynamicOptions: false,
                    size: 5,
                },
                parent: '',
            };
            const component = enzyme_1.shallow(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParams, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: [] }));
            await test_utils_1.updateComponent(component);
            expect(component).toMatchSnapshot();
        });
        test('should display disabled dynamic options with tooltip for non-string fields', async () => {
            const controlParams = {
                id: '1',
                label: 'mock',
                indexPattern: 'mockIndexPattern',
                fieldName: 'numberField',
                type: 'list',
                options: {
                    type: 'terms',
                    multiselect: true,
                    dynamicOptions: true,
                    size: 5,
                },
                parent: '',
            };
            const component = enzyme_1.shallow(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParams, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: [] }));
            await test_utils_1.updateComponent(component);
            expect(component).toMatchSnapshot();
        });
    });
});
test('handleOptionsChange - multiselect', async () => {
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParamsBase, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: [] }));
    await test_utils_1.updateComponent(component);
    const checkbox = test_1.findTestSubject(component, 'listControlMultiselectInput');
    checkbox.simulate('click');
    sinon_1.default.assert.notCalled(handleFieldNameChange);
    sinon_1.default.assert.notCalled(handleIndexPatternChange);
    const expectedControlIndex = 0;
    const expectedOptionName = 'multiselect';
    sinon_1.default.assert.calledWith(handleOptionsChange, expectedControlIndex, expectedOptionName);
});
test('handleOptionsChange - size', async () => {
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParamsBase, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: [] }));
    await test_utils_1.updateComponent(component);
    const input = test_1.findTestSubject(component, 'listControlSizeInput');
    input.simulate('change', { target: { valueAsNumber: 7 } });
    sinon_1.default.assert.notCalled(handleFieldNameChange);
    sinon_1.default.assert.notCalled(handleIndexPatternChange);
    const expectedControlIndex = 0;
    const expectedOptionName = 'size';
    sinon_1.default.assert.calledWith(handleOptionsChange, expectedControlIndex, expectedOptionName, 7);
});
test('field name change', async () => {
    const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(list_control_editor_1.ListControlEditor, { deps: deps, getIndexPattern: get_index_pattern_mock_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParamsBase, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange, handleParentChange: () => { }, parentCandidates: [] }));
    // ensure that after async loading is complete the DynamicOptionsSwitch is not disabled
    expect(component.find('[data-test-subj="listControlDynamicOptionsSwitch"][disabled=false]')).toHaveLength(0);
    await test_utils_1.updateComponent(component);
    expect(component.find('[data-test-subj="listControlDynamicOptionsSwitch"][disabled=false]')).toHaveLength(1);
    component.setProps({
        controlParams: {
            ...controlParamsBase,
            fieldName: 'numberField',
        },
    });
    // ensure that after async loading is complete the DynamicOptionsSwitch is disabled, because this is not a "string" field
    expect(component.find('[data-test-subj="listControlDynamicOptionsSwitch"][disabled=true]')).toHaveLength(0);
    await test_utils_1.updateComponent(component);
    expect(component.find('[data-test-subj="listControlDynamicOptionsSwitch"][disabled=true]')).toHaveLength(1);
    component.setProps({
        controlParams: controlParamsBase,
    });
    // ensure that after async loading is complete the DynamicOptionsSwitch is not disabled again, because we switched to original "string" field
    expect(component.find('[data-test-subj="listControlDynamicOptionsSwitch"][disabled=false]')).toHaveLength(0);
    await test_utils_1.updateComponent(component);
    expect(component.find('[data-test-subj="listControlDynamicOptionsSwitch"][disabled=false]')).toHaveLength(1);
});
