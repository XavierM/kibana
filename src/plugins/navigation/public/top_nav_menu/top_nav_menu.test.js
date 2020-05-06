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
const top_nav_menu_1 = require("./top_nav_menu");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const dataShim = {
    ui: {
        SearchBar: () => react_1.default.createElement("div", { className: "searchBar" }),
    },
};
describe('TopNavMenu', () => {
    const TOP_NAV_ITEM_SELECTOR = 'TopNavMenuItem';
    const SEARCH_BAR_SELECTOR = 'SearchBar';
    const menuItems = [
        {
            id: 'test',
            label: 'test',
            run: jest.fn(),
        },
        {
            id: 'test2',
            label: 'test2',
            run: jest.fn(),
        },
        {
            id: 'test3',
            label: 'test3',
            run: jest.fn(),
        },
    ];
    it('Should render nothing when no config is provided', () => {
        const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(top_nav_menu_1.TopNavMenu, { appName: 'test' }));
        expect(component.find(TOP_NAV_ITEM_SELECTOR).length).toBe(0);
        expect(component.find(SEARCH_BAR_SELECTOR).length).toBe(0);
    });
    it('Should render 1 menu item', () => {
        const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(top_nav_menu_1.TopNavMenu, { appName: 'test', config: [menuItems[0]] }));
        expect(component.find(TOP_NAV_ITEM_SELECTOR).length).toBe(1);
        expect(component.find(SEARCH_BAR_SELECTOR).length).toBe(0);
    });
    it('Should render multiple menu items', () => {
        const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(top_nav_menu_1.TopNavMenu, { appName: 'test', config: menuItems }));
        expect(component.find(TOP_NAV_ITEM_SELECTOR).length).toBe(menuItems.length);
        expect(component.find(SEARCH_BAR_SELECTOR).length).toBe(0);
    });
    it('Should render search bar', () => {
        const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(top_nav_menu_1.TopNavMenu, { appName: 'test', showSearchBar: true, data: dataShim }));
        expect(component.find(TOP_NAV_ITEM_SELECTOR).length).toBe(0);
        expect(component.find(SEARCH_BAR_SELECTOR).length).toBe(1);
    });
    it('Should render with a class name', () => {
        const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(top_nav_menu_1.TopNavMenu, { appName: 'test', showSearchBar: true, data: dataShim, className: 'myCoolClass' }));
        expect(component.find('.kbnTopNavMenu').length).toBe(1);
        expect(component.find('.myCoolClass').length).toBeTruthy();
    });
});
