"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
function ActionBarWarning({ docCount, type }) {
    if (type === 'predecessors') {
        return (react_1.default.createElement(eui_1.EuiCallOut, { color: "warning", "data-test-subj": "predecessorsWarningMsg", iconType: "bolt", title: docCount === 0 ? (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.context.newerDocumentsWarningZero", defaultMessage: "No documents newer than the anchor could be found." })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.context.newerDocumentsWarning", defaultMessage: "Only {docCount} documents newer than the anchor could be found.", values: { docCount } })), size: "s" }));
    }
    return (react_1.default.createElement(eui_1.EuiCallOut, { color: "warning", "data-test-subj": "successorsWarningMsg", iconType: "bolt", title: docCount === 0 ? (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.context.olderDocumentsWarningZero", defaultMessage: "No documents older than the anchor could be found." })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.context.olderDocumentsWarning", defaultMessage: "Only {docCount} documents older than the anchor could be found.", values: { docCount } })), size: "s" }));
}
exports.ActionBarWarning = ActionBarWarning;
