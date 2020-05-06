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
const enzyme_1 = require("enzyme");
const metric_vis_value_1 = require("./metric_vis_value");
const baseMetric = { label: 'Foo', value: 'foo' };
describe('MetricVisValue', () => {
    it('should be wrapped in EuiKeyboardAccessible if having a click listener', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(metric_vis_value_1.MetricVisValue, { fontSize: 12, metric: baseMetric, onFilter: () => { } }));
        expect(component.find('EuiKeyboardAccessible').exists()).toBe(true);
    });
    it('should not be wrapped in EuiKeyboardAccessible without having a click listener', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(metric_vis_value_1.MetricVisValue, { fontSize: 12, metric: baseMetric }));
        expect(component.find('EuiKeyboardAccessible').exists()).toBe(false);
    });
    it('should add -isfilterable class if onFilter is provided', () => {
        const onFilter = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(metric_vis_value_1.MetricVisValue, { fontSize: 12, metric: baseMetric, onFilter: onFilter }));
        component.simulate('click');
        expect(component.find('.mtrVis__container-isfilterable')).toHaveLength(1);
    });
    it('should not add -isfilterable class if onFilter is not provided', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(metric_vis_value_1.MetricVisValue, { fontSize: 12, metric: baseMetric }));
        component.simulate('click');
        expect(component.find('.mtrVis__container-isfilterable')).toHaveLength(0);
    });
    it('should call onFilter callback if provided', () => {
        const onFilter = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(metric_vis_value_1.MetricVisValue, { fontSize: 12, metric: baseMetric, onFilter: onFilter }));
        component.find('.mtrVis__container-isfilterable').simulate('click');
        expect(onFilter).toHaveBeenCalledWith(baseMetric);
    });
});
