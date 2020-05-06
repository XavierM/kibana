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
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
exports.DiscoverUninitialized = ({ onRefresh }) => {
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(eui_1.EuiPage, null,
            react_1.default.createElement(eui_1.EuiPageBody, null,
                react_1.default.createElement(eui_1.EuiPageContent, { horizontalPosition: "center" },
                    react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "discoverApp", title: react_1.default.createElement("h2", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.discover.uninitializedTitle", defaultMessage: "Start searching" })), body: react_1.default.createElement("p", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.discover.uninitializedText", defaultMessage: "Write a query, add some filters, or simply hit Refresh to retrieve results for the current query." })), actions: react_1.default.createElement(eui_1.EuiButton, { color: "primary", fill: true, onClick: onRefresh },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.discover.uninitializedRefreshButtonText", defaultMessage: "Refresh data" })) }))))));
};
