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
function GridPanel({ stateParams, setValue, hasHistogramAgg }) {
    const setGrid = react_1.useCallback((paramName, value) => setValue('grid', { ...stateParams.grid, [paramName]: value }), [stateParams.grid, setValue]);
    const options = react_1.useMemo(() => [
        ...stateParams.valueAxes.map(({ id, name }) => ({
            text: name,
            value: id,
        })),
        {
            text: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.gridAxis.dontShowLabel', {
                defaultMessage: "Don't show",
            }),
            value: '',
        },
    ], [stateParams.valueAxes]);
    react_1.useEffect(() => {
        if (hasHistogramAgg) {
            setGrid('categoryLines', false);
        }
    }, [hasHistogramAgg, setGrid]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.pointSeries.gridAxis.gridText", defaultMessage: "Grid" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(public_1.SwitchOption, { disabled: hasHistogramAgg, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.gridAxis.xAxisLinesLabel', {
                defaultMessage: 'Show X-axis lines',
            }), paramName: "categoryLines", tooltip: hasHistogramAgg
                ? i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.gridAxis.yAxisLinesDisabledTooltip', {
                    defaultMessage: "X-axis lines can't show for histograms.",
                })
                : undefined, value: stateParams.grid.categoryLines, setValue: setGrid, "data-test-subj": "showCategoryLines" }),
        react_1.default.createElement(public_1.SelectOption, { id: "gridAxis", label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.gridAxis.yAxisLinesLabel', {
                defaultMessage: 'Y-axis lines',
            }), options: options, paramName: "valueAxis", value: stateParams.grid.valueAxis || '', setValue: setGrid })));
}
exports.GridPanel = GridPanel;
