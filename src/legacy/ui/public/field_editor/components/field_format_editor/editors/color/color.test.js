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
const color_1 = require("./color");
const public_1 = require("../../../../../../../../plugins/data/public");
const fieldType = 'string';
const format = {
    getConverterFor: jest.fn(),
};
const formatParams = {
    colors: [{ ...public_1.fieldFormats.DEFAULT_CONVERTER_COLOR }],
};
const onChange = jest.fn();
const onError = jest.fn();
describe('ColorFormatEditor', () => {
    it('should have a formatId', () => {
        expect(color_1.ColorFormatEditor.formatId).toEqual('color');
    });
    it('should render string type normally (regex field)', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(color_1.ColorFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
    it('should render other type normally (range field)', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(color_1.ColorFormatEditor, { basePath: '', fieldType: 'number', format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
    it('should render multiple colors', async () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(color_1.ColorFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: { colors: [...formatParams.colors, ...formatParams.colors] }, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
});
