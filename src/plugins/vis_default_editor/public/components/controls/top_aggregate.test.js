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
const top_aggregate_1 = require("./top_aggregate");
const test_utils_1 = require("./test_utils");
describe('TopAggregateParamEditor', () => {
    let agg;
    let aggParam;
    let defaultProps;
    let options;
    beforeEach(() => {
        options = [
            {
                text: 'Min',
                isCompatible: jest.fn((aggr) => aggr.params.field.type === 'number'),
                value: 'min',
            },
            {
                text: 'Max',
                isCompatible: jest.fn((aggr) => aggr.params.field.type === 'number'),
                value: 'max',
            },
            {
                text: 'Average',
                isCompatible: jest.fn((aggr) => aggr.params.field.type === 'string'),
                value: 'average',
            },
        ];
        Object.defineProperty(options, 'byValue', {
            get: () => options.reduce((acc, option) => {
                acc[option.value] = { ...option };
                return acc;
            }, {}),
        });
        aggParam = {
            options,
        };
        agg = {
            params: {
                field: {
                    type: 'number',
                },
            },
            getAggParams: jest.fn(() => [{ name: 'aggregate', options }]),
        };
        defaultProps = {
            ...test_utils_1.aggParamCommonPropsMock,
            agg,
            aggParam,
            setValue: jest.fn(),
            setValidity: jest.fn(),
            setTouched: jest.fn(),
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(top_aggregate_1.TopAggregateParamEditor, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should be disabled if a field type is set but there are no compatible options', () => {
        options = [];
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(top_aggregate_1.TopAggregateParamEditor, Object.assign({}, defaultProps, { showValidation: true })));
        const select = comp.find('select');
        expect(defaultProps.setValidity).toHaveBeenCalledWith(true);
        expect(comp.children().props()).toHaveProperty('isInvalid', false);
        expect(select.children()).toHaveLength(1);
        expect(select.props()).toHaveProperty('disabled', true);
    });
    it('should change its validity due to passed props', () => {
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(top_aggregate_1.TopAggregateParamEditor, Object.assign({}, defaultProps, { value: { value: 'min' } })));
        expect(defaultProps.setValidity).toHaveBeenCalledWith(true);
        comp.setProps({ showValidation: true, value: undefined });
        expect(comp.children().props()).toHaveProperty('isInvalid', true);
        expect(defaultProps.setValidity).toHaveBeenCalledWith(false);
        comp.setProps({ value: { value: 'max' } });
        const select = comp.find('select');
        expect(comp.children().props()).toHaveProperty('isInvalid', false);
        expect(defaultProps.setValidity).toHaveBeenCalledWith(true);
        expect(defaultProps.setValidity).toHaveBeenCalledTimes(3);
        expect(select.children()).toHaveLength(3);
        expect(select.prop('value')).toEqual('max');
    });
    it('should call setValue on change', () => {
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(top_aggregate_1.TopAggregateParamEditor, Object.assign({}, defaultProps, { value: { value: 'min' } })));
        const select = comp.find('select');
        expect(defaultProps.setValue).not.toHaveBeenCalled();
        select.simulate('change', { target: { value: 'EMPTY_VALUE' } });
        expect(defaultProps.setValue).toHaveBeenCalledWith();
        select.simulate('change', { target: { value: 'max' } });
        expect(defaultProps.setValue).toHaveBeenCalledWith(options[1]);
    });
    it('should reflect on fieldType changes', () => {
        const comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(top_aggregate_1.TopAggregateParamEditor, Object.assign({}, defaultProps, { value: { value: 'min' } })));
        // should not be called on the first render
        expect(defaultProps.setValue).not.toHaveBeenCalled();
        agg = {
            ...agg,
            params: {
                field: {
                    type: 'string',
                },
            },
        };
        comp.setProps({ agg });
        // should not reflect if field type was changed but options are still available
        expect(defaultProps.setValue).not.toHaveBeenCalledWith();
        options.shift();
        agg = {
            ...agg,
            params: {
                field: {
                    type: 'date',
                },
            },
        };
        comp.setProps({ agg });
        // should clear the value if the option is unavailable
        expect(defaultProps.setValue).toHaveBeenCalledWith();
        agg = {
            ...agg,
            params: {
                field: {
                    type: 'string',
                },
            },
        };
        comp.setProps({ agg, value: undefined });
        // should set an option by default if it is only available
        expect(defaultProps.setValue).toHaveBeenCalledWith(options[1]);
    });
});
