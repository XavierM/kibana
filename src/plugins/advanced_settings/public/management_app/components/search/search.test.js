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
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const eui_1 = require("@elastic/eui");
const search_1 = require("./search");
const query = eui_1.Query.parse('');
const categories = ['general', 'dashboard', 'hiddenCategory', 'x-pack'];
describe('Search', () => {
    it('should render normally', async () => {
        const onQueryChange = () => { };
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(search_1.Search, { query: query, categories: categories, onQueryChange: onQueryChange }));
        expect(component).toMatchSnapshot();
    });
    it('should call parent function when query is changed', async () => {
        // This test is brittle as it knows about implementation details
        // (EuiFieldSearch uses onKeyup instead of onChange to handle input)
        const onQueryChange = jest.fn();
        const component = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(search_1.Search, { query: query, categories: categories, onQueryChange: onQueryChange }));
        test_1.findTestSubject(component, 'settingsSearchBar').simulate('keyup', {
            target: { value: 'new filter' },
        });
        expect(onQueryChange).toHaveBeenCalledTimes(1);
    });
    it('should handle query parse error', async () => {
        const onQueryChangeMock = jest.fn();
        const component = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(search_1.Search, { query: query, categories: categories, onQueryChange: onQueryChangeMock }));
        const searchBar = test_1.findTestSubject(component, 'settingsSearchBar');
        // Send invalid query
        searchBar.simulate('keyup', { target: { value: '?' } });
        expect(onQueryChangeMock).toHaveBeenCalledTimes(0);
        expect(component.state().isSearchTextValid).toBe(false);
        onQueryChangeMock.mockReset();
        // Send valid query to ensure component can recover from invalid query
        searchBar.simulate('keyup', { target: { value: 'dateFormat' } });
        expect(onQueryChangeMock).toHaveBeenCalledTimes(1);
        expect(component.state().isSearchTextValid).toBe(true);
    });
});
