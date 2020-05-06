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
const line_options_1 = require("./line_options");
const public_1 = require("../../../../../charts/public");
const mocks_1 = require("./mocks");
const LINE_WIDTH = 'lineWidth';
const DRAW_LINES = 'drawLinesBetweenPoints';
describe('LineOptions component', () => {
    let setChart;
    let defaultProps;
    beforeEach(() => {
        setChart = jest.fn();
        defaultProps = {
            chart: { ...mocks_1.seriesParam },
            vis: mocks_1.vis,
            setChart,
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(line_options_1.LineOptions, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should set lineWidth as undefined when empty value', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(line_options_1.LineOptions, Object.assign({}, defaultProps)));
        comp.find(public_1.NumberInputOption).prop('setValue')(LINE_WIDTH, '');
        expect(setChart).toBeCalledWith(LINE_WIDTH, undefined);
    });
    it('should set lineWidth value', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(line_options_1.LineOptions, Object.assign({}, defaultProps)));
        comp.find(public_1.NumberInputOption).prop('setValue')(LINE_WIDTH, 5);
        expect(setChart).toBeCalledWith(LINE_WIDTH, 5);
    });
    it('should set drawLinesBetweenPoints', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(line_options_1.LineOptions, Object.assign({}, defaultProps)));
        comp.find({ paramName: DRAW_LINES }).prop('setValue')(DRAW_LINES, false);
        expect(setChart).toBeCalledWith(DRAW_LINES, false);
    });
});
