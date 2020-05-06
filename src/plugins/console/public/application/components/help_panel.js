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
const editor_example_1 = require("./editor_example");
function HelpPanel(props) {
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: props.onClose, "data-test-subj": "helpFlyout", size: "s" },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.pageTitle", defaultMessage: "Help" })))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { defaultMessage: "Request format", id: "console.helpPage.requestFormatTitle" })),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.requestFormatDescription", defaultMessage: "You can type one or more requests in the white editor. Console understands requests in a compact format:" })),
                react_1.default.createElement(editor_example_1.EditorExample, { panel: "help" }),
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommandsTitle", defaultMessage: "Keyboard commands" })),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement("dl", null,
                    react_1.default.createElement("dt", null, "Ctrl/Cmd + I"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.autoIndentDescription", defaultMessage: "Auto indent current request" })),
                    react_1.default.createElement("dt", null, "Ctrl/Cmd + /"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.openDocumentationDescription", defaultMessage: "Open documentation for current request" })),
                    react_1.default.createElement("dt", null, "Ctrl + Space"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.openAutoCompleteDescription", defaultMessage: "Open Auto complete (even if not typing)" })),
                    react_1.default.createElement("dt", null, "Ctrl/Cmd + Enter"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.submitRequestDescription", defaultMessage: "Submit request" })),
                    react_1.default.createElement("dt", null, "Ctrl/Cmd + Up/Down"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.jumpToPreviousNextRequestDescription", defaultMessage: "Jump to the previous/next request start or end." })),
                    react_1.default.createElement("dt", null, "Ctrl/Cmd + Alt + L"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.collapseExpandCurrentScopeDescription", defaultMessage: "Collapse/expand current scope." })),
                    react_1.default.createElement("dt", null, "Ctrl/Cmd + Option + 0"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.collapseAllScopesDescription", defaultMessage: "Collapse all scopes but the current one. Expand by adding a shift." })),
                    react_1.default.createElement("dt", null, "Down arrow"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.switchFocusToAutoCompleteMenuDescription", defaultMessage: "Switch focus to auto-complete menu. Use arrows to further select a term" })),
                    react_1.default.createElement("dt", null, "Enter/Tab"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.selectCurrentlySelectedInAutoCompleteMenuDescription", defaultMessage: "Select the currently selected or the top most term in auto-complete menu" })),
                    react_1.default.createElement("dt", null, "Esc"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.helpPage.keyboardCommands.closeAutoCompleteMenuDescription", defaultMessage: "Close auto-complete menu" })))))));
}
exports.HelpPanel = HelpPanel;
