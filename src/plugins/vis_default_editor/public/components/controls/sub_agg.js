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
const public_1 = require("../../../../data/public");
const utils_1 = require("./utils");
const agg_params_1 = require("../agg_params");
function SubAggParamEditor({ agg, aggParam, formIsTouched, metricAggs, state, setValue, setValidity, setTouched, schemas, }) {
    react_1.useEffect(() => {
        // we aren't creating a custom aggConfig
        if (agg.params.metricAgg !== 'custom') {
            setValue(undefined);
        }
        else if (!agg.params.customMetric) {
            setValue(aggParam.makeAgg(agg));
        }
    }, [metricAggs, agg, setValue, aggParam]);
    const { onAggTypeChange, setAggParamValue } = utils_1.useSubAggParamsHandlers(agg, aggParam, agg.params.customMetric, setValue);
    if (agg.params.metricAgg !== 'custom' || !agg.params.customMetric) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(agg_params_1.DefaultEditorAggParams, { agg: agg.params.customMetric, allowedAggs: aggParam.allowedAggs, groupName: public_1.AggGroupNames.Metrics, className: "visEditorAgg__subAgg", formIsTouched: formIsTouched, indexPattern: agg.getIndexPattern(), metricAggs: metricAggs, state: state, setAggParamValue: setAggParamValue, onAggTypeChange: onAggTypeChange, setValidity: setValidity, setTouched: setTouched, schemas: schemas, hideCustomLabel: true })));
}
exports.SubAggParamEditor = SubAggParamEditor;
