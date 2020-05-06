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
const public_1 = require("../../../charts/public");
function MetricVisOptions({ stateParams, setValue, setValidity, setTouched, vis, uiState, }) {
    const setMetricValue = react_1.useCallback((paramName, value) => setValue('metric', {
        ...stateParams.metric,
        [paramName]: value,
    }), [setValue, stateParams.metric]);
    const setMetricLabels = react_1.useCallback((paramName, value) => setMetricValue('labels', {
        ...stateParams.metric.labels,
        [paramName]: value,
    }), [setMetricValue, stateParams.metric.labels]);
    const setMetricStyle = react_1.useCallback((paramName, value) => setMetricValue('style', {
        ...stateParams.metric.style,
        [paramName]: value,
    }), [setMetricValue, stateParams.metric.style]);
    const setColorMode = react_1.useCallback(id => setMetricValue('metricColorMode', id), [setMetricValue]);
    const metricColorModeLabel = i18n_1.i18n.translate('visTypeMetric.params.color.useForLabel', {
        defaultMessage: 'Use color for',
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeMetric.params.settingsTitle", defaultMessage: "Settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeMetric.params.percentageModeLabel', {
                    defaultMessage: 'Percentage mode',
                }), paramName: "percentageMode", value: stateParams.metric.percentageMode, setValue: setMetricValue }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeMetric.params.showTitleLabel', {
                    defaultMessage: 'Show title',
                }), paramName: "show", value: stateParams.metric.labels.show, setValue: setMetricLabels })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeMetric.params.rangesTitle", defaultMessage: "Ranges" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.ColorRanges, { "data-test-subj": "metricColorRange", colorsRange: stateParams.metric.colorsRange, setValue: setMetricValue, setTouched: setTouched, setValidity: setValidity }),
            react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, display: "rowCompressed", label: metricColorModeLabel },
                react_1.default.createElement(eui_1.EuiButtonGroup, { buttonSize: "compressed", idSelected: stateParams.metric.metricColorMode, isDisabled: stateParams.metric.colorsRange.length === 1, isFullWidth: true, legend: metricColorModeLabel, options: vis.type.editorConfig.collections.metricColorMode, onChange: setColorMode })),
            react_1.default.createElement(public_1.ColorSchemaOptions, { colorSchema: stateParams.metric.colorSchema, colorSchemas: vis.type.editorConfig.collections.colorSchemas, disabled: stateParams.metric.colorsRange.length === 1 ||
                    stateParams.metric.metricColorMode === public_1.ColorModes.NONE, invertColors: stateParams.metric.invertColors, setValue: setMetricValue, showHelpText: false, uiState: uiState })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeMetric.params.style.styleTitle", defaultMessage: "Style" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.RangeOption, { label: i18n_1.i18n.translate('visTypeMetric.params.style.fontSizeLabel', {
                    defaultMessage: 'Metric font size in points',
                }), min: 12, max: 120, paramName: "fontSize", value: stateParams.metric.style.fontSize, setValue: setMetricStyle, showInput: true, showLabels: true, showValue: false }))));
}
exports.MetricVisOptions = MetricVisOptions;
