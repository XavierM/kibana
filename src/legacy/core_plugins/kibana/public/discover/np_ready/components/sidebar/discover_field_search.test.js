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
const test_utils_1 = require("react-dom/test-utils");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const discover_field_search_1 = require("./discover_field_search");
const eui_1 = require("@elastic/eui");
describe('DiscoverFieldSearch', () => {
    const defaultProps = {
        onChange: jest.fn(),
        value: 'test',
        types: ['any', 'string', '_source'],
    };
    function mountComponent(props) {
        const compProps = props || defaultProps;
        return enzyme_helpers_1.mountWithIntl(react_1.default.createElement(discover_field_search_1.DiscoverFieldSearch, Object.assign({}, compProps)));
    }
    function findButtonGroup(component, id) {
        return component.find(`[data-test-subj="${id}ButtonGroup"]`).first();
    }
    test('enter value', () => {
        const component = mountComponent();
        const input = test_1.findTestSubject(component, 'fieldFilterSearchInput');
        input.simulate('change', { target: { value: 'new filter' } });
        expect(defaultProps.onChange).toBeCalledTimes(1);
    });
    test('change in active filters should change facet selection and call onChange', () => {
        const onChange = jest.fn();
        const component = mountComponent({ ...defaultProps, ...{ onChange } });
        let btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        expect(btn.hasClass('euiFacetButton--isSelected')).toBeFalsy();
        btn.simulate('click');
        const aggregatableButtonGroup = findButtonGroup(component, 'aggregatable');
        test_utils_1.act(() => {
            // @ts-ignore
            aggregatableButtonGroup.props().onChange('aggregatable-true', null);
        });
        component.update();
        btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        expect(btn.hasClass('euiFacetButton--isSelected')).toBe(true);
        expect(onChange).toBeCalledWith('aggregatable', true);
    });
    test('change in active filters should change filters count', () => {
        const component = mountComponent();
        let btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        btn.simulate('click');
        btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        const badge = btn.find('.euiNotificationBadge');
        // no active filters
        expect(badge.text()).toEqual('0');
        // change value of aggregatable select
        const aggregatableButtonGroup = findButtonGroup(component, 'aggregatable');
        test_utils_1.act(() => {
            // @ts-ignore
            aggregatableButtonGroup.props().onChange('aggregatable-true', null);
        });
        component.update();
        expect(badge.text()).toEqual('1');
        // change value of searchable select
        const searchableButtonGroup = findButtonGroup(component, 'searchable');
        test_utils_1.act(() => {
            // @ts-ignore
            searchableButtonGroup.props().onChange('searchable-true', null);
        });
        component.update();
        expect(badge.text()).toEqual('2');
        // change value of searchable select
        test_utils_1.act(() => {
            // @ts-ignore
            searchableButtonGroup.props().onChange('searchable-any', null);
        });
        component.update();
        expect(badge.text()).toEqual('1');
    });
    test('change in missing fields switch should not change filter count', () => {
        const component = mountComponent();
        const btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        btn.simulate('click');
        const badge = btn.find('.euiNotificationBadge');
        expect(badge.text()).toEqual('0');
        const missingSwitch = test_1.findTestSubject(component, 'missingSwitch');
        missingSwitch.simulate('change', { target: { value: false } });
        expect(badge.text()).toEqual('0');
    });
    test('change in filters triggers onChange', () => {
        const onChange = jest.fn();
        const component = mountComponent({ ...defaultProps, ...{ onChange } });
        const btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        btn.simulate('click');
        const aggregtableButtonGroup = findButtonGroup(component, 'aggregatable');
        const missingSwitch = test_1.findTestSubject(component, 'missingSwitch');
        test_utils_1.act(() => {
            // @ts-ignore
            aggregtableButtonGroup.props().onChange('aggregatable-true', null);
        });
        missingSwitch.simulate('click');
        expect(onChange).toBeCalledTimes(2);
    });
    test('change in type filters triggers onChange with appropriate value', () => {
        const onChange = jest.fn();
        const component = mountComponent({ ...defaultProps, ...{ onChange } });
        const btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        btn.simulate('click');
        const typeSelector = test_1.findTestSubject(component, 'typeSelect');
        typeSelector.simulate('change', { target: { value: 'string' } });
        expect(onChange).toBeCalledWith('type', 'string');
        typeSelector.simulate('change', { target: { value: 'any' } });
        expect(onChange).toBeCalledWith('type', 'any');
    });
    test('click on filter button should open and close popover', () => {
        const component = mountComponent();
        const btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        btn.simulate('click');
        let popover = component.find(eui_1.EuiPopover);
        expect(popover.prop('isOpen')).toBe(true);
        btn.simulate('click');
        popover = component.find(eui_1.EuiPopover);
        expect(popover.prop('isOpen')).toBe(false);
    });
    test('click outside popover should close popover', () => {
        const triggerDocumentMouseDown = (e) => {
            const event = new Event('mousedown');
            // @ts-ignore
            event.euiGeneratedBy = e.nativeEvent.euiGeneratedBy;
            document.dispatchEvent(event);
        };
        const triggerDocumentMouseUp = (e) => {
            const event = new Event('mouseup');
            // @ts-ignore
            event.euiGeneratedBy = e.nativeEvent.euiGeneratedBy;
            document.dispatchEvent(event);
        };
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement("div", { onMouseDown: triggerDocumentMouseDown, onMouseUp: triggerDocumentMouseUp, id: "wrapperId" },
            react_1.default.createElement(discover_field_search_1.DiscoverFieldSearch, Object.assign({}, defaultProps))));
        const btn = test_1.findTestSubject(component, 'toggleFieldFilterButton');
        btn.simulate('click');
        let popover = component.find(eui_1.EuiPopover);
        expect(popover.length).toBe(1);
        expect(popover.prop('isOpen')).toBe(true);
        component.find('#wrapperId').simulate('mousedown');
        component.find('#wrapperId').simulate('mouseup');
        popover = component.find(eui_1.EuiPopover);
        expect(popover.prop('isOpen')).toBe(false);
    });
});
