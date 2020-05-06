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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const options_tab_1 = require("./options_tab");
describe('OptionsTab', () => {
    let props;
    beforeEach(() => {
        props = {
            vis: {},
            stateParams: {
                updateFiltersOnChange: false,
                useTimeFilter: false,
                pinFilters: false,
            },
            setValue: jest.fn(),
        };
    });
    it('should renders OptionsTab', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(options_tab_1.OptionsTab, Object.assign({}, props)));
        expect(component).toMatchSnapshot();
    });
    it('should update updateFiltersOnChange', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(options_tab_1.OptionsTab, Object.assign({}, props)));
        const checkbox = component.find('[data-test-subj="inputControlEditorUpdateFiltersOnChangeCheckbox"] button');
        checkbox.simulate('click');
        expect(props.setValue).toHaveBeenCalledTimes(1);
        expect(props.setValue).toHaveBeenCalledWith('updateFiltersOnChange', true);
    });
    it('should update useTimeFilter', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(options_tab_1.OptionsTab, Object.assign({}, props)));
        const checkbox = component.find('[data-test-subj="inputControlEditorUseTimeFilterCheckbox"] button');
        checkbox.simulate('click');
        expect(props.setValue).toHaveBeenCalledTimes(1);
        expect(props.setValue).toHaveBeenCalledWith('useTimeFilter', true);
    });
    it('should update pinFilters', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(options_tab_1.OptionsTab, Object.assign({}, props)));
        const checkbox = component.find('[data-test-subj="inputControlEditorPinFiltersCheckbox"] button');
        checkbox.simulate('click');
        expect(props.setValue).toHaveBeenCalledTimes(1);
        expect(props.setValue).toHaveBeenCalledWith('pinFilters', true);
    });
});
