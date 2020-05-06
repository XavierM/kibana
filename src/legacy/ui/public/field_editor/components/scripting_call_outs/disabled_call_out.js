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
exports.ScriptingDisabledCallOut = ({ isVisible = false }) => {
    return isVisible ? (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.disabledCallOutHeader", defaultMessage: "Scripting disabled", description: "Showing the status that scripting is disabled in Elasticsearch. Not an update message, that it JUST got disabled." }), color: "danger", iconType: "alert" },
            react_1.default.createElement("p", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.disabledCallOutLabel", defaultMessage: "All inline scripting has been disabled in Elasticsearch. You must enable inline scripting for at least one\n            language in order to use scripted fields in Kibana." }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }))) : null;
};
exports.ScriptingDisabledCallOut.displayName = 'ScriptingDisabledCallOut';
