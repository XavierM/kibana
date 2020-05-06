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
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../../charts/public");
function LabelsPanel({ stateParams, setValue, setGaugeValue }) {
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.gaugeOptions.labelsTitle", defaultMessage: "Labels" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.showLabelsLabel', {
                defaultMessage: 'Show labels',
            }), paramName: "show", value: stateParams.gauge.labels.show, setValue: (paramName, value) => setGaugeValue('labels', { ...stateParams.gauge.labels, [paramName]: value }) }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.TextInputOption, { disabled: !stateParams.gauge.labels.show, label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.subTextLabel', {
                defaultMessage: 'Sub label',
            }), paramName: "subText", value: stateParams.gauge.style.subText, setValue: (paramName, value) => setGaugeValue('style', { ...stateParams.gauge.style, [paramName]: value }) }),
        react_1.default.createElement(public_1.SwitchOption, { disabled: !stateParams.gauge.labels.show, label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.displayWarningsLabel', {
                defaultMessage: 'Display warnings',
            }), tooltip: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.switchWarningsTooltip', {
                defaultMessage: 'Turns on/off warnings. When turned on, a warning will be shown if not all labels could be displayed.',
            }), paramName: "isDisplayWarning", value: stateParams.isDisplayWarning, setValue: setValue })));
}
exports.LabelsPanel = LabelsPanel;
