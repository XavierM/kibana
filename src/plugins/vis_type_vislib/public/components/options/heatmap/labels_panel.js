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
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../../charts/public");
const VERTICAL_ROTATION = 270;
function LabelsPanel({ valueAxis, setValue }) {
    const rotateLabels = valueAxis.labels.rotate === VERTICAL_ROTATION;
    const setValueAxisLabels = react_1.useCallback((paramName, value) => setValue('valueAxes', [
        {
            ...valueAxis,
            labels: {
                ...valueAxis.labels,
                [paramName]: value,
            },
        },
    ]), [valueAxis, setValue]);
    const setRotateLabels = react_1.useCallback((paramName, value) => setValueAxisLabels(paramName, value ? VERTICAL_ROTATION : 0), [setValueAxisLabels]);
    const setColor = react_1.useCallback(value => setValueAxisLabels('color', value), [setValueAxisLabels]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.heatmapOptions.labelsTitle", defaultMessage: "Labels" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.showLabelsTitle', {
                defaultMessage: 'Show labels',
            }), paramName: "show", value: valueAxis.labels.show, setValue: setValueAxisLabels }),
        react_1.default.createElement(public_1.SwitchOption, { disabled: !valueAxis.labels.show, label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.rotateLabel', {
                defaultMessage: 'Rotate',
            }), paramName: "rotate", value: rotateLabels, setValue: setRotateLabels }),
        react_1.default.createElement(public_1.SwitchOption, { disabled: !valueAxis.labels.show, label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.overwriteAutomaticColorLabel', {
                defaultMessage: 'Overwrite automatic color',
            }), paramName: "overwriteColor", value: valueAxis.labels.overwriteColor, setValue: setValueAxisLabels }),
        react_1.default.createElement(eui_1.EuiFormRow, { display: "rowCompressed", fullWidth: true, label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.colorLabel', {
                defaultMessage: 'Color',
            }) },
            react_1.default.createElement(eui_1.EuiColorPicker, { compressed: true, fullWidth: true, disabled: !valueAxis.labels.show || !valueAxis.labels.overwriteColor, color: valueAxis.labels.color, onChange: setColor }))));
}
exports.LabelsPanel = LabelsPanel;
