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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const react_1 = tslib_1.__importStar(require("react"));
const public_1 = require("../../../../kibana_react/public");
const form_row_1 = require("./form_row");
function roundWithPrecision(value, decimalPlaces, roundFunction) {
    if (decimalPlaces <= 0) {
        return roundFunction(value);
    }
    let results = value;
    results = results * Math.pow(10, decimalPlaces);
    results = roundFunction(results);
    results = results / Math.pow(10, decimalPlaces);
    return results;
}
function ceilWithPrecision(value, decimalPlaces) {
    return roundWithPrecision(value, decimalPlaces, Math.ceil);
}
exports.ceilWithPrecision = ceilWithPrecision;
function floorWithPrecision(value, decimalPlaces) {
    return roundWithPrecision(value, decimalPlaces, Math.floor);
}
exports.floorWithPrecision = floorWithPrecision;
class RangeControl extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {};
        this.onChangeComplete = lodash_1.default.debounce((value) => {
            const controlValue = {
                min: value[0],
                max: value[1],
            };
            this.props.stageFilter(this.props.controlIndex, controlValue);
        }, 200);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const nextValue = nextProps.control.hasValue()
            ? [nextProps.control.value.min, nextProps.control.value.max]
            : ['', ''];
        if (nextProps.control.hasValue() && nextProps.control.value.min == null) {
            nextValue[0] = '';
        }
        if (nextProps.control.hasValue() && nextProps.control.value.max == null) {
            nextValue[1] = '';
        }
        if (nextValue !== prevState.prevValue) {
            return {
                value: nextValue,
                prevValue: nextValue,
            };
        }
        return null;
    }
    renderControl() {
        if (!this.props.control.isEnabled()) {
            return react_1.default.createElement(public_1.ValidatedDualRange, { disabled: true, showInput: true });
        }
        const decimalPlaces = lodash_1.default.get(this.props, 'control.options.decimalPlaces', 0);
        const min = floorWithPrecision(this.props.control.min, decimalPlaces);
        const max = ceilWithPrecision(this.props.control.max, decimalPlaces);
        const ticks = [
            { value: min, label: min },
            { value: max, label: max },
        ];
        return (react_1.default.createElement(public_1.ValidatedDualRange, { id: this.props.control.id, min: min, max: max, value: this.state.value, onChange: this.onChangeComplete, showInput: true, showRange: true, showTicks: true, ticks: ticks }));
    }
    render() {
        return (react_1.default.createElement(form_row_1.FormRow, { id: this.props.control.id, label: this.props.control.label, controlIndex: this.props.controlIndex, disableMsg: this.props.control.isEnabled() ? undefined : this.props.control.disabledReason }, this.renderControl()));
    }
}
exports.RangeControl = RangeControl;
