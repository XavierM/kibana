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
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
exports.Header = ({ isInputInvalid, errors, characterList, query, onQueryChanged, goToNextStep, isNextStepDisabled, ...rest }) => (react_1.default.createElement("div", Object.assign({}, rest),
    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
        react_1.default.createElement("h2", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepHeader", defaultMessage: "Step 1 of 2: Define index pattern" }))),
    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "flexEnd" },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiForm, { isInvalid: isInputInvalid },
                react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.indexPatternLabel", defaultMessage: "Index pattern" }), isInvalid: isInputInvalid, error: errors, helpText: react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.indexPattern.allowLabel", defaultMessage: "You can use a {asterisk} as a wildcard in your index pattern.", values: { asterisk: react_1.default.createElement("strong", null, "*") } })),
                        react_1.default.createElement("p", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.indexPattern.disallowLabel", defaultMessage: "You can't use spaces or the characters {characterList}.", values: { characterList: react_1.default.createElement("strong", null, characterList) } }))) },
                    react_1.default.createElement(eui_1.EuiFieldText, { name: "indexPattern", placeholder: i18n_1.i18n.translate('kbn.management.createIndexPattern.step.indexPatternPlaceholder', {
                            defaultMessage: 'index-name-*',
                        }), value: query, isInvalid: isInputInvalid, onChange: onQueryChanged, "data-test-subj": "createIndexPatternNameInput" })))),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiButton, { iconType: "arrowRight", onClick: () => goToNextStep(query), isDisabled: isNextStepDisabled, "data-test-subj": "createIndexPatternGoToStep2Button" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.nextStepButton", defaultMessage: "Next step" }))))));
