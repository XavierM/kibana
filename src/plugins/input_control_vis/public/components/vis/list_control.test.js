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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const list_control_1 = require("./list_control");
const options = ['choice1', 'choice2'];
const formatOptionLabel = (value) => {
    return `${value} + formatting`;
};
let stageFilter;
beforeEach(() => {
    stageFilter = sinon_1.default.spy();
});
test('renders ListControl', () => {
    const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(list_control_1.ListControl.WrappedComponent, { id: "mock-list-control", label: "list control", options: options, selectedOptions: [], multiselect: true, controlIndex: 0, stageFilter: stageFilter, formatOptionLabel: formatOptionLabel, intl: {} }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('disableMsg', () => {
    const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(list_control_1.ListControl.WrappedComponent, { id: "mock-list-control", label: "list control", selectedOptions: [], multiselect: true, controlIndex: 0, stageFilter: stageFilter, formatOptionLabel: formatOptionLabel, disableMsg: 'control is disabled to test rendering when disabled', intl: {} }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
