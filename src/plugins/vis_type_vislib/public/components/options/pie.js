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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const common_1 = require("../common");
const public_1 = require("../../../../charts/public");
function PieOptions(props) {
    const { stateParams, setValue } = props;
    const setLabels = (paramName, value) => setValue('labels', { ...stateParams.labels, [paramName]: value });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.editors.pie.pieSettingsTitle", defaultMessage: "Pie settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pie.donutLabel', {
                    defaultMessage: 'Donut',
                }), paramName: "isDonut", value: stateParams.isDonut, setValue: setValue }),
            react_1.default.createElement(public_1.BasicOptions, Object.assign({}, props))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.editors.pie.labelsSettingsTitle", defaultMessage: "Labels settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pie.showLabelsLabel', {
                    defaultMessage: 'Show labels',
                }), paramName: "show", value: stateParams.labels.show, setValue: setLabels }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pie.showTopLevelOnlyLabel', {
                    defaultMessage: 'Show top level only',
                }), paramName: "last_level", value: stateParams.labels.last_level, setValue: setLabels }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pie.showValuesLabel', {
                    defaultMessage: 'Show values',
                }), paramName: "values", value: stateParams.labels.values, setValue: setLabels }),
            react_1.default.createElement(common_1.TruncateLabelsOption, { value: stateParams.labels.truncate, setValue: setLabels }))));
}
exports.PieOptions = PieOptions;
