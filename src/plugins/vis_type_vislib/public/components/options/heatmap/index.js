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
const labels_panel_1 = require("./labels_panel");
function HeatmapOptions(props) {
    const { stateParams, vis, uiState, setValue, setValidity, setTouched } = props;
    const [valueAxis] = stateParams.valueAxes;
    const isColorsNumberInvalid = stateParams.colorsNumber < 2 || stateParams.colorsNumber > 10;
    const [isColorRangesValid, setIsColorRangesValid] = react_1.useState(false);
    const setValueAxisScale = react_1.useCallback((paramName, value) => setValue('valueAxes', [
        {
            ...valueAxis,
            scale: {
                ...valueAxis.scale,
                [paramName]: value,
            },
        },
    ]), [valueAxis, setValue]);
    react_1.useEffect(() => {
        setValidity(stateParams.setColorRange ? isColorRangesValid : !isColorsNumberInvalid);
    }, [stateParams.setColorRange, isColorRangesValid, isColorsNumberInvalid, setValidity]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.editors.heatmap.basicSettingsTitle", defaultMessage: "Basic settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.BasicOptions, Object.assign({}, props)),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.heatmap.highlightLabel', {
                    defaultMessage: 'Highlight range',
                }), paramName: "enableHover", value: stateParams.enableHover, setValue: setValue, tooltip: i18n_1.i18n.translate('visTypeVislib.editors.heatmap.highlightLabelTooltip', {
                    defaultMessage: 'Highlight hovered range in the chart and corresponding label in the legend.',
                }) })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.editors.heatmap.heatmapSettingsTitle", defaultMessage: "Heatmap settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.ColorSchemaOptions, { colorSchema: stateParams.colorSchema, colorSchemas: vis.type.editorConfig.collections.colorSchemas, invertColors: stateParams.invertColors, uiState: uiState, setValue: setValue }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.colorScaleLabel', {
                    defaultMessage: 'Color scale',
                }), options: vis.type.editorConfig.collections.scales, paramName: "type", value: valueAxis.scale.type, setValue: setValueAxisScale }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.scaleToDataBoundsLabel', {
                    defaultMessage: 'Scale to data bounds',
                }), paramName: "defaultYExtents", value: valueAxis.scale.defaultYExtents, setValue: setValueAxisScale }),
            react_1.default.createElement(public_1.SwitchOption, { disabled: stateParams.setColorRange, label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.percentageModeLabel', {
                    defaultMessage: 'Percentage mode',
                }), paramName: "percentageMode", value: stateParams.setColorRange ? false : stateParams.percentageMode, setValue: setValue }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.NumberInputOption, { "data-test-subj": "heatmapColorsNumber", disabled: stateParams.setColorRange, isInvalid: isColorsNumberInvalid, label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.colorsNumberLabel', {
                    defaultMessage: 'Number of colors',
                }), max: 10, min: 2, paramName: "colorsNumber", value: stateParams.colorsNumber, setValue: setValue }),
            react_1.default.createElement(public_1.SwitchOption, { "data-test-subj": "heatmapUseCustomRanges", label: i18n_1.i18n.translate('visTypeVislib.controls.heatmapOptions.useCustomRangesLabel', {
                    defaultMessage: 'Use custom ranges',
                }), paramName: "setColorRange", value: stateParams.setColorRange, setValue: setValue }),
            stateParams.setColorRange && (react_1.default.createElement(public_1.ColorRanges, { "data-test-subj": "heatmapColorRange", colorsRange: stateParams.colorsRange, setValue: setValue, setTouched: setTouched, setValidity: setIsColorRangesValid }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(labels_panel_1.LabelsPanel, { valueAxis: valueAxis, setValue: setValue })));
}
exports.HeatmapOptions = HeatmapOptions;
