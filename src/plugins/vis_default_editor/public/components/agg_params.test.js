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
const public_1 = require("src/plugins/data/public");
const agg_params_1 = require("./agg_params");
const public_2 = require("../../../kibana_react/public");
const mocks_1 = require("../../../data/public/mocks");
const mockEditorConfig = {
    useNormalizedEsInterval: { hidden: false, fixedValue: false },
    interval: {
        hidden: false,
        help: 'Must be a multiple of rollup configuration interval: 1m',
        default: '1m',
        timeBase: '1m',
    },
};
const DefaultEditorAggParams = (props) => (react_1.default.createElement(public_2.KibanaContextProvider, { services: { data: mocks_1.dataPluginMock.createStartContract() } },
    react_1.default.createElement(agg_params_1.DefaultEditorAggParams, Object.assign({}, props))));
jest.mock('./utils', () => ({
    getEditorConfig: jest.fn(() => mockEditorConfig),
}));
jest.mock('./agg_params_helper', () => ({
    getAggParamsToRender: jest.fn(() => ({
        basic: [
            {
                aggParam: {
                    displayName: 'Custom label',
                    name: 'customLabel',
                    type: 'string',
                },
            },
        ],
        advanced: [
            {
                aggParam: {
                    advanced: true,
                    name: 'json',
                    type: 'json',
                },
            },
        ],
    })),
    getAggTypeOptions: jest.fn(() => []),
    getError: jest.fn((agg, aggIsTooLow) => (aggIsTooLow ? ['error'] : [])),
    isInvalidParamsTouched: jest.fn(() => false),
}));
jest.mock('./agg_select', () => ({
    DefaultEditorAggSelect: () => null,
}));
jest.mock('./agg_param', () => ({
    DefaultEditorAggParam: () => null,
}));
describe('DefaultEditorAggParams component', () => {
    let setAggParamValue;
    let onAggTypeChange;
    let setTouched;
    let setValidity;
    let intervalDeserialize;
    let defaultProps;
    beforeEach(() => {
        setAggParamValue = jest.fn();
        onAggTypeChange = jest.fn();
        setTouched = jest.fn();
        setValidity = jest.fn();
        intervalDeserialize = jest.fn(() => 'deserialized');
        defaultProps = {
            agg: {
                type: {
                    params: [{ name: 'interval', deserialize: intervalDeserialize }],
                },
                params: {},
                schema: {
                    title: '',
                },
            },
            groupName: public_1.AggGroupNames.Metrics,
            formIsTouched: false,
            indexPattern: {},
            metricAggs: [],
            state: {},
            setAggParamValue,
            onAggTypeChange,
            setTouched,
            setValidity,
            schemas: [],
        };
    });
    it('should reset the validity to true when destroyed', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(DefaultEditorAggParams, Object.assign({}, defaultProps, { aggIsTooLow: true })));
        expect(setValidity).lastCalledWith(false);
        comp.unmount();
        expect(setValidity).lastCalledWith(true);
    });
    it('should set fixed and default values when editorConfig is defined (works in rollup index)', () => {
        enzyme_1.mount(react_1.default.createElement(DefaultEditorAggParams, Object.assign({}, defaultProps)));
        expect(setAggParamValue).toHaveBeenNthCalledWith(1, defaultProps.agg.id, 'useNormalizedEsInterval', false);
        expect(intervalDeserialize).toHaveBeenCalledWith('1m');
        expect(setAggParamValue).toHaveBeenNthCalledWith(2, defaultProps.agg.id, 'interval', 'deserialized');
    });
    it('should call setTouched with false when agg type is changed', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(DefaultEditorAggParams, Object.assign({}, defaultProps)));
        comp.setProps({ agg: { type: { params: [] } } });
        expect(setTouched).lastCalledWith(false);
    });
    it('should set the validity when it changed', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(DefaultEditorAggParams, Object.assign({}, defaultProps)));
        comp.setProps({ aggIsTooLow: true });
        expect(setValidity).lastCalledWith(false);
        comp.setProps({ aggIsTooLow: false });
        expect(setValidity).lastCalledWith(true);
    });
    it('should call setTouched when all invalid controls were touched or they are untouched', () => {
        const comp = enzyme_1.mount(react_1.default.createElement(DefaultEditorAggParams, Object.assign({}, defaultProps)));
        comp.setProps({ aggIsTooLow: true });
        expect(setTouched).lastCalledWith(true);
        comp.setProps({ aggIsTooLow: false });
        expect(setTouched).lastCalledWith(false);
    });
});
