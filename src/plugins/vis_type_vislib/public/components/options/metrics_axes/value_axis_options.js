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
const label_options_1 = require("./label_options");
const custom_extents_options_1 = require("./custom_extents_options");
const utils_1 = require("./utils");
function ValueAxisOptions({ axis, index, isCategoryAxisHorizontal, valueAxis, vis, onValueAxisPositionChanged, setParamByIndex, setMultipleValidity, }) {
    const setValueAxis = react_1.useCallback((paramName, value) => setParamByIndex('valueAxes', index, paramName, value), [setParamByIndex, index]);
    const setValueAxisTitle = react_1.useCallback((paramName, value) => {
        const title = {
            ...valueAxis.title,
            [paramName]: value,
        };
        setParamByIndex('valueAxes', index, 'title', title);
    }, [valueAxis.title, setParamByIndex, index]);
    const setValueAxisScale = react_1.useCallback((paramName, value) => {
        const scale = {
            ...valueAxis.scale,
            [paramName]: value,
        };
        setParamByIndex('valueAxes', index, 'scale', scale);
    }, [valueAxis.scale, setParamByIndex, index]);
    const setAxisLabel = react_1.useCallback((paramName, value) => {
        const labels = {
            ...valueAxis.labels,
            [paramName]: value,
        };
        setParamByIndex('valueAxes', index, 'labels', labels);
    }, [valueAxis.labels, setParamByIndex, index]);
    const onPositionChanged = react_1.useCallback((paramName, value) => {
        onValueAxisPositionChanged(index, value);
    }, [index, onValueAxisPositionChanged]);
    const isPositionDisabled = react_1.useCallback((position) => {
        if (isCategoryAxisHorizontal) {
            return utils_1.isAxisHorizontal(position);
        }
        return [collections_1.Positions.LEFT, collections_1.Positions.RIGHT].includes(position);
    }, [isCategoryAxisHorizontal]);
    const positions = react_1.useMemo(() => vis.type.editorConfig.collections.positions.map((position) => ({
        ...position,
        disabled: isPositionDisabled(position.value),
    })), [vis.type.editorConfig.collections.positions, isPositionDisabled]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.positionLabel', {
                defaultMessage: 'Position',
            }), options: positions, paramName: "position", value: axis.position, setValue: onPositionChanged }),
        react_1.default.createElement(public_1.SelectOption, { id: `valueAxisMode${index}`, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.modeLabel', {
                defaultMessage: 'Mode',
            }), options: vis.type.editorConfig.collections.axisModes, paramName: "mode", value: axis.scale.mode, setValue: setValueAxisScale }),
        react_1.default.createElement(public_1.SelectOption, { id: `scaleSelectYAxis-${axis.id}`, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.scaleTypeLabel', {
                defaultMessage: 'Scale type',
            }), options: vis.type.editorConfig.collections.scaleTypes, paramName: "type", value: axis.scale.type, setValue: setValueAxisScale }),
        react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "m" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.showLabel', {
                defaultMessage: 'Show axis lines and labels',
            }), "data-test-subj": `valueAxisShow-${axis.id}`, paramName: "show", value: axis.show, setValue: setValueAxis }),
        axis.show ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(public_1.TextInputOption, { "data-test-subj": `valueAxisTitle${index}`, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.titleLabel', {
                    defaultMessage: 'Title',
                }), paramName: "text", value: axis.title.text, setValue: setValueAxisTitle }),
            react_1.default.createElement(label_options_1.LabelOptions, { axisLabels: axis.labels, axisFilterCheckboxName: `yAxisFilterLabelsCheckbox${axis.id}`, setAxisLabel: setAxisLabel }))) : (react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" })),
        react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "s" }),
        react_1.default.createElement(eui_1.EuiAccordion, { id: `yAxisOptionsAccordion${axis.id}`, className: "visEditorSidebar__section visEditorSidebar__collapsible", initialIsOpen: false, buttonContentClassName: "euiText euiText--small", buttonContent: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.customExtentsLabel', {
                defaultMessage: 'Custom extents',
            }), "aria-label": i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.toggleCustomExtendsAriaLabel', {
                defaultMessage: 'Toggle custom extents',
            }) },
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, { axisScale: axis.scale, setMultipleValidity: setMultipleValidity, setValueAxisScale: setValueAxisScale, setValueAxis: setValueAxis })))));
}
exports.ValueAxisOptions = ValueAxisOptions;
