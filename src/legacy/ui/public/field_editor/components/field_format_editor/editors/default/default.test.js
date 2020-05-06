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
const default_1 = require("./default");
const fieldType = 'number';
const format = {
    getConverterFor: jest.fn().mockImplementation(() => () => { }),
};
const formatParams = {};
const onChange = jest.fn();
const onError = jest.fn();
describe('DefaultFormatEditor', () => {
    describe('convertSampleInput', () => {
        const converter = (input) => {
            if (typeof input !== 'number') {
                throw new Error('Input is not a number');
            }
            else {
                return (input * 2).toString();
            }
        };
        it('should convert a set of inputs', () => {
            const inputs = [1, 10, 15];
            const output = default_1.convertSampleInput(converter, inputs);
            expect(output.error).toBeUndefined();
            expect(JSON.stringify(output.samples)).toEqual(JSON.stringify([
                { input: 1, output: '2' },
                { input: 10, output: '20' },
                { input: 15, output: '30' },
            ]));
        });
        it('should return error if converter throws one', () => {
            const inputs = [1, 10, 15, 'invalid'];
            const output = default_1.convertSampleInput(converter, inputs);
            expect(output.error).toEqual('An error occurred while trying to use this format configuration: Input is not a number');
            expect(JSON.stringify(output.samples)).toEqual(JSON.stringify([]));
        });
    });
    it('should render nothing', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(default_1.DefaultFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(format.getConverterFor).toBeCalled();
        expect(onError).toBeCalled();
        expect(component).toMatchSnapshot();
    });
    it('should call prop onChange()', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(default_1.DefaultFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        component.instance().onChange();
        expect(onChange).toBeCalled();
    });
    it('should call prop onError() if converter throws an error', async () => {
        const newFormat = {
            getConverterFor: jest.fn().mockImplementation(() => () => {
                throw new Error('Test error message');
            }),
        };
        enzyme_1.shallow(react_1.default.createElement(default_1.DefaultFormatEditor, { basePath: '', fieldType: fieldType, format: newFormat, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(onError).toBeCalled();
    });
});
