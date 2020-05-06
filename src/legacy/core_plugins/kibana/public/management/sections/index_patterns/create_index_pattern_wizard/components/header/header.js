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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
exports.Header = ({ prompt, indexPatternName, showSystemIndices = false, isIncludingSystemIndices, onChangeIncludingSystemIndices, isBeta = false, }) => (react_1.default.createElement("div", null,
    react_1.default.createElement(eui_1.EuiTitle, null,
        react_1.default.createElement("h1", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPatternHeader", defaultMessage: "Create {indexPatternName}", values: {
                    indexPatternName,
                } }),
            isBeta ? (react_1.default.createElement(react_1.Fragment, null,
                ' ',
                react_1.default.createElement(eui_1.EuiBetaBadge, { label: i18n_1.i18n.translate('kbn.management.createIndexPattern.betaLabel', {
                        defaultMessage: 'Beta',
                    }) }))) : null)),
    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "flexEnd" },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiText, { size: "s" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(eui_1.EuiTextColor, { color: "subdued" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPatternLabel", defaultMessage: "Kibana uses index patterns to retrieve data from Elasticsearch indices for things like visualizations." }))))),
        showSystemIndices ? (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiSwitch, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.includeSystemIndicesToggleSwitchLabel", defaultMessage: "Include system indices" }), id: "checkboxShowSystemIndices", checked: isIncludingSystemIndices, onChange: onChangeIncludingSystemIndices }))) : null),
    prompt ? (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        prompt)) : null,
    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
