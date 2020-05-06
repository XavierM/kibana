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
const search_bar_1 = require("./search_bar");
const public_1 = require("src/plugins/kibana_react/public");
const react_2 = require("@kbn/i18n/react");
const mocks_1 = require("../../../../../core/public/mocks");
const startMock = mocks_1.coreMock.createStart();
const enzyme_1 = require("enzyme");
const mockTimeHistory = {
    get: () => {
        return [];
    },
};
jest.mock('..', () => {
    return {
        FilterBar: () => react_1.default.createElement("div", { className: "filterBar" }),
    };
});
jest.mock('../query_string_input/query_bar_top_row', () => {
    return {
        QueryBarTopRow: () => react_1.default.createElement("div", { className: "queryBar" }),
    };
});
const noop = jest.fn();
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
const mockIndexPattern = {
    id: '1234',
    title: 'logstash-*',
    fields: [
        {
            name: 'response',
            type: 'number',
            esTypes: ['integer'],
            aggregatable: true,
            filterable: true,
            searchable: true,
        },
    ],
};
const kqlQuery = {
    query: 'response:200',
    language: 'kuery',
};
function wrapSearchBarInContext(testProps) {
    const defaultOptions = {
        appName: 'test',
        timeHistory: mockTimeHistory,
        intl: null,
    };
    const services = {
        uiSettings: startMock.uiSettings,
        savedObjects: startMock.savedObjects,
        notifications: startMock.notifications,
        http: startMock.http,
        storage: createMockStorage(),
        data: {
            query: {
                savedQueries: {},
            },
        },
    };
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: services },
            react_1.default.createElement(search_bar_1.SearchBar.WrappedComponent, Object.assign({}, defaultOptions, testProps)))));
}
describe('SearchBar', () => {
    const SEARCH_BAR_ROOT = '.globalQueryBar';
    const FILTER_BAR = '.filterBar';
    const QUERY_BAR = '.queryBar';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Should render query bar when no options provided (in reality - timepicker)', () => {
        const component = enzyme_1.mount(wrapSearchBarInContext({
            indexPatterns: [mockIndexPattern],
        }));
        expect(component.find(SEARCH_BAR_ROOT).length).toBe(1);
        expect(component.find(FILTER_BAR).length).toBe(0);
        expect(component.find(QUERY_BAR).length).toBe(1);
    });
    it('Should render empty when timepicker is off and no options provided', () => {
        const component = enzyme_1.mount(wrapSearchBarInContext({
            indexPatterns: [mockIndexPattern],
            showDatePicker: false,
        }));
        expect(component.find(SEARCH_BAR_ROOT).length).toBe(1);
        expect(component.find(FILTER_BAR).length).toBe(0);
        expect(component.find(QUERY_BAR).length).toBe(0);
    });
    it('Should render filter bar, when required fields are provided', () => {
        const component = enzyme_1.mount(wrapSearchBarInContext({
            indexPatterns: [mockIndexPattern],
            showDatePicker: false,
            onFiltersUpdated: noop,
            filters: [],
        }));
        expect(component.find(SEARCH_BAR_ROOT).length).toBe(1);
        expect(component.find(FILTER_BAR).length).toBe(1);
        expect(component.find(QUERY_BAR).length).toBe(0);
    });
    it('Should NOT render filter bar, if disabled', () => {
        const component = enzyme_1.mount(wrapSearchBarInContext({
            indexPatterns: [mockIndexPattern],
            showFilterBar: false,
            filters: [],
            onFiltersUpdated: noop,
            showDatePicker: false,
        }));
        expect(component.find(SEARCH_BAR_ROOT).length).toBe(1);
        expect(component.find(FILTER_BAR).length).toBe(0);
        expect(component.find(QUERY_BAR).length).toBe(0);
    });
    it('Should render query bar, when required fields are provided', () => {
        const component = enzyme_1.mount(wrapSearchBarInContext({
            indexPatterns: [mockIndexPattern],
            screenTitle: 'test screen',
            onQuerySubmit: noop,
            query: kqlQuery,
        }));
        expect(component.find(SEARCH_BAR_ROOT).length).toBe(1);
        expect(component.find(FILTER_BAR).length).toBe(0);
        expect(component.find(QUERY_BAR).length).toBe(1);
    });
    it('Should NOT render query bar, if disabled', () => {
        const component = enzyme_1.mount(wrapSearchBarInContext({
            indexPatterns: [mockIndexPattern],
            screenTitle: 'test screen',
            onQuerySubmit: noop,
            query: kqlQuery,
            showQueryBar: false,
        }));
        expect(component.find(SEARCH_BAR_ROOT).length).toBe(1);
        expect(component.find(FILTER_BAR).length).toBe(0);
        expect(component.find(QUERY_BAR).length).toBe(0);
    });
    it('Should render query bar and filter bar', () => {
        const component = enzyme_1.mount(wrapSearchBarInContext({
            indexPatterns: [mockIndexPattern],
            screenTitle: 'test screen',
            onQuerySubmit: noop,
            query: kqlQuery,
            filters: [],
            onFiltersUpdated: noop,
        }));
        expect(component.find(SEARCH_BAR_ROOT).length).toBe(1);
        expect(component.find(FILTER_BAR).length).toBe(1);
        expect(component.find(QUERY_BAR).length).toBe(1);
    });
});
