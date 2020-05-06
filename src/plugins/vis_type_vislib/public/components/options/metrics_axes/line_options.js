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
const public_1 = require("../../../../../charts/public");
function LineOptions({ chart, vis, setChart }) {
    const setLineWidth = react_1.useCallback((paramName, value) => {
        setChart(paramName, value === '' ? undefined : value);
    }, [setChart]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.showLineLabel', {
                defaultMessage: 'Show line',
            }), paramName: "drawLinesBetweenPoints", value: chart.drawLinesBetweenPoints, setValue: setChart }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(public_1.SelectOption, { disabled: !chart.drawLinesBetweenPoints, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.lineModeLabel', {
                        defaultMessage: 'Line mode',
                    }), options: vis.type.editorConfig.collections.interpolationModes, paramName: "interpolate", value: chart.interpolate, setValue: setChart })),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(public_1.NumberInputOption, { disabled: !chart.drawLinesBetweenPoints, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.lineWidthLabel', {
                        defaultMessage: 'Line width',
                    }), paramName: "lineWidth", step: 0.5, min: 0, value: chart.lineWidth, setValue: setLineWidth }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.series.showDotsLabel', {
                defaultMessage: 'Show dots',
            }), paramName: "showCircles", value: chart.showCircles, setValue: setChart })));
}
exports.LineOptions = LineOptions;
