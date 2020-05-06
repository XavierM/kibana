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
exports.SectionLoading = ({ inline, children, ...rest }) => {
    if (inline) {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexStart", alignItems: "center", gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" })),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiText, Object.assign({}, rest),
                    react_1.default.createElement(eui_1.EuiTextColor, { color: "subdued" }, children)))));
    }
    return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { title: react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "xl" }), body: react_1.default.createElement(eui_1.EuiText, { color: "subdued" }, children), "data-test-subj": "sectionLoading" }));
};
