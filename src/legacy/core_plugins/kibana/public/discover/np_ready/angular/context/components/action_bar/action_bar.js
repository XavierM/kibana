"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importStar(require("react"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const action_bar_warning_1 = require("./action_bar_warning");
const constants_1 = require("../../query_parameters/constants");
function ActionBar({ defaultStepSize, docCount, docCountAvailable, isDisabled, isLoading, onChangeCount, type, }) {
    const showWarning = !isDisabled && !isLoading && docCountAvailable < docCount;
    const isSuccessor = type === 'successors';
    const [newDocCount, setNewDocCount] = react_1.useState(docCount);
    const isValid = (value) => value >= constants_1.MIN_CONTEXT_SIZE && value <= constants_1.MAX_CONTEXT_SIZE;
    const onSubmit = (ev) => {
        ev.preventDefault();
        if (newDocCount !== docCount && isValid(newDocCount)) {
            onChangeCount(newDocCount);
        }
    };
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement("form", { onSubmit: onSubmit },
            isSuccessor && react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            isSuccessor && showWarning && (react_1.default.createElement(action_bar_warning_1.ActionBarWarning, { docCount: docCountAvailable, type: type })),
            isSuccessor && showWarning && react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiFlexGroup, { direction: "row", gutterSize: "s", responsive: false },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": `${type}LoadMoreButton`, iconType: isSuccessor ? 'arrowDown' : 'arrowUp', isDisabled: isDisabled, isLoading: isLoading, onClick: () => {
                            const value = newDocCount + defaultStepSize;
                            if (isValid(value)) {
                                setNewDocCount(value);
                                onChangeCount(value);
                            }
                        }, flush: "right" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.context.loadButtonLabel", defaultMessage: "Load" }))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiFormRow, null,
                        react_1.default.createElement(eui_1.EuiFieldNumber, { "aria-label": isSuccessor
                                ? i18n_1.i18n.translate('kbn.context.olderDocumentsAriaLabel', {
                                    defaultMessage: 'Number of older documents',
                                })
                                : i18n_1.i18n.translate('kbn.context.newerDocumentsAriaLabel', {
                                    defaultMessage: 'Number of newer documents',
                                }), className: "cxtSizePicker", "data-test-subj": `${type}CountPicker`, disabled: isDisabled, min: constants_1.MIN_CONTEXT_SIZE, max: constants_1.MAX_CONTEXT_SIZE, onChange: ev => {
                                setNewDocCount(ev.target.valueAsNumber);
                            }, onBlur: () => {
                                if (newDocCount !== docCount && isValid(newDocCount)) {
                                    onChangeCount(newDocCount);
                                }
                            }, type: "number", value: newDocCount >= 0 ? newDocCount : '' }))),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiFormRow, { displayOnly: true }, isSuccessor ? (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.context.olderDocumentsDescription", defaultMessage: "older documents" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.context.newerDocumentsDescription", defaultMessage: "newer documents" }))))),
            !isSuccessor && showWarning && (react_1.default.createElement(action_bar_warning_1.ActionBarWarning, { docCount: docCountAvailable, type: type })),
            !isSuccessor && react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }))));
}
exports.ActionBar = ActionBar;
