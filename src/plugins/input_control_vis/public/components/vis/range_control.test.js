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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const range_control_1 = require("./range_control");
const control = {
    id: 'mock-range-control',
    isEnabled: () => {
        return true;
    },
    options: {
        decimalPlaces: 0,
        step: 1,
    },
    type: 'range',
    label: 'range control',
    value: { min: 0, max: 0 },
    min: 0,
    max: 100,
    hasValue: () => {
        return false;
    },
};
test('renders RangeControl', () => {
    const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(range_control_1.RangeControl, { control: control, controlIndex: 0, stageFilter: () => { } }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('disabled', () => {
    const disabledRangeControl = {
        id: 'mock-range-control',
        isEnabled: () => {
            return false;
        },
        options: {
            decimalPlaces: 0,
            step: 1,
        },
        type: 'range',
        label: 'range control',
        disabledReason: 'control is disabled to test rendering when disabled',
        hasValue: () => {
            return false;
        },
    };
    const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(range_control_1.RangeControl, { control: disabledRangeControl, controlIndex: 0, stageFilter: () => { } }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('ceilWithPrecision', () => {
    expect(range_control_1.ceilWithPrecision(999.133, 0)).toBe(1000);
    expect(range_control_1.ceilWithPrecision(999.133, 2)).toBe(999.14);
});
test('floorWithPrecision', () => {
    expect(range_control_1.floorWithPrecision(100.777, 0)).toBe(100);
    expect(range_control_1.floorWithPrecision(100.777, 2)).toBe(100.77);
});
