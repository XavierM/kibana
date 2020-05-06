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
const collections_1 = require("../../../utils/collections");
const public_1 = require("../../../../../charts/public");
const line_options_1 = require("./line_options");
function ChartOptions({ chart, index, valueAxes, vis, changeValueAxis, setParamByIndex, }) {
    const setChart = react_1.useCallback((paramName, value) => {
        setParamByIndex('seriesParams', index, paramName, value);
    }, [setParamByIndex, index]);
    const setValueAxis = react_1.useCallback((paramName, value) => {
        changeValueAxis(index, paramName, value);
    }, [changeValueAxis, index]);
    const valueAxesOptions = react_1.useMemo(() => [
        ...valueAxes.map(({ id, name }) => ({
            text: name,
            value: id,
        })),
        {
            text: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.newAxisLabel', {
                defaultMessage: 'New axis…',
            }),
            value: 'new',
        },
    ], [valueAxes]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(public_1.SelectOption, { id: `seriesValueAxis${index}`, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.valueAxisLabel', {
                defaultMessage: 'Value axis',
            }), options: valueAxesOptions, paramName: "valueAxis", value: chart.valueAxis, setValue: setValueAxis }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(public_1.SelectOption, { id: `seriesType${index}`, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.chartTypeLabel', {
                        defaultMessage: 'Chart type',
                    }), options: vis.type.editorConfig.collections.chartTypes, paramName: "type", value: chart.type, setValue: setChart })),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(public_1.SelectOption, { id: `seriesMode${index}`, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.modeLabel', {
                        defaultMessage: 'Mode',
                    }), options: vis.type.editorConfig.collections.chartModes, paramName: "mode", value: chart.mode, setValue: setChart }))),
        chart.type === collections_1.ChartTypes.AREA && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.lineModeLabel', {
                    defaultMessage: 'Line mode',
                }), options: vis.type.editorConfig.collections.interpolationModes, paramName: "interpolate", value: chart.interpolate, setValue: setChart }))),
        chart.type === collections_1.ChartTypes.LINE && (react_1.default.createElement(line_options_1.LineOptions, { chart: chart, vis: vis, setChart: setChart }))));
}
exports.ChartOptions = ChartOptions;
