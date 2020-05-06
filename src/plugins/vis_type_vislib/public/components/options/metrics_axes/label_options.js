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
const common_1 = require("../../common");
const collections_1 = require("../../../utils/collections");
const public_1 = require("../../../../../charts/public");
function LabelOptions({ axisLabels, axisFilterCheckboxName, setAxisLabel }) {
    const setAxisLabelRotate = react_1.useCallback((paramName, value) => {
        setAxisLabel(paramName, Number(value));
    }, [setAxisLabel]);
    const rotateOptions = react_1.useMemo(collections_1.getRotateOptions, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(eui_1.EuiTitle, { size: "xxs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.pointSeries.categoryAxis.labelsTitle", defaultMessage: "Labels" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.categoryAxis.showLabelsLabel', {
                defaultMessage: 'Show labels',
            }), paramName: "show", value: axisLabels.show, setValue: setAxisLabel }),
        react_1.default.createElement(public_1.SwitchOption, { "data-test-subj": axisFilterCheckboxName, disabled: !axisLabels.show, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.categoryAxis.filterLabelsLabel', {
                defaultMessage: 'Filter labels',
            }), paramName: "filter", value: axisLabels.filter, setValue: setAxisLabel }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(public_1.SelectOption, { disabled: !axisLabels.show, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.categoryAxis.alignLabel', {
                        defaultMessage: 'Align',
                    }), options: rotateOptions, paramName: "rotate", value: axisLabels.rotate, setValue: setAxisLabelRotate })),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(common_1.TruncateLabelsOption, { disabled: !axisLabels.show, value: axisLabels.truncate, setValue: setAxisLabel })))));
}
exports.LabelOptions = LabelOptions;
