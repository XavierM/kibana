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
const test_utils_1 = require("react-dom/test-utils");
const enzyme_1 = require("enzyme");
const eui_1 = require("@elastic/eui");
const field_1 = require("./field");
function callComboBoxOnChange(comp, value = []) {
    const comboBoxProps = comp.find(eui_1.EuiComboBox).props();
    if (comboBoxProps.onChange) {
        comboBoxProps.onChange(value);
    }
}
describe('FieldParamEditor component', () => {
    let setValue;
    let setValidity;
    let setTouched;
    let onChange;
    let defaultProps;
    let indexedFields;
    let field;
    let option;
    beforeEach(() => {
        setValue = jest.fn();
        setValidity = jest.fn();
        setTouched = jest.fn();
        onChange = jest.fn();
        field = { displayName: 'bytes' };
        option = { label: 'bytes', target: field };
        indexedFields = [
            {
                label: 'Field',
                options: [option],
            },
        ];
        defaultProps = {
            agg: {},
            aggParam: {
                name: 'field',
                type: 'field',
                editorComponent: () => null,
                onChange,
            },
            formIsTouched: false,
            value: undefined,
            editorConfig: {},
            indexedFields,
            showValidation: false,
            setValue,
            setValidity,
            setTouched,
            state: {},
            metricAggs: [],
            schemas: [],
        };
    });
    it('should disable combo box when indexedFields is empty', () => {
        defaultProps.indexedFields = [];
        const comp = enzyme_1.shallow(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(comp.find('EuiComboBox').prop('isDisabled')).toBeTruthy();
    });
    it('should set field option value if only one available', () => {
        enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValue).toHaveBeenCalledWith(field);
    });
    // this is the case when field options do not have groups
    it('should set field value if only one available', () => {
        defaultProps.indexedFields = [option];
        enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValue).toHaveBeenCalledWith(field);
    });
    it('should set validity as true when value is defined', () => {
        defaultProps.value = field;
        enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValidity).toHaveBeenCalledWith(true);
    });
    it('should set validity as false when value is not defined', () => {
        enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValidity).toHaveBeenCalledWith(false);
    });
    it('should set validity as false when there are no indexedFields', () => {
        defaultProps.indexedFields = [];
        enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValidity).toHaveBeenCalledWith(false);
    });
    it('should set validity as false when there are a custom error', () => {
        defaultProps.customError = 'customError';
        enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValidity).toHaveBeenCalledWith(false);
    });
    it('should call onChange when a field selected', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        test_utils_1.act(() => {
            // simulate the field selection
            callComboBoxOnChange(comp, [{ target: field }]);
        });
        expect(onChange).toHaveBeenCalled();
    });
    it('should call setValue when nothing selected and field is not required', () => {
        defaultProps.aggParam.required = false;
        defaultProps.indexedFields = [indexedFields[0], indexedFields[0]];
        const comp = enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValue).toHaveBeenCalledTimes(0);
        test_utils_1.act(() => {
            callComboBoxOnChange(comp);
        });
        expect(setValue).toHaveBeenCalledTimes(1);
        expect(setValue).toHaveBeenCalledWith(undefined);
    });
    it('should not call setValue when nothing selected and field is required', () => {
        defaultProps.aggParam.required = true;
        const comp = enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValue).toHaveBeenCalledTimes(1);
        test_utils_1.act(() => {
            callComboBoxOnChange(comp);
        });
        expect(setValue).toHaveBeenCalledTimes(1);
    });
    it('should call setValue when a field selected and field is required', () => {
        defaultProps.aggParam.required = true;
        const comp = enzyme_1.mount(react_1.default.createElement(field_1.FieldParamEditor, Object.assign({}, defaultProps)));
        expect(setValue).toHaveBeenCalledTimes(1);
        test_utils_1.act(() => {
            callComboBoxOnChange(comp, [{ target: field }]);
        });
        expect(setValue).toHaveBeenCalledTimes(2);
        expect(setValue).toHaveBeenLastCalledWith(field);
    });
});
