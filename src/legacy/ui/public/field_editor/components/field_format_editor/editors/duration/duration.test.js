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
const duration_1 = require("./duration");
const fieldType = 'number';
const format = {
    getConverterFor: jest
        .fn()
        .mockImplementation(() => (input) => `converted duration for ${input}`),
    getParamDefaults: jest.fn().mockImplementation(() => {
        return {
            inputFormat: 'seconds',
            outputFormat: 'humanize',
            outputPrecision: 10,
        };
    }),
    isHuman: () => true,
    type: {
        inputFormats: [
            {
                text: 'Seconds',
                kind: 'seconds',
            },
        ],
        outputFormats: [
            {
                text: 'Human Readable',
                method: 'humanize',
            },
            {
                text: 'Minutes',
                method: 'asMinutes',
            },
        ],
    },
};
const formatParams = {
    outputPrecision: 2,
    inputFormat: '',
    outputFormat: '',
};
const onChange = jest.fn();
const onError = jest.fn();
describe('DurationFormatEditor', () => {
    it('should have a formatId', () => {
        expect(duration_1.DurationFormatEditor.formatId).toEqual('duration');
    });
    it('should render human readable output normally', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(duration_1.DurationFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
    it('should render non-human readable output normally', async () => {
        const newFormat = {
            ...format,
            getParamDefaults: jest.fn().mockImplementation(() => {
                return {
                    inputFormat: 'seconds',
                    outputFormat: 'asMinutes',
                    outputPrecision: 10,
                };
            }),
            isHuman: () => false,
        };
        const component = enzyme_1.shallow(react_1.default.createElement(duration_1.DurationFormatEditor, { basePath: '', fieldType: fieldType, format: newFormat, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
});
