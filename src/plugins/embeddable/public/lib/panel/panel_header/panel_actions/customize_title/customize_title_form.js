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
const i18n_1 = require("@kbn/i18n");
function CustomizeTitleForm({ title, onReset, onUpdatePanelTitle, }) {
    function onInputChange(event) {
        onUpdatePanelTitle(event.target.value);
    }
    return (react_1.default.createElement("div", { className: "embPanel__optionsMenuForm", "data-test-subj": "dashboardPanelTitleInputMenuItem" },
        react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('embeddableApi.customizeTitle.optionsMenuForm.panelTitleFormRowLabel', {
                defaultMessage: 'Panel title',
            }) },
            react_1.default.createElement(eui_1.EuiFieldText, { id: "panelTitleInput", "data-test-subj": "customEmbeddablePanelTitleInput", name: "min", type: "text", value: title, onChange: onInputChange, "aria-label": i18n_1.i18n.translate('embeddableApi.customizeTitle.optionsMenuForm.panelTitleInputAriaLabel', {
                    defaultMessage: 'Changes to this input are applied immediately. Press enter to exit.',
                }) })),
        react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "resetCustomEmbeddablePanelTitle", onClick: onReset },
            react_1.default.createElement(react_2.FormattedMessage, { id: "embeddableApi.customizeTitle.optionsMenuForm.resetCustomDashboardButtonLabel", defaultMessage: "Reset title" }))));
}
exports.CustomizeTitleForm = CustomizeTitleForm;
