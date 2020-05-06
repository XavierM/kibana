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
require("./time_field.css");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
exports.TimeField = ({ isVisible, fetchTimeFields, timeFieldOptions, isLoading, selectedTimeField, onTimeFieldChanged, }) => (react_1.default.createElement(eui_1.EuiForm, null, isVisible ? (react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "xs", justifyContent: "spaceBetween", alignItems: "center" },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement("span", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.fieldHeader", defaultMessage: "Time Filter field name" }))),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, isLoading ? (react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" })) : (react_1.default.createElement(eui_1.EuiLink, { className: "timeFieldRefreshButton", onClick: fetchTimeFields },
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.refreshButton", defaultMessage: "Refresh" }))))), helpText: react_1.default.createElement("div", null,
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.fieldLabel", defaultMessage: "The Time Filter will use this field to filter your data by time." })),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.fieldWarningLabel", defaultMessage: "You can choose not to have a time field, but you will not be able to narrow down your data by a time range." }))) }, isLoading ? (react_1.default.createElement(eui_1.EuiSelect, { name: "timeField", "data-test-subj": "createIndexPatternTimeFieldSelect", options: [
        {
            text: i18n_1.i18n.translate('kbn.management.createIndexPattern.stepTime.field.loadingDropDown', {
                defaultMessage: 'Loading…',
            }),
            value: '',
        },
    ], disabled: true })) : (react_1.default.createElement(eui_1.EuiSelect, { name: "timeField", "data-test-subj": "createIndexPatternTimeFieldSelect", options: timeFieldOptions, isLoading: isLoading, disabled: isLoading, value: selectedTimeField, onChange: onTimeFieldChanged })))) : (react_1.default.createElement(eui_1.EuiText, null,
    react_1.default.createElement("p", null,
        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.field.noTimeFieldsLabel", defaultMessage: "The indices which match this index pattern don't contain any time fields." }))))));
