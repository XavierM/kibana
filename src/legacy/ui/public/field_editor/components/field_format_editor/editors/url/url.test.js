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
const url_1 = require("./url");
const fieldType = 'string';
const format = {
    getConverterFor: jest
        .fn()
        .mockImplementation(() => (input) => `converted url for ${input}`),
    type: {
        urlTypes: [
            { kind: 'a', text: 'Link' },
            { kind: 'img', text: 'Image' },
            { kind: 'audio', text: 'Audio' },
        ],
    },
};
const formatParams = {
    openLinkInCurrentTab: true,
    urlTemplate: '',
    labelTemplate: '',
    width: '',
    height: '',
};
const onChange = jest.fn();
const onError = jest.fn();
jest.mock('ui/chrome', () => ({
    getBasePath: () => 'http://localhost/',
}));
describe('UrlFormatEditor', () => {
    it('should have a formatId', () => {
        expect(url_1.UrlFormatEditor.formatId).toEqual('url');
    });
    it('should render normally', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(url_1.UrlFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
    it('should render url template help', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(url_1.UrlFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        component.instance().showUrlTemplateHelp();
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should render label template help', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(url_1.UrlFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: formatParams, onChange: onChange, onError: onError }));
        component.instance().showLabelTemplateHelp();
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should render width and height fields if image', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(url_1.UrlFormatEditor, { basePath: '', fieldType: fieldType, format: format, formatParams: { ...formatParams, type: 'img' }, onChange: onChange, onError: onError }));
        expect(component).toMatchSnapshot();
    });
});
