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
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const hook_form_lib_1 = require("../../hook_form_lib");
exports.ComboBoxField = ({ field, euiFieldProps = {}, ...rest }) => {
    // Errors for the comboBox value (the "array")
    const errorMessageField = field.getErrorsMessages();
    // Errors for comboBox option added (the array "item")
    const errorMessageArrayItem = field.getErrorsMessages({
        validationType: hook_form_lib_1.VALIDATION_TYPES.ARRAY_ITEM,
    });
    const isInvalid = field.errors.length
        ? errorMessageField !== null || errorMessageArrayItem !== null
        : false;
    // Concatenate error messages.
    const errorMessage = errorMessageField && errorMessageArrayItem
        ? `${errorMessageField}, ${errorMessageArrayItem}`
        : errorMessageField
            ? errorMessageField
            : errorMessageArrayItem;
    const onCreateComboOption = (value) => {
        // Note: for now, all validations for a comboBox array item have to be synchronous
        // If there is a need to support asynchronous validation, we'll work on it (and will need to update the <EuiComboBox /> logic).
        const { isValid } = field.validate({
            value,
            validationType: hook_form_lib_1.VALIDATION_TYPES.ARRAY_ITEM,
        });
        if (!isValid) {
            // Return false to explicitly reject the user's input.
            return false;
        }
        const newValue = [...field.value, value];
        field.setValue(newValue);
    };
    const onComboChange = (options) => {
        field.setValue(options.map(option => option.label));
    };
    const onSearchComboChange = (value) => {
        if (value) {
            field.clearErrors(hook_form_lib_1.VALIDATION_TYPES.ARRAY_ITEM);
        }
    };
    return (react_1.default.createElement(eui_1.EuiFormRow, { label: field.label, labelAppend: field.labelAppend, helpText: typeof field.helpText === 'function' ? field.helpText() : field.helpText, error: errorMessage, isInvalid: isInvalid, fullWidth: true, "data-test-subj": rest['data-test-subj'], describedByIds: rest.idAria ? [rest.idAria] : undefined },
        react_1.default.createElement(eui_1.EuiComboBox, Object.assign({ noSuggestions: true, placeholder: i18n_1.i18n.translate('esUi.forms.comboBoxField.placeHolderText', {
                defaultMessage: 'Type and then hit "ENTER"',
            }), selectedOptions: field.value.map(v => ({ label: v })), onCreateOption: onCreateComboOption, onChange: onComboChange, onSearchChange: onSearchComboChange, fullWidth: true, "data-test-subj": "input" }, euiFieldProps))));
};
