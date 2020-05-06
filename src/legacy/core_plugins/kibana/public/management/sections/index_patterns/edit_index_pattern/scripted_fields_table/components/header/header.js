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
const react_2 = require("@kbn/i18n/react");
exports.Header = ({ addScriptedFieldUrl }) => (react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center" },
    react_1.default.createElement(eui_1.EuiFlexItem, null,
        react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.scriptedHeader", defaultMessage: "Scripted fields" }))),
        react_1.default.createElement(eui_1.EuiText, null,
            react_1.default.createElement("p", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.scriptedLabel", defaultMessage: "You can use scripted fields in visualizations and display them in your documents. However, you cannot search\n            scripted fields." })))),
    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
        react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "addScriptedFieldLink", href: addScriptedFieldUrl },
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.scripted.addFieldButton", defaultMessage: "Add scripted field" })))));
