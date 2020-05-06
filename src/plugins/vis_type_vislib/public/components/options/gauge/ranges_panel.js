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
function RangesPanel({ setGaugeValue, setTouched, setValidity, setValue, stateParams, uiState, vis, }) {
    const setColorSchemaOptions = react_1.useCallback((paramName, value) => {
        setGaugeValue(paramName, value);
        // set outline if color schema is changed to greys
        // if outline wasn't set explicitly yet
        if (paramName === 'colorSchema' &&
            value === public_1.ColorSchemas.Greys &&
            typeof stateParams.gauge.outline === 'undefined') {
            setGaugeValue('outline', true);
        }
    }, [setGaugeValue, stateParams]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.gaugeOptions.rangesTitle", defaultMessage: "Ranges" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.ColorRanges, { "data-test-subj": "gaugeColorRange", colorsRange: stateParams.gauge.colorsRange, setValue: setGaugeValue, setTouched: setTouched, setValidity: setValidity }),
        react_1.default.createElement(public_1.SwitchOption, { disabled: stateParams.gauge.colorsRange.length < 2, label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.autoExtendRangeLabel', {
                defaultMessage: 'Auto extend range',
            }), tooltip: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.extendRangeTooltip', {
                defaultMessage: 'Extends range to the maximum value in your data.',
            }), paramName: "extendRange", value: stateParams.gauge.extendRange, setValue: setGaugeValue }),
        react_1.default.createElement(public_1.SwitchOption, { "data-test-subj": "gaugePercentageMode", label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.percentageModeLabel', {
                defaultMessage: 'Percentage mode',
            }), paramName: "percentageMode", value: stateParams.gauge.percentageMode, setValue: setGaugeValue }),
        react_1.default.createElement(public_1.ColorSchemaOptions, { disabled: stateParams.gauge.colorsRange.length < 2, colorSchema: stateParams.gauge.colorSchema, colorSchemas: vis.type.editorConfig.collections.colorSchemas, invertColors: stateParams.gauge.invertColors, uiState: uiState, setValue: setColorSchemaOptions }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.showOutline', {
                defaultMessage: 'Show outline',
            }), paramName: "outline", value: stateParams.gauge.outline, setValue: setGaugeValue }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.showLegendLabel', {
                defaultMessage: 'Show legend',
            }), paramName: "addLegend", value: stateParams.addLegend, setValue: setValue }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.showScaleLabel', {
                defaultMessage: 'Show scale',
            }), paramName: "show", value: stateParams.gauge.scale.show, setValue: (paramName, value) => setGaugeValue('scale', { ...stateParams.gauge.scale, [paramName]: value }) })));
}
exports.RangesPanel = RangesPanel;
