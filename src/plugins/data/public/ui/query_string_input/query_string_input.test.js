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
const query_string_input_test_mocks_1 = require("./query_string_input.test.mocks");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const language_switcher_1 = require("./language_switcher");
const query_string_input_1 = require("./query_string_input");
const mocks_1 = require("../../../../../core/public/mocks");
const mocks_2 = require("../../mocks");
const startMock = mocks_1.coreMock.createStart();
const stubs_1 = require("../../stubs");
const public_1 = require("src/plugins/kibana_react/public");
const react_2 = require("@kbn/i18n/react");
const enzyme_1 = require("enzyme");
const noop = () => {
    return;
};
const kqlQuery = {
    query: 'response:200',
    language: 'kuery',
};
const luceneQuery = {
    query: 'response:200',
    language: 'lucene',
};
const createMockWebStorage = () => ({
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
    length: 0,
});
const createMockStorage = () => ({
    storage: createMockWebStorage(),
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
});
function wrapQueryStringInputInContext(testProps, storage) {
    const defaultOptions = {
        screenTitle: 'Another Screen',
        intl: null,
    };
    const services = {
        ...startMock,
        data: mocks_2.dataPluginMock.createStartContract(),
        appName: testProps.appName || 'test',
        storage: storage || createMockStorage(),
    };
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: services },
            react_1.default.createElement(query_string_input_1.QueryStringInput, Object.assign({}, defaultOptions, testProps)))));
}
describe('QueryStringInput', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Should render the given query', () => {
        const component = enzyme_1.mount(wrapQueryStringInputInContext({
            query: kqlQuery,
            onSubmit: noop,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
        }));
        expect(component.find(eui_1.EuiFieldText).props().value).toBe(kqlQuery.query);
        expect(component.find(language_switcher_1.QueryLanguageSwitcher).prop('language')).toBe(kqlQuery.language);
    });
    it('Should pass the query language to the language switcher', () => {
        const component = enzyme_1.mount(wrapQueryStringInputInContext({
            query: luceneQuery,
            onSubmit: noop,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
        }));
        expect(component.find(language_switcher_1.QueryLanguageSwitcher).prop('language')).toBe(luceneQuery.language);
    });
    it('Should disable autoFocus on EuiFieldText when disableAutoFocus prop is true', () => {
        const component = enzyme_1.mount(wrapQueryStringInputInContext({
            query: kqlQuery,
            onSubmit: noop,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            disableAutoFocus: true,
        }));
        expect(component.find(eui_1.EuiFieldText).prop('autoFocus')).toBeFalsy();
    });
    it('Should create a unique PersistedLog based on the appName and query language', () => {
        query_string_input_test_mocks_1.mockPersistedLogFactory.mockClear();
        enzyme_1.mount(wrapQueryStringInputInContext({
            query: kqlQuery,
            onSubmit: noop,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            disableAutoFocus: true,
            appName: 'discover',
        }));
        expect(query_string_input_test_mocks_1.mockPersistedLogFactory.mock.calls[0][0]).toBe('typeahead:discover-kuery');
    });
    it("On language selection, should store the user's preference in localstorage and reset the query", () => {
        const mockStorage = createMockStorage();
        const mockCallback = jest.fn();
        const component = enzyme_1.mount(wrapQueryStringInputInContext({
            query: kqlQuery,
            onSubmit: mockCallback,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            disableAutoFocus: true,
            appName: 'discover',
        }, mockStorage));
        component
            .find(language_switcher_1.QueryLanguageSwitcher)
            .props()
            .onSelectLanguage('lucene');
        expect(mockStorage.set).toHaveBeenCalledWith('kibana.userQueryLanguage', 'lucene');
        expect(mockCallback).toHaveBeenCalledWith({ query: '', language: 'lucene' });
    });
    it('Should call onSubmit when the user hits enter inside the query bar', () => {
        const mockCallback = jest.fn();
        const component = enzyme_1.mount(wrapQueryStringInputInContext({
            query: kqlQuery,
            onSubmit: mockCallback,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            disableAutoFocus: true,
        }));
        const instance = component.find('QueryStringInputUI').instance();
        const input = instance.inputRef;
        const inputWrapper = component.find(eui_1.EuiFieldText).find('input');
        inputWrapper.simulate('keyDown', { target: input, keyCode: 13, key: 'Enter', metaKey: true });
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ query: 'response:200', language: 'kuery' });
    });
    it('Should use PersistedLog for recent search suggestions', async () => {
        const component = enzyme_1.mount(wrapQueryStringInputInContext({
            query: kqlQuery,
            onSubmit: noop,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            disableAutoFocus: true,
            persistedLog: query_string_input_test_mocks_1.mockPersistedLog,
        }));
        const instance = component.find('QueryStringInputUI').instance();
        const input = instance.inputRef;
        const inputWrapper = component.find(eui_1.EuiFieldText).find('input');
        inputWrapper.simulate('keyDown', { target: input, keyCode: 13, key: 'Enter', metaKey: true });
        expect(query_string_input_test_mocks_1.mockPersistedLog.add).toHaveBeenCalledWith('response:200');
        query_string_input_test_mocks_1.mockPersistedLog.get.mockClear();
        inputWrapper.simulate('change', { target: { value: 'extensi' } });
        expect(query_string_input_test_mocks_1.mockPersistedLog.get).toHaveBeenCalled();
    });
    it('Should accept index pattern strings and fetch the full object', () => {
        query_string_input_test_mocks_1.mockFetchIndexPatterns.mockClear();
        enzyme_1.mount(wrapQueryStringInputInContext({
            query: kqlQuery,
            onSubmit: noop,
            indexPatterns: ['logstash-*'],
            disableAutoFocus: true,
        }));
        expect(query_string_input_test_mocks_1.mockFetchIndexPatterns).toHaveBeenCalledWith(startMock.savedObjects.client, ['logstash-*'], startMock.uiSettings);
    });
});
