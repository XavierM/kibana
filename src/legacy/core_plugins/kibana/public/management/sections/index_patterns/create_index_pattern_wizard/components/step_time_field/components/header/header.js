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
exports.Header = ({ indexPattern, indexPatternName }) => (react_1.default.createElement("div", null,
    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
        react_1.default.createElement("h2", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTimeHeader", defaultMessage: "Step 2 of 2: Configure settings" }))),
    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
    react_1.default.createElement(eui_1.EuiText, { color: "subdued" },
        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTimeLabel", defaultMessage: "You've defined {indexPattern} as your {indexPatternName}. Now you can specify some settings before we create it.", values: {
                indexPattern: react_1.default.createElement("strong", null, indexPattern),
                indexPatternName,
            } }))));
