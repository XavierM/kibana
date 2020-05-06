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
const value_axes_panel_1 = require("./value_axes_panel");
const collections_1 = require("../../../utils/collections");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const mocks_1 = require("./mocks");
describe('ValueAxesPanel component', () => {
    let setParamByIndex;
    let onValueAxisPositionChanged;
    let setMultipleValidity;
    let addValueAxis;
    let removeValueAxis;
    let defaultProps;
    let axisLeft;
    let axisRight;
    let seriesParamCount;
    let seriesParamAverage;
    beforeEach(() => {
        setParamByIndex = jest.fn();
        onValueAxisPositionChanged = jest.fn();
        addValueAxis = jest.fn();
        removeValueAxis = jest.fn();
        setMultipleValidity = jest.fn();
        axisLeft = { ...mocks_1.valueAxis };
        axisRight = {
            ...mocks_1.valueAxis,
            id: 'ValueAxis-2',
            position: collections_1.Positions.RIGHT,
        };
        seriesParamCount = { ...mocks_1.seriesParam };
        seriesParamAverage = {
            ...mocks_1.seriesParam,
            valueAxis: 'ValueAxis-2',
            data: {
                label: 'Average',
                id: '1',
            },
        };
        defaultProps = {
            seriesParams: [seriesParamCount, seriesParamAverage],
            valueAxes: [axisLeft, axisRight],
            vis: mocks_1.vis,
            isCategoryAxisHorizontal: false,
            setParamByIndex,
            onValueAxisPositionChanged,
            addValueAxis,
            removeValueAxis,
            setMultipleValidity,
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should not allow to remove the last value axis', () => {
        defaultProps.valueAxes = [axisLeft];
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
        expect(comp.find('[data-test-subj="removeValueAxisBtn"] button').exists()).toBeFalsy();
    });
    it('should display remove button when multiple axes', () => {
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
        expect(comp.find('[data-test-subj="removeValueAxisBtn"] button').exists()).toBeTruthy();
    });
    it('should call removeAgg', () => {
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
        comp
            .find('[data-test-subj="removeValueAxisBtn"] button')
            .first()
            .simulate('click');
        expect(removeValueAxis).toBeCalledWith(axisLeft);
    });
    it('should call addValueAxis', () => {
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
        comp.find('[data-test-subj="visualizeAddYAxisButton"] button').simulate('click');
        expect(addValueAxis).toBeCalled();
    });
    describe('description', () => {
        it('should show when one serie matches value axis', () => {
            const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
            expect(comp
                .find('.visEditorSidebar__aggGroupAccordionButtonContent span')
                .first()
                .text()).toBe(seriesParamCount.data.label);
        });
        it('should show when multiple series match value axis', () => {
            defaultProps.seriesParams[1].valueAxis = 'ValueAxis-1';
            const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
            expect(comp
                .find('.visEditorSidebar__aggGroupAccordionButtonContent span')
                .first()
                .text()).toBe(`${seriesParamCount.data.label}, ${seriesParamAverage.data.label}`);
        });
        it('should not show when no series match value axis', () => {
            defaultProps.seriesParams[0].valueAxis = 'ValueAxis-2';
            const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, Object.assign({}, defaultProps)));
            expect(comp
                .find('.visEditorSidebar__aggGroupAccordionButtonContent span')
                .first()
                .text()).toBe('');
        });
    });
});
