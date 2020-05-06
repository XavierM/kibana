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
const percentiles_1 = require("./percentiles");
describe('PercentilesEditor component', () => {
    let setValue;
    let setValidity;
    let setTouched;
    let defaultProps;
    beforeEach(() => {
        setValue = jest.fn();
        setValidity = jest.fn();
        setTouched = jest.fn();
        defaultProps = {
            agg: {},
            aggParam: {},
            formIsTouched: false,
            value: [1, 5, 25, 50, 75, 95, 99],
            editorConfig: {},
            showValidation: false,
            setValue,
            setValidity,
            setTouched,
            state: {},
            metricAggs: [],
            schemas: [],
        };
    });
    it('should set valid state to true after adding a unique percentile', () => {
        defaultProps.value = [1, 5, 25, 50, 70];
        enzyme_1.mount(react_1.default.createElement(percentiles_1.PercentilesEditor, Object.assign({}, defaultProps)));
        expect(setValidity).lastCalledWith(true);
    });
    it('should set valid state to false after adding a duplicate percentile', () => {
        defaultProps.value = [1, 5, 25, 50, 50];
        enzyme_1.mount(react_1.default.createElement(percentiles_1.PercentilesEditor, Object.assign({}, defaultProps)));
        expect(setValidity).lastCalledWith(false);
    });
});
