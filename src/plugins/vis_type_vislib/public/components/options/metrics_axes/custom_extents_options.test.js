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
const custom_extents_options_1 = require("./custom_extents_options");
const y_extents_1 = require("./y_extents");
const mocks_1 = require("./mocks");
const BOUNDS_MARGIN = 'boundsMargin';
const DEFAULT_Y_EXTENTS = 'defaultYExtents';
const SCALE = 'scale';
const SET_Y_EXTENTS = 'setYExtents';
describe('CustomExtentsOptions component', () => {
    let setValueAxis;
    let setValueAxisScale;
    let setMultipleValidity;
    let defaultProps;
    beforeEach(() => {
        setValueAxis = jest.fn();
        setValueAxisScale = jest.fn();
        setMultipleValidity = jest.fn();
        defaultProps = {
            axisScale: { ...mocks_1.valueAxis.scale },
            setValueAxis,
            setValueAxisScale,
            setMultipleValidity,
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    describe('boundsMargin', () => {
        it('should set validity as true when value is positive', () => {
            defaultProps.axisScale.boundsMargin = 5;
            enzyme_1.mount(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            expect(setMultipleValidity).toBeCalledWith(BOUNDS_MARGIN, true);
        });
        it('should set validity as true when value is empty', () => {
            const comp = enzyme_1.mount(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            comp.setProps({
                axisScale: { ...mocks_1.valueAxis.scale, boundsMargin: undefined },
            });
            expect(setMultipleValidity).toBeCalledWith(BOUNDS_MARGIN, true);
        });
        it('should set validity as false when value is negative', () => {
            defaultProps.axisScale.defaultYExtents = true;
            const comp = enzyme_1.mount(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            comp.setProps({
                axisScale: { ...mocks_1.valueAxis.scale, boundsMargin: -1 },
            });
            expect(setMultipleValidity).toBeCalledWith(BOUNDS_MARGIN, false);
        });
    });
    describe('defaultYExtents', () => {
        it('should show bounds margin input when defaultYExtents is true', () => {
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            expect(comp.find({ paramName: BOUNDS_MARGIN }).exists()).toBeTruthy();
        });
        it('should hide bounds margin input when defaultYExtents is false', () => {
            defaultProps.axisScale = { ...defaultProps.axisScale, defaultYExtents: false };
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            expect(comp.find({ paramName: BOUNDS_MARGIN }).exists()).toBeFalsy();
        });
        it('should call setValueAxis when value is true', () => {
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            comp.find({ paramName: DEFAULT_Y_EXTENTS }).prop('setValue')(DEFAULT_Y_EXTENTS, true);
            expect(setMultipleValidity).not.toBeCalled();
            expect(setValueAxis).toBeCalledWith(SCALE, defaultProps.axisScale);
        });
        it('should reset boundsMargin when value is false', () => {
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            comp.find({ paramName: DEFAULT_Y_EXTENTS }).prop('setValue')(DEFAULT_Y_EXTENTS, false);
            const newScale = {
                ...defaultProps.axisScale,
                boundsMargin: undefined,
                defaultYExtents: false,
            };
            expect(setValueAxis).toBeCalledWith(SCALE, newScale);
        });
    });
    describe('setYExtents', () => {
        it('should show YExtents when value is true', () => {
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            expect(comp.find(y_extents_1.YExtents).exists()).toBeTruthy();
        });
        it('should hide YExtents when value is false', () => {
            defaultProps.axisScale = { ...defaultProps.axisScale, setYExtents: false };
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            expect(comp.find(y_extents_1.YExtents).exists()).toBeFalsy();
        });
        it('should call setValueAxis when value is true', () => {
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            comp.find({ paramName: SET_Y_EXTENTS }).prop('setValue')(SET_Y_EXTENTS, true);
            expect(setValueAxis).toBeCalledWith(SCALE, defaultProps.axisScale);
        });
        it('should reset min and max when value is false', () => {
            const comp = enzyme_1.shallow(react_1.default.createElement(custom_extents_options_1.CustomExtentsOptions, Object.assign({}, defaultProps)));
            comp.find({ paramName: SET_Y_EXTENTS }).prop('setValue')(SET_Y_EXTENTS, false);
            const newScale = {
                ...defaultProps.axisScale,
                min: undefined,
                max: undefined,
                setYExtents: false,
            };
            expect(setValueAxis).toBeCalledWith(SCALE, newScale);
        });
    });
});
