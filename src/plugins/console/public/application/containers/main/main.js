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
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const console_history_1 = require("../console_history");
const editor_1 = require("../editor");
const settings_1 = require("../settings");
const components_1 = require("../../components");
const contexts_1 = require("../../contexts");
const hooks_1 = require("../../hooks");
const get_top_nav_1 = require("./get_top_nav");
function Main() {
    const { services: { storage }, } = contexts_1.useServicesContext();
    const { ready: editorsReady } = contexts_1.useEditorReadContext();
    const { requestInFlight: requestInProgress, lastResult: { data: requestData, error: requestError }, } = contexts_1.useRequestReadContext();
    const [showWelcome, setShowWelcomePanel] = react_1.useState(() => storage.get('version_welcome_shown') !== '@@SENSE_REVISION');
    const [showingHistory, setShowHistory] = react_1.useState(false);
    const [showSettings, setShowSettings] = react_1.useState(false);
    const [showHelp, setShowHelp] = react_1.useState(false);
    const renderConsoleHistory = () => {
        return editorsReady ? react_1.default.createElement(console_history_1.ConsoleHistory, { close: () => setShowHistory(false) }) : null;
    };
    const { done, error, retry } = hooks_1.useDataInit();
    if (error) {
        return (react_1.default.createElement(eui_1.EuiPageContent, null,
            react_1.default.createElement(components_1.SomethingWentWrongCallout, { onButtonClick: retry, error: error })));
    }
    const lastDatum = requestData?.[requestData.length - 1] ?? requestError;
    return (react_1.default.createElement("div", { id: "consoleRoot" },
        react_1.default.createElement(eui_1.EuiFlexGroup, { className: "consoleContainer", gutterSize: "none", direction: "column", responsive: false },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiTitle, { className: "euiScreenReaderOnly" },
                    react_1.default.createElement("h1", null, i18n_1.i18n.translate('console.pageHeading', {
                        defaultMessage: 'Console',
                    }))),
                react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none" },
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(components_1.TopNavMenu, { disabled: !done, items: get_top_nav_1.getTopNavConfig({
                                onClickHistory: () => setShowHistory(!showingHistory),
                                onClickSettings: () => setShowSettings(true),
                                onClickHelp: () => setShowHelp(!showHelp),
                            }) })),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "conApp__tabsExtension" },
                        react_1.default.createElement(components_1.NetworkRequestStatusBar, { requestInProgress: requestInProgress, requestResult: lastDatum
                                ? {
                                    method: lastDatum.request.method.toUpperCase(),
                                    endpoint: lastDatum.request.path,
                                    statusCode: lastDatum.response.statusCode,
                                    statusText: lastDatum.response.statusText,
                                    timeElapsedMs: lastDatum.response.timeMs,
                                }
                                : undefined })))),
            showingHistory ? react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, renderConsoleHistory()) : null,
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(editor_1.Editor, { loading: !done }))),
        done && showWelcome ? (react_1.default.createElement(components_1.WelcomePanel, { onDismiss: () => {
                storage.set('version_welcome_shown', '@@SENSE_REVISION');
                setShowWelcomePanel(false);
            } })) : null,
        showSettings ? react_1.default.createElement(settings_1.Settings, { onClose: () => setShowSettings(false) }) : null,
        showHelp ? react_1.default.createElement(components_1.HelpPanel, { onClose: () => setShowHelp(false) }) : null));
}
exports.Main = Main;
