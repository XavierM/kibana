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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../../charts/public");
const public_2 = require("../../../../../data/public");
function StylePanel({ aggs, setGaugeValue, stateParams, vis }) {
    const diasableAlignment = aggs.byType(public_2.AggGroupNames.Metrics).length === 1 && !aggs.byType(public_2.AggGroupNames.Buckets);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.gaugeOptions.styleTitle", defaultMessage: "Style" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.gaugeTypeLabel', {
                defaultMessage: 'Gauge type',
            }), options: vis.type.editorConfig.collections.gaugeTypes, paramName: "gaugeType", value: stateParams.gauge.gaugeType, setValue: setGaugeValue }),
        react_1.default.createElement(public_1.SelectOption, { disabled: diasableAlignment, label: i18n_1.i18n.translate('visTypeVislib.controls.gaugeOptions.alignmentLabel', {
                defaultMessage: 'Alignment',
            }), options: vis.type.editorConfig.collections.alignments, paramName: "alignment", value: stateParams.gauge.alignment, setValue: setGaugeValue })));
}
exports.StylePanel = StylePanel;
