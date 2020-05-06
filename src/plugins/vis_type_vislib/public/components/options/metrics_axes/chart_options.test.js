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
const chart_options_1 = require("./chart_options");
const line_options_1 = require("./line_options");
const collections_1 = require("../../../utils/collections");
const mocks_1 = require("./mocks");
describe('ChartOptions component', () => {
    let setParamByIndex;
    let changeValueAxis;
    let defaultProps;
    let chart;
    beforeEach(() => {
        setParamByIndex = jest.fn();
        changeValueAxis = jest.fn();
        chart = { ...mocks_1.seriesParam };
        defaultProps = {
            index: 0,
            chart,
            vis: mocks_1.vis,
            valueAxes: [mocks_1.valueAxis],
            setParamByIndex,
            changeValueAxis,
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(chart_options_1.ChartOptions, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should show LineOptions when type is line', () => {
        chart.type = collections_1.ChartTypes.LINE;
        const comp = enzyme_1.shallow(react_1.default.createElement(chart_options_1.ChartOptions, Object.assign({}, defaultProps)));
        expect(comp.find(line_options_1.LineOptions).exists()).toBeTruthy();
    });
    it('should show line mode when type is area', () => {
        chart.type = collections_1.ChartTypes.AREA;
        const comp = enzyme_1.shallow(react_1.default.createElement(chart_options_1.ChartOptions, Object.assign({}, defaultProps)));
        expect(comp.find({ paramName: 'interpolate' }).exists()).toBeTruthy();
    });
    it('should call changeValueAxis when valueAxis is changed', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(chart_options_1.ChartOptions, Object.assign({}, defaultProps)));
        const paramName = 'valueAxis';
        const value = 'new';
        comp.find({ paramName }).prop('setValue')(paramName, value);
        expect(changeValueAxis).toBeCalledWith(0, paramName, value);
    });
    it('should call setParamByIndex when mode is changed', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(chart_options_1.ChartOptions, Object.assign({}, defaultProps)));
        const paramName = 'mode';
        comp.find({ paramName }).prop('setValue')(paramName, collections_1.ChartModes.NORMAL);
        expect(setParamByIndex).toBeCalledWith('seriesParams', 0, paramName, collections_1.ChartModes.NORMAL);
    });
});
