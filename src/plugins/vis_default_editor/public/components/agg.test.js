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
const test_utils_1 = require("react-dom/test-utils");
const public_1 = require("src/plugins/data/public");
const agg_1 = require("./agg");
const agg_params_1 = require("./agg_params");
const agg_group_state_1 = require("./agg_group_state");
jest.mock('./agg_params', () => ({
    DefaultEditorAggParams: () => null,
}));
describe('DefaultEditorAgg component', () => {
    let defaultProps;
    let setAggParamValue;
    let setStateParamValue;
    let onToggleEnableAgg;
    let removeAgg;
    let setAggsState;
    beforeEach(() => {
        setAggParamValue = jest.fn();
        setStateParamValue = jest.fn();
        onToggleEnableAgg = jest.fn();
        removeAgg = jest.fn();
        setAggsState = jest.fn();
        defaultProps = {
            agg: {
                id: '1',
                brandNew: true,
                getIndexPattern: () => ({}),
                schema: 'metric',
                title: 'Metrics',
                params: {},
            },
            aggIndex: 0,
            aggIsTooLow: false,
            dragHandleProps: null,
            formIsTouched: false,
            groupName: public_1.AggGroupNames.Metrics,
            isDisabled: false,
            isDraggable: false,
            isLastBucket: false,
            isRemovable: false,
            metricAggs: [],
            state: { params: {} },
            setAggParamValue,
            setStateParamValue,
            onAggTypeChange: () => { },
            setAggsState,
            onToggleEnableAgg,
            removeAgg,
            schemas: [
                {
                    name: 'metric',
                },
            ],
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should open accordion initially', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
        expect(comp.props()).toHaveProperty('initialIsOpen', true);
    });
    it('should not show description when agg is invalid', () => {
        defaultProps.agg.brandNew = false;
        const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
        test_utils_1.act(() => {
            comp
                .find(agg_params_1.DefaultEditorAggParams)
                .props()
                .setValidity(false);
        });
        comp.update();
        expect(setAggsState).toBeCalledWith({
            type: agg_group_state_1.AGGS_ACTION_KEYS.VALID,
            payload: false,
            aggId: defaultProps.agg.id,
        });
        expect(comp.find('.visEditorSidebar__aggGroupAccordionButtonContent span').exists()).toBeFalsy();
    });
    it('should show description when agg is valid', () => {
        defaultProps.agg.brandNew = false;
        defaultProps.agg.type = {
            makeLabel: () => 'Agg description',
        };
        const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
        test_utils_1.act(() => {
            comp
                .find(agg_params_1.DefaultEditorAggParams)
                .props()
                .setValidity(true);
        });
        comp.update();
        expect(setAggsState).toBeCalledWith({
            type: agg_group_state_1.AGGS_ACTION_KEYS.VALID,
            payload: true,
            aggId: defaultProps.agg.id,
        });
        expect(comp.find('.visEditorSidebar__aggGroupAccordionButtonContent span').text()).toBe('Agg description');
    });
    it('should call setTouched when accordion is collapsed', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
        expect(defaultProps.setAggsState).toBeCalledTimes(0);
        comp.find('.euiAccordion__button').simulate('click');
        // make sure that the accordion is collapsed
        expect(comp.find('.euiAccordion-isOpen').exists()).toBeFalsy();
        expect(defaultProps.setAggsState).toBeCalledWith({
            type: agg_group_state_1.AGGS_ACTION_KEYS.TOUCHED,
            payload: true,
            aggId: defaultProps.agg.id,
        });
    });
    it('should call setAggsState inside setValidity', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
        test_utils_1.act(() => {
            comp
                .find(agg_params_1.DefaultEditorAggParams)
                .props()
                .setValidity(false);
        });
        expect(setAggsState).toBeCalledWith({
            type: agg_group_state_1.AGGS_ACTION_KEYS.VALID,
            payload: false,
            aggId: defaultProps.agg.id,
        });
        expect(comp.find('.visEditorSidebar__aggGroupAccordionButtonContent span').exists()).toBeFalsy();
    });
    it('should add schema component', () => {
        defaultProps.agg.schema = 'split';
        const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
        expect(comp.find('RowsOrColumnsControl').exists()).toBeTruthy();
    });
    describe('agg actions', () => {
        beforeEach(() => {
            defaultProps.agg.enabled = true;
        });
        it('should not have actions', () => {
            const comp = enzyme_1.shallow(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            const actions = enzyme_1.shallow(comp.prop('extraAction'));
            expect(actions.children().exists()).toBeFalsy();
        });
        it('should have disable and remove actions', () => {
            defaultProps.isRemovable = true;
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            expect(comp.find('[data-test-subj="toggleDisableAggregationBtn disable"] button').exists()).toBeTruthy();
            expect(comp.find('[data-test-subj="removeDimensionBtn"] button').exists()).toBeTruthy();
        });
        it('should have draggable action', () => {
            defaultProps.isDraggable = true;
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            expect(comp.find('[data-test-subj="dragHandleBtn"]').exists()).toBeTruthy();
        });
        it('should disable agg', () => {
            defaultProps.isRemovable = true;
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            comp.find('[data-test-subj="toggleDisableAggregationBtn disable"] button').simulate('click');
            expect(defaultProps.onToggleEnableAgg).toBeCalledWith(defaultProps.agg.id, false);
        });
        it('should disable the disableAggregation button', () => {
            defaultProps.isDisabled = true;
            defaultProps.isRemovable = true;
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            expect(comp
                .find('EuiButtonIcon[data-test-subj="toggleDisableAggregationBtn disable"]')
                .prop('disabled')).toBeTruthy();
        });
        it('should enable agg', () => {
            defaultProps.agg.enabled = false;
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            comp.find('[data-test-subj="toggleDisableAggregationBtn enable"] button').simulate('click');
            expect(defaultProps.onToggleEnableAgg).toBeCalledWith(defaultProps.agg.id, true);
        });
        it('should call removeAgg', () => {
            defaultProps.isRemovable = true;
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            comp.find('[data-test-subj="removeDimensionBtn"] button').simulate('click');
            expect(defaultProps.removeAgg).toBeCalledWith(defaultProps.agg.id);
        });
    });
    describe('last bucket', () => {
        beforeEach(() => {
            defaultProps.isLastBucket = true;
            defaultProps.lastParentPipelineAggTitle = 'ParentPipelineAgg';
        });
        it('should disable min_doc_count when agg is histogram or date_histogram', () => {
            defaultProps.agg.type = {
                name: 'histogram',
            };
            const compHistogram = enzyme_1.shallow(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            defaultProps.agg.type = {
                name: 'date_histogram',
            };
            const compDateHistogram = enzyme_1.shallow(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            expect(compHistogram.find(agg_params_1.DefaultEditorAggParams).props()).toHaveProperty('disabledParams', [
                'min_doc_count',
            ]);
            expect(compDateHistogram.find(agg_params_1.DefaultEditorAggParams).props()).toHaveProperty('disabledParams', ['min_doc_count']);
        });
        it('should set error when agg is not histogram or date_histogram', () => {
            defaultProps.agg.type = {
                name: 'aggType',
            };
            const comp = enzyme_1.shallow(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            expect(comp.find(agg_params_1.DefaultEditorAggParams).prop('aggError')).toBeDefined();
        });
        it('should set min_doc_count to true when agg type was changed to histogram', () => {
            defaultProps.agg.type = {
                name: 'aggType',
            };
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            comp.setProps({ agg: { ...defaultProps.agg, type: { name: 'histogram' } } });
            expect(defaultProps.setAggParamValue).toHaveBeenCalledWith(defaultProps.agg.id, 'min_doc_count', true);
        });
        it('should set min_doc_count to 0 when agg type was changed to date_histogram', () => {
            defaultProps.agg.type = {
                name: 'aggType',
            };
            const comp = enzyme_1.mount(react_1.default.createElement(agg_1.DefaultEditorAgg, Object.assign({}, defaultProps)));
            comp.setProps({ agg: { ...defaultProps.agg, type: { name: 'date_histogram' } } });
            expect(defaultProps.setAggParamValue).toHaveBeenCalledWith(defaultProps.agg.id, 'min_doc_count', 0);
        });
    });
});
