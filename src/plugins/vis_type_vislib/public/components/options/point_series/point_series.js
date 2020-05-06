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
const public_1 = require("../../../../../charts/public");
const grid_panel_1 = require("./grid_panel");
const threshold_panel_1 = require("./threshold_panel");
function PointSeriesOptions(props) {
    const { stateParams, setValue, vis } = props;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.editors.pointSeries.settingsTitle", defaultMessage: "Settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(public_1.BasicOptions, Object.assign({}, props)),
            vis.data.aggs.aggs.some(agg => agg.schema === 'segment' && agg.type.name === 'date_histogram') ? (react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.currentTimeMarkerLabel', {
                    defaultMessage: 'Current time marker',
                }), paramName: "addTimeMarker", value: stateParams.addTimeMarker, setValue: setValue })) : (react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.orderBucketsBySumLabel', {
                    defaultMessage: 'Order buckets by sum',
                }), paramName: "orderBucketsBySum", value: stateParams.orderBucketsBySum, setValue: setValue })),
            vis.type.type === 'histogram' && (react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.editors.pointSeries.showLabels', {
                    defaultMessage: 'Show values on chart',
                }), paramName: "show", value: stateParams.labels.show, setValue: (paramName, value) => setValue('labels', { ...stateParams.labels, [paramName]: value }) }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(grid_panel_1.GridPanel, Object.assign({}, props)),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        stateParams.thresholdLine && react_1.default.createElement(threshold_panel_1.ThresholdPanel, Object.assign({}, props))));
}
exports.PointSeriesOptions = PointSeriesOptions;
