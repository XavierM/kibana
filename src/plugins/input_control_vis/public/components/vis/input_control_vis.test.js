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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const input_control_vis_1 = require("./input_control_vis");
const mockListControl = {
    id: 'mock-list-control',
    isEnabled: () => {
        return true;
    },
    options: {
        type: 'terms',
        multiselect: true,
    },
    type: 'list',
    label: 'list control',
    value: [],
    selectOptions: ['choice1', 'choice2'],
    format: (value) => value,
};
const mockRangeControl = {
    id: 'mock-range-control',
    isEnabled: () => {
        return true;
    },
    options: {
        decimalPlaces: 0,
        step: 1,
    },
    type: 'range',
    label: 'range control',
    value: { min: 0, max: 0 },
    min: 0,
    max: 100,
    format: (value) => value,
};
const updateFiltersOnChange = false;
const refreshControlMock = () => Promise.resolve();
let stageFilter;
let submitFilters;
let resetControls;
let clearControls;
beforeEach(() => {
    stageFilter = sinon_1.default.spy();
    submitFilters = sinon_1.default.spy();
    resetControls = sinon_1.default.spy();
    clearControls = sinon_1.default.spy();
});
test('Renders list control', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(input_control_vis_1.InputControlVis, { stageFilter: stageFilter, submitFilters: submitFilters, resetControls: resetControls, clearControls: clearControls, controls: [mockListControl], updateFiltersOnChange: updateFiltersOnChange, hasChanges: () => {
            return false;
        }, hasValues: () => {
            return false;
        }, refreshControl: refreshControlMock }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('Renders range control', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(input_control_vis_1.InputControlVis, { stageFilter: stageFilter, submitFilters: submitFilters, resetControls: resetControls, clearControls: clearControls, controls: [mockRangeControl], updateFiltersOnChange: updateFiltersOnChange, hasChanges: () => {
            return false;
        }, hasValues: () => {
            return false;
        }, refreshControl: refreshControlMock }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('Apply and Cancel change btns enabled when there are changes', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(input_control_vis_1.InputControlVis, { stageFilter: stageFilter, submitFilters: submitFilters, resetControls: resetControls, clearControls: clearControls, controls: [mockListControl], updateFiltersOnChange: updateFiltersOnChange, hasChanges: () => {
            return true;
        }, hasValues: () => {
            return false;
        }, refreshControl: refreshControlMock }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('Clear btns enabled when there are values', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(input_control_vis_1.InputControlVis, { stageFilter: stageFilter, submitFilters: submitFilters, resetControls: resetControls, clearControls: clearControls, controls: [mockListControl], updateFiltersOnChange: updateFiltersOnChange, hasChanges: () => {
            return false;
        }, hasValues: () => {
            return true;
        }, refreshControl: refreshControlMock }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('clearControls', () => {
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(input_control_vis_1.InputControlVis, { stageFilter: stageFilter, submitFilters: submitFilters, resetControls: resetControls, clearControls: clearControls, controls: [mockListControl], updateFiltersOnChange: updateFiltersOnChange, hasChanges: () => {
            return true;
        }, hasValues: () => {
            return true;
        }, refreshControl: refreshControlMock }));
    test_1.findTestSubject(component, 'inputControlClearBtn').simulate('click');
    sinon_1.default.assert.calledOnce(clearControls);
    sinon_1.default.assert.notCalled(submitFilters);
    sinon_1.default.assert.notCalled(resetControls);
    sinon_1.default.assert.notCalled(stageFilter);
});
test('submitFilters', () => {
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(input_control_vis_1.InputControlVis, { stageFilter: stageFilter, submitFilters: submitFilters, resetControls: resetControls, clearControls: clearControls, controls: [mockListControl], updateFiltersOnChange: updateFiltersOnChange, hasChanges: () => {
            return true;
        }, hasValues: () => {
            return true;
        }, refreshControl: refreshControlMock }));
    test_1.findTestSubject(component, 'inputControlSubmitBtn').simulate('click');
    sinon_1.default.assert.calledOnce(submitFilters);
    sinon_1.default.assert.notCalled(clearControls);
    sinon_1.default.assert.notCalled(resetControls);
    sinon_1.default.assert.notCalled(stageFilter);
});
test('resetControls', () => {
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(input_control_vis_1.InputControlVis, { stageFilter: stageFilter, submitFilters: submitFilters, resetControls: resetControls, clearControls: clearControls, controls: [mockListControl], updateFiltersOnChange: updateFiltersOnChange, hasChanges: () => {
            return true;
        }, hasValues: () => {
            return true;
        }, refreshControl: refreshControlMock }));
    test_1.findTestSubject(component, 'inputControlCancelBtn').simulate('click');
    sinon_1.default.assert.calledOnce(resetControls);
    sinon_1.default.assert.notCalled(clearControls);
    sinon_1.default.assert.notCalled(submitFilters);
    sinon_1.default.assert.notCalled(stageFilter);
});
