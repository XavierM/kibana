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
const ranges_panel_1 = require("./ranges_panel");
const style_panel_1 = require("./style_panel");
const labels_panel_1 = require("./labels_panel");
function GaugeOptions(props) {
    const { stateParams, setValue } = props;
    const setGaugeValue = react_1.useCallback((paramName, value) => setValue('gauge', {
        ...stateParams.gauge,
        [paramName]: value,
    }), [setValue, stateParams.gauge]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(style_panel_1.StylePanel, Object.assign({}, props, { setGaugeValue: setGaugeValue })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(ranges_panel_1.RangesPanel, Object.assign({}, props, { setGaugeValue: setGaugeValue })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(labels_panel_1.LabelsPanel, Object.assign({}, props, { setGaugeValue: setGaugeValue }))));
}
exports.GaugeOptions = GaugeOptions;
