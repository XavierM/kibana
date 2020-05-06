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
const category_axis_panel_1 = require("./category_axis_panel");
const collections_1 = require("../../../utils/collections");
const label_options_1 = require("./label_options");
const mocks_1 = require("./mocks");
describe('CategoryAxisPanel component', () => {
    let setCategoryAxis;
    let onPositionChanged;
    let defaultProps;
    let axis;
    beforeEach(() => {
        setCategoryAxis = jest.fn();
        onPositionChanged = jest.fn();
        axis = mocks_1.categoryAxis;
        defaultProps = {
            axis,
            vis: mocks_1.vis,
            onPositionChanged,
            setCategoryAxis,
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(category_axis_panel_1.CategoryAxisPanel, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should respond axis.show', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(category_axis_panel_1.CategoryAxisPanel, Object.assign({}, defaultProps)));
        expect(comp.find(label_options_1.LabelOptions).exists()).toBeTruthy();
        comp.setProps({ axis: { ...axis, show: false } });
        expect(comp.find(label_options_1.LabelOptions).exists()).toBeFalsy();
    });
    it('should call onPositionChanged when position is changed', () => {
        const value = collections_1.Positions.RIGHT;
        const comp = enzyme_1.shallow(react_1.default.createElement(category_axis_panel_1.CategoryAxisPanel, Object.assign({}, defaultProps)));
        comp.find({ paramName: 'position' }).prop('setValue')('position', value);
        expect(setCategoryAxis).toHaveBeenLastCalledWith({ ...axis, position: value });
        expect(onPositionChanged).toBeCalledWith(value);
    });
});
