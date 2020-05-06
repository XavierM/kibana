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
const value_axis_options_1 = require("./value_axis_options");
function ValueAxesPanel(props) {
    const { addValueAxis, removeValueAxis, seriesParams, valueAxes } = props;
    const getSeries = react_1.useCallback((axis) => {
        const isFirst = valueAxes[0].id === axis.id;
        const series = seriesParams.filter(serie => serie.valueAxis === axis.id || (isFirst && !serie.valueAxis));
        return series.map(serie => serie.data.label).join(', ');
    }, [seriesParams, valueAxes]);
    const removeButtonTooltip = react_1.useMemo(() => i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.removeButtonTooltip', {
        defaultMessage: 'Remove Y-axis',
    }), []);
    const renderRemoveButton = react_1.useCallback((axis) => (react_1.default.createElement(eui_1.EuiToolTip, { position: "bottom", content: removeButtonTooltip },
        react_1.default.createElement(eui_1.EuiButtonIcon, { color: "danger", iconType: "cross", onClick: () => removeValueAxis(axis), "aria-label": removeButtonTooltip, "data-test-subj": "removeValueAxisBtn" }))), [removeValueAxis, removeButtonTooltip]);
    const addButtonTooltip = react_1.useMemo(() => i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.addButtonTooltip', {
        defaultMessage: 'Add Y-axis',
    }), []);
    const getButtonContent = react_1.useCallback((axis) => {
        const description = getSeries(axis);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            axis.name,
            ' ',
            react_1.default.createElement(eui_1.EuiToolTip, { content: description },
                react_1.default.createElement(react_1.default.Fragment, null, description))));
    }, [getSeries]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none", justifyContent: "spaceBetween", alignItems: "baseline" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                    react_1.default.createElement("h3", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.pointSeries.valueAxes.yAxisTitle", defaultMessage: "Y-axes" })))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiToolTip, { position: "bottom", content: addButtonTooltip },
                    react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "plusInCircleFilled", onClick: addValueAxis, "aria-label": addButtonTooltip, "data-test-subj": "visualizeAddYAxisButton" })))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        valueAxes.map((axis, index) => (react_1.default.createElement(eui_1.EuiAccordion, { id: `yAxisAccordion${axis.id}`, key: axis.id, "data-test-subj": `toggleYAxisOptions-${axis.id}`, className: "visEditorSidebar__section visEditorSidebar__collapsible", initialIsOpen: false, buttonContent: getButtonContent(axis), buttonClassName: "eui-textTruncate", buttonContentClassName: "visEditorSidebar__aggGroupAccordionButtonContent eui-textTruncate", "aria-label": i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.toggleOptionsAriaLabel', {
                defaultMessage: 'Toggle {axisName} options',
                values: { axisName: axis.name },
            }), extraAction: valueAxes.length === 1 ? undefined : renderRemoveButton(axis) },
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                react_1.default.createElement(value_axis_options_1.ValueAxisOptions, { axis: axis, index: index, valueAxis: valueAxes[index], isCategoryAxisHorizontal: props.isCategoryAxisHorizontal, onValueAxisPositionChanged: props.onValueAxisPositionChanged, setParamByIndex: props.setParamByIndex, setMultipleValidity: props.setMultipleValidity, vis: props.vis })))))));
}
exports.ValueAxesPanel = ValueAxesPanel;
