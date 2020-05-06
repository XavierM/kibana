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
exports.Header = () => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
        react_1.default.createElement("h3", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.sourceHeader", defaultMessage: "Source filters" }))),
    react_1.default.createElement(eui_1.EuiText, null,
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.sourceLabel", defaultMessage: "Source filters can be used to exclude one or more fields when fetching the document source. This happens when\n          viewing a document in the Discover app, or with a table displaying results from a saved search in the Dashboard app. Each row is\n          built using the source of a single document, and if you have documents with large or unimportant fields you may benefit from\n          filtering those out at this lower level." })),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.source.noteLabel", defaultMessage: "Note that multi-fields will incorrectly appear as matches in the table below. These filters only actually apply\n          to fields in the original source document, so matching multi-fields are not actually being filtered." }))),
    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
