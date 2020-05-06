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
const label_options_1 = require("./label_options");
function CategoryAxisPanel({ axis, onPositionChanged, vis, setCategoryAxis, }) {
    const setAxis = react_1.useCallback((paramName, value) => {
        const updatedAxis = {
            ...axis,
            [paramName]: value,
        };
        setCategoryAxis(updatedAxis);
    }, [setCategoryAxis, axis]);
    const setPosition = react_1.useCallback((paramName, value) => {
        setAxis(paramName, value);
        onPositionChanged(value);
    }, [setAxis, onPositionChanged]);
    const setAxisLabel = react_1.useCallback((paramName, value) => {
        const labels = {
            ...axis.labels,
            [paramName]: value,
        };
        setAxis('labels', labels);
    }, [axis.labels, setAxis]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.pointSeries.categoryAxis.xAxisTitle", defaultMessage: "X-axis" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.categoryAxis.positionLabel', {
                defaultMessage: 'Position',
            }), options: vis.type.editorConfig.collections.positions, paramName: "position", value: axis.position, setValue: setPosition, "data-test-subj": "categoryAxisPosition" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.categoryAxis.showLabel', {
                defaultMessage: 'Show axis lines and labels',
            }), paramName: "show", value: axis.show, setValue: setAxis }),
        axis.show && (react_1.default.createElement(label_options_1.LabelOptions, { axisLabels: axis.labels, axisFilterCheckboxName: `xAxisFilterLabelsCheckbox${axis.id}`, setAxisLabel: setAxisLabel }))));
}
exports.CategoryAxisPanel = CategoryAxisPanel;
