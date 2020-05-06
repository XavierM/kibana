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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../../charts/public");
function ThresholdPanel({ stateParams, setValue, setMultipleValidity, vis, }) {
    const setThresholdLine = react_1.useCallback((paramName, value) => setValue('thresholdLine', { ...stateParams.thresholdLine, [paramName]: value }), [stateParams.thresholdLine, setValue]);
    const setThresholdLineColor = react_1.useCallback((value) => setThresholdLine('color', value), [setThresholdLine]);
    const setThresholdLineValidity = react_1.useCallback((paramName, isValid) => setMultipleValidity(`thresholdLine__${paramName}`, isValid), [setMultipleValidity]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.editors.pointSeries.thresholdLineSettingsTitle", defaultMessage: "Threshold line" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.thresholdLine.showLabel', {
                defaultMessage: 'Show threshold line',
            }), paramName: "show", value: stateParams.thresholdLine.show, setValue: setThresholdLine }),
        stateParams.thresholdLine.show && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(public_1.RequiredNumberInputOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.thresholdLine.valueLabel', {
                    defaultMessage: 'Threshold value',
                }), paramName: "value", value: stateParams.thresholdLine.value, setValue: setThresholdLine, setValidity: setThresholdLineValidity }),
            react_1.default.createElement(public_1.RequiredNumberInputOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.thresholdLine.widthLabel', {
                    defaultMessage: 'Line width',
                }), paramName: "width", min: 1, step: 1, value: stateParams.thresholdLine.width, setValue: setThresholdLine, setValidity: setThresholdLineValidity }),
            react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.thresholdLine.styleLabel', {
                    defaultMessage: 'Line style',
                }), options: vis.type.editorConfig.collections.thresholdLineStyles, paramName: "style", value: stateParams.thresholdLine.style, setValue: setThresholdLine }),
            react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.thresholdLine.colorLabel', {
                    defaultMessage: 'Line color',
                }), fullWidth: true, compressed: true },
                react_1.default.createElement(eui_1.EuiColorPicker, { compressed: true, color: stateParams.thresholdLine.color, fullWidth: true, onChange: setThresholdLineColor }))))));
}
exports.ThresholdPanel = ThresholdPanel;
