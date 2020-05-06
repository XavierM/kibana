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
const hook_form_lib_1 = require("../hook_form_lib");
const fields_1 = require("./fields");
const mapTypeToFieldComponent = {
    [hook_form_lib_1.FIELD_TYPES.TEXT]: fields_1.TextField,
    [hook_form_lib_1.FIELD_TYPES.TEXTAREA]: fields_1.TextAreaField,
    [hook_form_lib_1.FIELD_TYPES.NUMBER]: fields_1.NumericField,
    [hook_form_lib_1.FIELD_TYPES.CHECKBOX]: fields_1.CheckBoxField,
    [hook_form_lib_1.FIELD_TYPES.COMBO_BOX]: fields_1.ComboBoxField,
    [hook_form_lib_1.FIELD_TYPES.MULTI_SELECT]: fields_1.MultiSelectField,
    [hook_form_lib_1.FIELD_TYPES.RADIO_GROUP]: fields_1.RadioGroupField,
    [hook_form_lib_1.FIELD_TYPES.RANGE]: fields_1.RangeField,
    [hook_form_lib_1.FIELD_TYPES.SELECT]: fields_1.SelectField,
    [hook_form_lib_1.FIELD_TYPES.SUPER_SELECT]: fields_1.SuperSelectField,
    [hook_form_lib_1.FIELD_TYPES.TOGGLE]: fields_1.ToggleField,
};
exports.Field = (props) => {
    const FieldComponent = mapTypeToFieldComponent[props.field.type] || fields_1.TextField;
    return react_1.default.createElement(FieldComponent, Object.assign({}, props));
};
