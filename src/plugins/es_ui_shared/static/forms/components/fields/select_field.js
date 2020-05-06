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
const eui_1 = require("@elastic/eui");
const hook_form_lib_1 = require("../../hook_form_lib");
exports.SelectField = ({ field, euiFieldProps, ...rest }) => {
    const { isInvalid, errorMessage } = hook_form_lib_1.getFieldValidityAndErrorMessage(field);
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: field.label, helpText: typeof field.helpText === 'function' ? field.helpText() : field.helpText, error: errorMessage, isInvalid: isInvalid, fullWidth: true, "data-test-subj": rest['data-test-subj'], describedByIds: rest.idAria ? [rest.idAria] : undefined },
        react_1.default.createElement(eui_1.EuiSelect, Object.assign({ fullWidth: true, value: field.value, onChange: e => {
                field.setValue(e.target.value);
            }, options: [], hasNoInitialSelection: true, isInvalid: isInvalid, "data-test-subj": "select" }, euiFieldProps))));
};
