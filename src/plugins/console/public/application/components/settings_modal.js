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
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
function DevToolsSettingsModal(props) {
    const [fontSize, setFontSize] = react_1.useState(props.settings.fontSize);
    const [wrapMode, setWrapMode] = react_1.useState(props.settings.wrapMode);
    const [fields, setFields] = react_1.useState(props.settings.autocomplete.fields);
    const [indices, setIndices] = react_1.useState(props.settings.autocomplete.indices);
    const [templates, setTemplates] = react_1.useState(props.settings.autocomplete.templates);
    const [polling, setPolling] = react_1.useState(props.settings.polling);
    const [tripleQuotes, setTripleQuotes] = react_1.useState(props.settings.tripleQuotes);
    const autoCompleteCheckboxes = [
        {
            id: 'fields',
            label: i18n_1.i18n.translate('console.settingsPage.fieldsLabelText', {
                defaultMessage: 'Fields',
            }),
            stateSetter: setFields,
        },
        {
            id: 'indices',
            label: i18n_1.i18n.translate('console.settingsPage.indicesAndAliasesLabelText', {
                defaultMessage: 'Indices & Aliases',
            }),
            stateSetter: setIndices,
        },
        {
            id: 'templates',
            label: i18n_1.i18n.translate('console.settingsPage.templatesLabelText', {
                defaultMessage: 'Templates',
            }),
            stateSetter: setTemplates,
        },
    ];
    const checkboxIdToSelectedMap = {
        fields,
        indices,
        templates,
    };
    const onAutocompleteChange = (optionId) => {
        const option = _.find(autoCompleteCheckboxes, item => item.id === optionId);
        if (option) {
            option.stateSetter(!checkboxIdToSelectedMap[optionId]);
        }
    };
    function saveSettings() {
        props.onSaveSettings({
            fontSize,
            wrapMode,
            autocomplete: {
                fields,
                indices,
                templates,
            },
            polling,
            tripleQuotes,
        });
    }
    // It only makes sense to show polling options if the user needs to fetch any data.
    const pollingFields = fields || indices || templates ? (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.refreshingDataLabel", defaultMessage: "Refreshing autocomplete suggestions" }), helpText: react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.refreshingDataDescription", defaultMessage: "Console refreshes autocomplete suggestions by querying Elasticsearch.\n              Automatic refreshes may be an issue if you have a large cluster or if you have network limitations." }) },
            react_1.default.createElement(eui_1.EuiSwitch, { checked: polling, "data-test-subj": "autocompletePolling", id: "autocompletePolling", label: react_1.default.createElement(react_2.FormattedMessage, { defaultMessage: "Automatically refresh autocomplete suggestions", id: "console.settingsPage.pollingLabelText" }), onChange: e => setPolling(e.target.checked) })),
        react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "autocompletePolling", id: "autocompletePolling", onClick: () => {
                // Only refresh the currently selected settings.
                props.refreshAutocompleteSettings({
                    fields,
                    indices,
                    templates,
                });
            } },
            react_1.default.createElement(react_2.FormattedMessage, { defaultMessage: "Refresh autocomplete suggestions", id: "console.settingsPage.refreshButtonLabel" })))) : (undefined);
    return (react_1.default.createElement(eui_1.EuiOverlayMask, null,
        react_1.default.createElement(eui_1.EuiModal, { "data-test-subj": "devToolsSettingsModal", className: "conApp__settingsModal", onClose: props.onClose },
            react_1.default.createElement(eui_1.EuiModalHeader, null,
                react_1.default.createElement(eui_1.EuiModalHeaderTitle, null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.pageTitle", defaultMessage: "Console Settings" }))),
            react_1.default.createElement(eui_1.EuiModalBody, null,
                react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.fontSizeLabel", defaultMessage: "Font Size" }) },
                    react_1.default.createElement(eui_1.EuiFieldNumber, { autoFocus: true, "data-test-subj": "setting-font-size-input", value: fontSize, min: 6, max: 50, onChange: e => {
                            const val = parseInt(e.target.value, 10);
                            if (!val)
                                return;
                            setFontSize(val);
                        } })),
                react_1.default.createElement(eui_1.EuiFormRow, null,
                    react_1.default.createElement(eui_1.EuiSwitch, { checked: wrapMode, "data-test-subj": "settingsWrapLines", id: "wrapLines", label: react_1.default.createElement(react_2.FormattedMessage, { defaultMessage: "Wrap long lines", id: "console.settingsPage.wrapLongLinesLabelText" }), onChange: e => setWrapMode(e.target.checked) })),
                react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.jsonSyntaxLabel", defaultMessage: "JSON syntax" }) },
                    react_1.default.createElement(eui_1.EuiSwitch, { checked: tripleQuotes, "data-test-subj": "tripleQuotes", id: "tripleQuotes", label: react_1.default.createElement(react_2.FormattedMessage, { defaultMessage: "Use triple quotes in output pane", id: "console.settingsPage.tripleQuotesMessage" }), onChange: e => setTripleQuotes(e.target.checked) })),
                react_1.default.createElement(eui_1.EuiFormRow, { labelType: "legend", label: react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.autocompleteLabel", defaultMessage: "Autocomplete" }) },
                    react_1.default.createElement(eui_1.EuiCheckboxGroup, { options: autoCompleteCheckboxes.map(opts => {
                            const { stateSetter, ...rest } = opts;
                            return rest;
                        }), idToSelectedMap: checkboxIdToSelectedMap, onChange: (e) => {
                            onAutocompleteChange(e);
                        } })),
                pollingFields),
            react_1.default.createElement(eui_1.EuiModalFooter, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "settingsCancelButton", onClick: props.onClose },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.cancelButtonLabel", defaultMessage: "Cancel" })),
                react_1.default.createElement(eui_1.EuiButton, { fill: true, "data-test-subj": "settings-save-button", onClick: saveSettings },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "console.settingsPage.saveButtonLabel", defaultMessage: "Save" }))))));
}
exports.DevToolsSettingsModal = DevToolsSettingsModal;
