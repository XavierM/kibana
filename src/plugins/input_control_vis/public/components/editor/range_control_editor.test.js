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
const enzyme_1 = require("enzyme");
const sinon_1 = require("sinon");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const range_control_editor_1 = require("./range_control_editor");
const get_deps_mock_1 = require("../../test_utils/get_deps_mock");
const test_utils_1 = require("../../test_utils");
const controlParams = {
    id: '1',
    indexPattern: 'indexPattern1',
    fieldName: 'numberField',
    label: 'custom label',
    type: 'range',
    options: {
        decimalPlaces: 0,
        step: 1,
    },
    parent: '',
};
const deps = get_deps_mock_1.getDepsMock();
let handleFieldNameChange;
let handleIndexPatternChange;
let handleOptionsChange;
beforeEach(() => {
    handleFieldNameChange = sinon_1.spy();
    handleIndexPatternChange = sinon_1.spy();
    handleOptionsChange = sinon_1.spy();
});
test('renders RangeControlEditor', async () => {
    const component = enzyme_1.shallow(react_1.default.createElement(range_control_editor_1.RangeControlEditor, { deps: deps, getIndexPattern: test_utils_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParams, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange }));
    await test_utils_1.updateComponent(component);
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('handleOptionsChange - step', async () => {
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(range_control_editor_1.RangeControlEditor, { deps: deps, getIndexPattern: test_utils_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParams, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange }));
    await test_utils_1.updateComponent(component);
    test_1.findTestSubject(component, 'rangeControlSizeInput0').simulate('change', {
        target: { valueAsNumber: 0.5 },
    });
    sinon_1.assert.notCalled(handleFieldNameChange);
    sinon_1.assert.notCalled(handleIndexPatternChange);
    const expectedControlIndex = 0;
    const expectedOptionName = 'step';
    sinon_1.assert.calledWith(handleOptionsChange, expectedControlIndex, expectedOptionName, 0.5);
});
test('handleOptionsChange - decimalPlaces', async () => {
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(range_control_editor_1.RangeControlEditor, { deps: deps, getIndexPattern: test_utils_1.getIndexPatternMock, controlIndex: 0, controlParams: controlParams, handleFieldNameChange: handleFieldNameChange, handleIndexPatternChange: handleIndexPatternChange, handleOptionsChange: handleOptionsChange }));
    await test_utils_1.updateComponent(component);
    test_1.findTestSubject(component, 'rangeControlDecimalPlacesInput0').simulate('change', {
        target: { valueAsNumber: 2 },
    });
    sinon_1.assert.notCalled(handleFieldNameChange);
    sinon_1.assert.notCalled(handleIndexPatternChange);
    const expectedControlIndex = 0;
    const expectedOptionName = 'decimalPlaces';
    sinon_1.assert.calledWith(handleOptionsChange, expectedControlIndex, expectedOptionName, 2);
});
