"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const saved_object_finder_create_new_1 = require("../saved_object_finder_create_new");
const enzyme_1 = require("enzyme");
const eui_1 = require("@elastic/eui");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
describe('SavedObjectFinderCreateNew', () => {
    test('renders correctly with no items', () => {
        const wrapper = enzyme_1.shallow(react_1.default.createElement(saved_object_finder_create_new_1.SavedObjectFinderCreateNew, { menuItems: [] }));
        expect(wrapper.find(eui_1.EuiPopover).length).toEqual(1);
        const menuPanel = wrapper.find(eui_1.EuiContextMenuPanel);
        expect(menuPanel.length).toEqual(1);
        const panelItems = menuPanel.prop('items');
        if (panelItems) {
            expect(panelItems.length).toEqual(0);
        }
        else {
            fail('Expect paneltems to be defined');
        }
    });
    test('renders correctly with items', () => {
        const items = [];
        const onClick = jest.fn();
        for (let i = 0; i < 3; i++) {
            items.push(react_1.default.createElement(eui_1.EuiContextMenuItem, { key: i + 1, "data-test-subj": `item${i + 1}`, onClick: onClick }, `item${i + 1}`));
        }
        const wrapper = enzyme_1.shallow(react_1.default.createElement(saved_object_finder_create_new_1.SavedObjectFinderCreateNew, { menuItems: items }));
        expect(wrapper.find(eui_1.EuiPopover).length).toEqual(1);
        const menuPanel = wrapper.find(eui_1.EuiContextMenuPanel);
        expect(menuPanel.length).toEqual(1);
        const paneltems = menuPanel.prop('items');
        if (paneltems) {
            expect(paneltems.length).toEqual(3);
            expect(paneltems[0].key).toEqual('1');
            expect(paneltems[1].key).toEqual('2');
            expect(paneltems[2].key).toEqual('3');
        }
        else {
            fail('Expect paneltems to be defined');
        }
    });
    test('clicking the button opens/closes the popover', () => {
        const items = [];
        const onClick = jest.fn();
        for (let i = 0; i < 3; i++) {
            items.push(react_1.default.createElement(eui_1.EuiContextMenuItem, { key: i + 1, "data-test-subj": `item${i + 1}`, onClick: onClick }, `item${i + 1}`));
        }
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(saved_object_finder_create_new_1.SavedObjectFinderCreateNew, { menuItems: items }));
        let popover = component.find(eui_1.EuiPopover);
        expect(popover.prop('isOpen')).toBe(false);
        const button = component.find(eui_1.EuiButton);
        button.simulate('click');
        popover = component.find(eui_1.EuiPopover);
        expect(popover.prop('isOpen')).toBe(true);
        button.simulate('click');
        popover = component.find(eui_1.EuiPopover);
        expect(popover.prop('isOpen')).toBe(false);
    });
});
