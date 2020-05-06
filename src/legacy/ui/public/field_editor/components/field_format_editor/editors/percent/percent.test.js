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
const percent_1 = require("./percent");
const fieldType = 'number';
const format = {
    getConverterFor: jest.fn().mockImplementation(() => (input) => input * 2),
    getParamDefaults: jest.fn().mockImplementation(() => {
        return { pattern: '0,0.[000]%' };
    }),
};
const formatParams = {
    pattern: '',
};
const onChange = jest.fn();
const onError = jest.fn();
describe('PercentFormatEditor', () => {
    it('should have a formatId', () => {
        expect(percent_1.PercentFormatEditor.formatId).toEqual('percent');
    });
    it('should render normally', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(percent_1.PercentFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
});
