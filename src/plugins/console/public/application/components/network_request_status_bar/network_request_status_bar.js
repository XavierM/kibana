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
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const mapStatusCodeToBadgeColor = (statusCode) => {
    if (statusCode <= 199) {
        return 'default';
    }
    if (statusCode <= 299) {
        return 'secondary';
    }
    if (statusCode <= 399) {
        return 'primary';
    }
    if (statusCode <= 499) {
        return 'warning';
    }
    return 'danger';
};
exports.NetworkRequestStatusBar = ({ requestInProgress, requestResult, }) => {
    let content = null;
    if (requestInProgress) {
        content = (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiBadge, { color: "hollow" }, i18n_1.i18n.translate('console.requestInProgressBadgeText', {
                defaultMessage: 'Request in progress',
            }))));
    }
    else if (requestResult) {
        const { endpoint, method, statusCode, statusText, timeElapsedMs } = requestResult;
        content = (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: react_1.default.createElement(eui_1.EuiText, { size: "s" }, `${method} ${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`) },
                    react_1.default.createElement(eui_1.EuiBadge, { color: mapStatusCodeToBadgeColor(statusCode) },
                        statusCode,
                        "\u00A0-\u00A0",
                        statusText))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: react_1.default.createElement(eui_1.EuiText, { size: "s" }, i18n_1.i18n.translate('console.requestTimeElapasedBadgeTooltipContent', {
                        defaultMessage: 'Time Elapsed',
                    })) },
                    react_1.default.createElement(eui_1.EuiText, { size: "s" },
                        react_1.default.createElement(eui_1.EuiBadge, { color: "default" },
                            timeElapsedMs,
                            "\u00A0",
                            'ms'))))));
    }
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", alignItems: "center", direction: "row", gutterSize: "s", responsive: false }, content));
};
