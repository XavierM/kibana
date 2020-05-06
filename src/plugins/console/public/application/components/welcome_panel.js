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
// @ts-ignore
const eui_1 = require("@elastic/eui");
const editor_example_1 = require("./editor_example");
function WelcomePanel(props) {
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: props.onDismiss, "data-test-subj": "welcomePanel", size: "s" },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.pageTitle", defaultMessage: "Welcome to Console" })))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement("h4", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickIntroTitle", defaultMessage: "Quick intro to the UI" })),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickIntroDescription", defaultMessage: "The Console UI is split into two panes: an editor pane (left) and a response pane (right).\n                Use the editor to type requests and submit them to Elasticsearch. The results will be displayed in\n                the response pane on the right side." })),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.supportedRequestFormatTitle", defaultMessage: "Console understands requests in a compact format, similar to cURL:" })),
                react_1.default.createElement(editor_example_1.EditorExample, { panel: "welcome" }),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.supportedRequestFormatDescription", defaultMessage: "While typing a request, Console will make suggestions which you can then accept by hitting Enter/Tab.\n              These suggestions are made based on the request structure as well as your indices and types." })),
                react_1.default.createElement("h4", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickTipsTitle", defaultMessage: "A few quick tips, while I have your attention" })),
                react_1.default.createElement("ul", null,
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickTips.submitRequestDescription", defaultMessage: "Submit requests to ES using the green triangle button." })),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickTips.useWrenchMenuDescription", defaultMessage: "Use the wrench menu for other useful things." })),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickTips.cUrlFormatForRequestsDescription", defaultMessage: "You can paste requests in cURL format and they will be translated to the Console syntax." })),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickTips.resizeEditorDescription", defaultMessage: "You can resize the editor and output panes by dragging the separator between them." })),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.quickTips.keyboardShortcutsDescription", defaultMessage: "Study the keyboard shortcuts under the Help button. Good stuff in there!" }))))),
        react_1.default.createElement(eui_1.EuiFlyoutFooter, null,
            react_1.default.createElement(eui_1.EuiButton, { fill: true, fullWidth: false, "data-test-subj": "help-close-button", onClick: props.onDismiss },
                react_1.default.createElement(react_2.FormattedMessage, { id: "console.welcomePage.closeButtonLabel", defaultMessage: "Dismiss" })))));
}
exports.WelcomePanel = WelcomePanel;
