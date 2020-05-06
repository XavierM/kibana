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
const value_axis_options_1 = require("./value_axis_options");
const public_1 = require("../../../../../charts/public");
const label_options_1 = require("./label_options");
const collections_1 = require("../../../utils/collections");
const mocks_1 = require("./mocks");
const POSITION = 'position';
describe('ValueAxisOptions component', () => {
    let setParamByIndex;
    let onValueAxisPositionChanged;
    let setMultipleValidity;
    let defaultProps;
    let axis;
    beforeEach(() => {
        setParamByIndex = jest.fn();
        setMultipleValidity = jest.fn();
        onValueAxisPositionChanged = jest.fn();
        axis = { ...mocks_1.valueAxis };
        defaultProps = {
            axis,
            index: 0,
            valueAxis: mocks_1.valueAxis,
            vis: mocks_1.vis,
            isCategoryAxisHorizontal: false,
            setParamByIndex,
            onValueAxisPositionChanged,
            setMultipleValidity,
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axis_options_1.ValueAxisOptions, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should hide options when axis.show is false', () => {
        defaultProps.axis.show = false;
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axis_options_1.ValueAxisOptions, Object.assign({}, defaultProps)));
        expect(comp.find(public_1.TextInputOption).exists()).toBeFalsy();
        expect(comp.find(label_options_1.LabelOptions).exists()).toBeFalsy();
    });
    it('should only allow left and right value axis position when category axis is horizontal', () => {
        defaultProps.isCategoryAxisHorizontal = true;
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axis_options_1.ValueAxisOptions, Object.assign({}, defaultProps)));
        const options = comp.find({ paramName: POSITION }).prop('options');
        expect(options.length).toBe(4);
        options.forEach(({ value, disabled }) => {
            switch (value) {
                case collections_1.Positions.LEFT:
                case collections_1.Positions.RIGHT:
                    expect(disabled).toBeFalsy();
                    break;
                case collections_1.Positions.TOP:
                case collections_1.Positions.BOTTOM:
                    expect(disabled).toBeTruthy();
                    break;
            }
        });
    });
    it('should only allow top and bottom value axis position when category axis is vertical', () => {
        defaultProps.isCategoryAxisHorizontal = false;
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axis_options_1.ValueAxisOptions, Object.assign({}, defaultProps)));
        const options = comp.find({ paramName: POSITION }).prop('options');
        expect(options.length).toBe(4);
        options.forEach(({ value, disabled }) => {
            switch (value) {
                case collections_1.Positions.LEFT:
                case collections_1.Positions.RIGHT:
                    expect(disabled).toBeTruthy();
                    break;
                case collections_1.Positions.TOP:
                case collections_1.Positions.BOTTOM:
                    expect(disabled).toBeFalsy();
                    break;
            }
        });
    });
    it('should call onValueAxisPositionChanged when position is changed', () => {
        const value = collections_1.Positions.RIGHT;
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axis_options_1.ValueAxisOptions, Object.assign({}, defaultProps)));
        comp.find({ paramName: POSITION }).prop('setValue')(POSITION, value);
        expect(onValueAxisPositionChanged).toBeCalledWith(defaultProps.index, value);
    });
    it('should call setValueAxis when title is changed', () => {
        defaultProps.axis.show = true;
        const textValue = 'New title';
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axis_options_1.ValueAxisOptions, Object.assign({}, defaultProps)));
        comp.find(public_1.TextInputOption).prop('setValue')('text', textValue);
        expect(setParamByIndex).toBeCalledWith('valueAxes', defaultProps.index, 'title', {
            text: textValue,
        });
    });
    it('should call setValueAxis when scale value is changed', () => {
        const scaleValue = collections_1.ScaleTypes.SQUARE_ROOT;
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axis_options_1.ValueAxisOptions, Object.assign({}, defaultProps)));
        comp.find({ paramName: 'type' }).prop('setValue')('type', scaleValue);
        expect(setParamByIndex).toBeCalledWith('valueAxes', defaultProps.index, 'scale', {
            ...defaultProps.axis.scale,
            type: scaleValue,
        });
    });
});
