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
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
exports.CreateIndexPatternPrompt = ({ onClose }) => (react_2.default.createElement(eui_1.EuiFlyout, { size: "s", onClose: onClose, "data-test-subj": "CreateIndexPatternPrompt" },
    react_2.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
        react_2.default.createElement(eui_1.EuiText, { grow: false },
            react_2.default.createElement("h2", null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.title", defaultMessage: "About index patterns" })))),
    react_2.default.createElement(eui_1.EuiFlyoutBody, null,
        react_2.default.createElement(eui_1.EuiText, { textAlign: "left" },
            react_2.default.createElement("p", null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.subtitle", defaultMessage: "Index patterns allow you to bucket disparate data sources together so their shared fields may be queried in\n          Kibana." }))),
        react_2.default.createElement(eui_1.EuiHorizontalRule, { margin: "l" }),
        react_2.default.createElement(eui_1.EuiText, { textAlign: "left" },
            react_2.default.createElement("h3", null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.examplesTitle", defaultMessage: "Examples of index patterns" }))),
        react_2.default.createElement(eui_1.EuiSpacer, null),
        react_2.default.createElement(eui_1.EuiDescriptionList, { className: "indexPatternListPrompt__descList" },
            react_2.default.createElement(eui_1.EuiDescriptionListTitle, null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.exampleOneTitle", defaultMessage: "Single data source" })),
            react_2.default.createElement(eui_1.EuiDescriptionListDescription, null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.exampleOne", defaultMessage: "Index a single data source named log-west-001 so you can build charts or query its contents fast." })),
            react_2.default.createElement(eui_1.EuiDescriptionListTitle, null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.exampleTwoTitle", defaultMessage: "Multiple data sources" })),
            react_2.default.createElement(eui_1.EuiDescriptionListDescription, null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.exampleTwo", defaultMessage: "Group all incoming data sources starting with log-west* so you can query against all your west coast server\n            logs." })),
            react_2.default.createElement(eui_1.EuiDescriptionListTitle, null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.exampleThreeTitle", defaultMessage: "Custom groupings" })),
            react_2.default.createElement(eui_1.EuiDescriptionListDescription, null,
                react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternPrompt.exampleThree", defaultMessage: "Specifically group your archived, monthly, roll-up metrics of those logs into a separate index pattern so\n            you can aggregate historical trends to compare." }))))));
