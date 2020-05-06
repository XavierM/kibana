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
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const query_bar_top_row_1 = require("./query_bar_top_row");
const mocks_1 = require("../../../../../core/public/mocks");
const mocks_2 = require("../../mocks");
const public_1 = require("src/plugins/kibana_react/public");
const react_2 = require("@kbn/i18n/react");
const stubs_1 = require("../../stubs");
const startMock = mocks_1.coreMock.createStart();
const mockTimeHistory = {
    get: () => {
        return [];
    },
};
startMock.uiSettings.get.mockImplementation((key) => {
    switch (key) {
        case 'timepicker:quickRanges':
            return [
                {
                    from: 'now/d',
                    to: 'now/d',
                    display: 'Today',
                },
            ];
        case 'dateFormat':
            return 'MMM D, YYYY @ HH:mm:ss.SSS';
        case 'history:limit':
            return 10;
        case 'timepicker:timeDefaults':
            return {
                from: 'now-15m',
                to: 'now',
            };
        default:
            throw new Error(`Unexpected config key: ${key}`);
    }
});
const noop = () => {
    return;
};
const kqlQuery = {
    query: 'response:200',
    language: 'kuery',
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
function wrapQueryBarTopRowInContext(testProps) {
    const defaultOptions = {
        screenTitle: 'Another Screen',
        onSubmit: noop,
        onChange: noop,
        intl: null,
    };
    const services = {
        ...startMock,
        data: mocks_2.dataPluginMock.createStartContract(),
        appName: 'discover',
        storage: createMockStorage(),
    };
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: services },
            react_1.default.createElement(query_bar_top_row_1.QueryBarTopRow, Object.assign({}, defaultOptions, testProps)))));
}
describe('QueryBarTopRowTopRow', () => {
    const QUERY_INPUT_SELECTOR = 'QueryStringInputUI';
    const TIMEPICKER_SELECTOR = 'EuiSuperDatePicker';
    const TIMEPICKER_DURATION = '[data-shared-timefilter-duration]';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Should render query and time picker', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            query: kqlQuery,
            screenTitle: 'Another Screen',
            isDirty: false,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            timeHistory: mockTimeHistory,
        }));
        expect(component.find(QUERY_INPUT_SELECTOR).length).toBe(1);
        expect(component.find(TIMEPICKER_SELECTOR).length).toBe(1);
    });
    it('Should create a unique PersistedLog based on the appName and query language', () => {
        enzyme_1.mount(wrapQueryBarTopRowInContext({
            query: kqlQuery,
            screenTitle: 'Another Screen',
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            timeHistory: mockTimeHistory,
            disableAutoFocus: true,
            isDirty: false,
        }));
        expect(query_string_input_test_mocks_1.mockPersistedLogFactory.mock.calls[0][0]).toBe('typeahead:discover-kuery');
    });
    it('Should render only timepicker when no options provided', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            isDirty: false,
            timeHistory: mockTimeHistory,
        }));
        expect(component.find(QUERY_INPUT_SELECTOR).length).toBe(0);
        expect(component.find(TIMEPICKER_SELECTOR).length).toBe(1);
    });
    it('Should not show timepicker when asked', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            showDatePicker: false,
            timeHistory: mockTimeHistory,
            isDirty: false,
        }));
        expect(component.find(QUERY_INPUT_SELECTOR).length).toBe(0);
        expect(component.find(TIMEPICKER_SELECTOR).length).toBe(0);
    });
    it('Should render timepicker with options', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            isDirty: false,
            screenTitle: 'Another Screen',
            showDatePicker: true,
            dateRangeFrom: 'now-7d',
            dateRangeTo: 'now',
            timeHistory: mockTimeHistory,
        }));
        expect(component.find(QUERY_INPUT_SELECTOR).length).toBe(0);
        expect(component.find(TIMEPICKER_SELECTOR).length).toBe(1);
    });
    it('Should render the timefilter duration container for sharing', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            isDirty: false,
            screenTitle: 'Another Screen',
            showDatePicker: true,
            dateRangeFrom: 'now-7d',
            dateRangeTo: 'now',
            timeHistory: mockTimeHistory,
        }));
        // match the data attribute rendered in the in the ReactHTML object
        expect(component.find(TIMEPICKER_DURATION)).toMatchObject(/<div\b.*\bdata-shared-timefilter-duration\b/);
    });
    it('Should render only query input bar', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            query: kqlQuery,
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            isDirty: false,
            screenTitle: 'Another Screen',
            showDatePicker: false,
            dateRangeFrom: 'now-7d',
            dateRangeTo: 'now',
            timeHistory: mockTimeHistory,
        }));
        expect(component.find(QUERY_INPUT_SELECTOR).length).toBe(1);
        expect(component.find(TIMEPICKER_SELECTOR).length).toBe(0);
    });
    it('Should NOT render query input bar if disabled', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            query: kqlQuery,
            isDirty: false,
            screenTitle: 'Another Screen',
            indexPatterns: [stubs_1.stubIndexPatternWithFields],
            showQueryInput: false,
            showDatePicker: false,
            timeHistory: mockTimeHistory,
        }));
        expect(component.find(QUERY_INPUT_SELECTOR).length).toBe(0);
        expect(component.find(TIMEPICKER_SELECTOR).length).toBe(0);
    });
    it('Should NOT render query input bar if missing options', () => {
        const component = enzyme_1.mount(wrapQueryBarTopRowInContext({
            isDirty: false,
            screenTitle: 'Another Screen',
            showDatePicker: false,
            timeHistory: mockTimeHistory,
        }));
        expect(component.find(QUERY_INPUT_SELECTOR).length).toBe(0);
        expect(component.find(TIMEPICKER_SELECTOR).length).toBe(0);
    });
});
