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
const react_2 = require("@kbn/i18n/react");
exports.ScriptingWarningCallOut = ({ isVisible = false, docLinksScriptedFields, }) => {
    return isVisible ? (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningCallOutHeader", defaultMessage: "Proceed with caution" }), color: "warning", iconType: "alert" },
            react_1.default.createElement("p", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningCallOutLabel.callOutDetail", defaultMessage: "Please familiarize yourself with {scripFields} and with {scriptsInAggregation} before using scripted fields.", values: {
                        scripFields: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: docLinksScriptedFields.scriptFields },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningCallOutLabel.scripFieldsLink", defaultMessage: "script fields" }),
                            "\u00A0",
                            react_1.default.createElement(eui_1.EuiIcon, { type: "link" }))),
                        scriptsInAggregation: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: docLinksScriptedFields.scriptAggs },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningCallOutLabel.scriptsInAggregationLink", defaultMessage: "scripts in aggregations" }),
                            "\u00A0",
                            react_1.default.createElement(eui_1.EuiIcon, { type: "link" }))),
                    } })),
            react_1.default.createElement("p", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningCallOut.descriptionLabel", defaultMessage: "Scripted fields can be used to display and aggregate calculated values. As such, they can be very slow, and\n            if done incorrectly, can cause Kibana to be unusable. There's no safety net here. If you make a typo, unexpected exceptions\n            will be thrown all over the place!" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }))) : null;
};
exports.ScriptingWarningCallOut.displayName = 'ScriptingWarningCallOut';
