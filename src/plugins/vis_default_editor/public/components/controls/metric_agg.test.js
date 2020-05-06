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
const enzyme_1 = require("enzyme");
const metric_agg_1 = require("./metric_agg");
jest.mock('./utils', () => ({
    useAvailableOptions: jest.fn((aggFilterArray, filteredMetrics, defaultOptions) => [
        ...filteredMetrics.map(({ id, type }) => ({
            text: type.name,
            value: id,
        })),
        ...defaultOptions,
    ]),
    useFallbackMetric: jest.fn(),
    useValidation: jest.fn(),
}));
const utils_1 = require("./utils");
const agg = {
    id: '1',
    type: { name: 'cumulative_sum' },
    makeLabel() {
        return 'cumulative_sum';
    },
};
const metricAggs = [
    agg,
    {
        id: '2',
        type: { name: 'count' },
        makeLabel() {
            return 'count';
        },
    },
    {
        id: '3',
        type: { name: 'avg' },
        makeLabel() {
            return 'avg';
        },
    },
    {
        id: '4',
        type: { name: 'max' },
        makeLabel() {
            return 'max';
        },
    },
];
describe('MetricAggParamEditor', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            agg,
            showValidation: false,
            setValue: jest.fn(),
            setValidity: jest.fn(),
        };
    });
    test('should be rendered with default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(metric_agg_1.MetricAggParamEditor, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    test('should call custom hooks', () => {
        enzyme_1.shallow(react_1.default.createElement(metric_agg_1.MetricAggParamEditor, Object.assign({}, defaultProps, { value: "custom" })));
        expect(utils_1.useFallbackMetric).toHaveBeenCalledWith(defaultProps.setValue, metric_agg_1.aggFilter, [], 'custom');
        expect(utils_1.useValidation).toHaveBeenCalledWith(defaultProps.setValidity, true);
        expect(utils_1.useAvailableOptions).toHaveBeenCalledWith(metric_agg_1.aggFilter, [], metric_agg_1.DEFAULT_OPTIONS);
    });
    test('should filter self aggregation from available options', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(metric_agg_1.MetricAggParamEditor, Object.assign({}, defaultProps, { value: "custom", metricAggs: [agg] })));
        expect(comp.find('EuiSelect').props()).toHaveProperty('options', [...metric_agg_1.DEFAULT_OPTIONS]);
        expect(utils_1.useFallbackMetric).toHaveBeenCalledWith(defaultProps.setValue, metric_agg_1.aggFilter, [agg], 'custom');
    });
    test('should be valid/invalid if value is defined/undefined', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(metric_agg_1.MetricAggParamEditor, Object.assign({}, defaultProps, { value: "custom" })));
        expect(comp.children().props()).toHaveProperty('isInvalid', false);
        expect(utils_1.useValidation).lastCalledWith(defaultProps.setValidity, true);
        comp.setProps({ value: undefined, showValidation: true });
        expect(comp.children().props()).toHaveProperty('isInvalid', true);
        expect(utils_1.useValidation).lastCalledWith(defaultProps.setValidity, false);
    });
    test('should set new value into the model on change', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(metric_agg_1.MetricAggParamEditor, Object.assign({}, defaultProps, { value: "custom", metricAggs: metricAggs })));
        comp.find('select').simulate('change', { target: { value: '2' } });
        expect(defaultProps.setValue).lastCalledWith('2');
    });
});
