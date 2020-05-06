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
const table_1 = require("./table");
const eui_1 = require("@elastic/eui");
const indexPattern = {};
const items = [{ value: 'tim*', clientId: '' }];
const getIndexPatternMock = (mockedFields = {}) => ({ ...mockedFields });
const getTableColumnRender = (component, index = 0) => {
    const columns = component.prop('columns');
    return {
        render: columns[index].render,
    };
};
describe('Table', () => {
    test('should render normally', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(table_1.Table, { indexPattern: indexPattern, items: items, deleteFilter: () => { }, fieldWildcardMatcher: () => { }, saveFilter: () => undefined, isSaving: true }));
        expect(component).toMatchSnapshot();
    });
    test('should render filter matches', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(table_1.Table, { indexPattern: getIndexPatternMock({
                getNonScriptedFields: () => [{ name: 'time' }, { name: 'value' }],
            }), items: items, deleteFilter: () => { }, fieldWildcardMatcher: (filter) => (field) => field.includes(filter[0]), saveFilter: () => undefined, isSaving: false }));
        const matchesTableCell = enzyme_1.shallow(getTableColumnRender(component, 1).render('tim', { clientId: 1 }));
        expect(matchesTableCell).toMatchSnapshot();
    });
    describe('editing', () => {
        const saveFilter = jest.fn();
        const clientId = '1';
        let component;
        beforeEach(() => {
            component = enzyme_1.shallow(react_1.default.createElement(table_1.Table, { indexPattern: indexPattern, items: items, deleteFilter: () => { }, fieldWildcardMatcher: () => { }, saveFilter: saveFilter, isSaving: false }));
        });
        test('should show an input field', () => {
            // Start the editing process
            const editingComponent = enzyme_1.shallow(
            // Wrap in a div because: https://github.com/airbnb/enzyme/issues/1213
            react_1.default.createElement("div", null, getTableColumnRender(component, 2).render({ clientId, value: 'tim*' })));
            editingComponent
                .find('EuiButtonIcon')
                .at(1)
                .simulate('click');
            // Ensure the state change propagates
            component.update();
            const cell = getTableColumnRender(component).render('tim*', { clientId });
            const filterNameTableCell = enzyme_1.shallow(cell);
            expect(filterNameTableCell).toMatchSnapshot();
        });
        test('should show a save button', () => {
            // Start the editing process
            const editingComponent = enzyme_1.shallow(
            // Fixes: Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
            react_1.default.createElement("div", null, getTableColumnRender(component, 2).render({ clientId, value: 'tim*' })));
            editingComponent
                .find('EuiButtonIcon')
                .at(1)
                .simulate('click');
            // Ensure the state change propagates
            component.update();
            // Verify save button
            const saveTableCell = enzyme_1.shallow(
            // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
            react_1.default.createElement("div", null, getTableColumnRender(component, 2).render({ clientId, value: 'tim*' })));
            expect(saveTableCell).toMatchSnapshot();
        });
        test('should update the matches dynamically as input value is changed', () => {
            const localComponent = enzyme_1.shallow(react_1.default.createElement(table_1.Table, { indexPattern: getIndexPatternMock({
                    getNonScriptedFields: () => [{ name: 'time' }, { name: 'value' }],
                }), items: items, deleteFilter: () => { }, fieldWildcardMatcher: (query) => () => query.includes('time*'), saveFilter: saveFilter, isSaving: false }));
            // Start the editing process
            const editingComponent = enzyme_1.shallow(
            // Fixes: Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
            react_1.default.createElement("div", null, localComponent.prop('columns')[2].render({ clientId, value: 'tim*' })));
            editingComponent
                .find('EuiButtonIcon')
                .at(1)
                .simulate('click');
            // Update the value
            localComponent.setState({ editingFilterValue: 'time*' });
            // Ensure the state change propagates
            localComponent.update();
            // Verify updated matches
            const matchesTableCell = enzyme_1.shallow(
            // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
            react_1.default.createElement("div", null, localComponent.prop('columns')[1].render('tim*', { clientId })));
            expect(matchesTableCell).toMatchSnapshot();
        });
        test('should exit on save', () => {
            // Change the value to something else
            component.setState({
                editingFilterId: clientId,
                editingFilterValue: 'ti*',
            });
            // Click the save button
            const editingComponent = enzyme_1.shallow(
            // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
            react_1.default.createElement("div", null, getTableColumnRender(component, 2).render({ clientId, value: 'tim*' })));
            editingComponent
                .find('EuiButtonIcon')
                .at(0)
                .simulate('click');
            editingComponent.update();
            // Ensure we call saveFilter properly
            expect(saveFilter).toBeCalledWith({
                clientId,
                value: 'ti*',
            });
            // Ensure the state is properly reset
            expect(component.state('editingFilterId')).toBe('');
        });
    });
    test('should allow deletes', () => {
        const deleteFilter = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(table_1.Table, { indexPattern: indexPattern, items: items, deleteFilter: deleteFilter, fieldWildcardMatcher: () => { }, saveFilter: () => undefined, isSaving: false }));
        // Click the delete button
        const deleteCellComponent = enzyme_1.shallow(
        // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
        react_1.default.createElement("div", null, component.prop('columns')[2].render({ clientId: 1, value: 'tim*' })));
        deleteCellComponent
            .find('EuiButtonIcon')
            .at(1)
            .simulate('click');
        expect(deleteFilter).toBeCalled();
    });
    test('should save when in edit mode and the enter key is pressed', () => {
        const saveFilter = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(table_1.Table, { indexPattern: indexPattern, items: items, deleteFilter: () => { }, fieldWildcardMatcher: () => { }, saveFilter: saveFilter, isSaving: false }));
        // Start the editing process
        const editingComponent = enzyme_1.shallow(
        // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
        react_1.default.createElement("div", null, component.prop('columns')[2].render({ clientId: 1, value: 'tim*' })));
        editingComponent
            .find('EuiButtonIcon')
            .at(0)
            .simulate('click');
        component.update();
        // Get the rendered input cell
        const filterNameTableCell = enzyme_1.shallow(
        // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
        react_1.default.createElement("div", null, component.prop('columns')[0].render('tim*', { clientId: 1 })));
        // Press the enter key
        filterNameTableCell.find('EuiFieldText').simulate('keydown', { keyCode: eui_1.keyCodes.ENTER });
        expect(saveFilter).toBeCalled();
        // It should reset
        expect(component.state('editingFilterId')).toBe('');
    });
    test('should cancel when in edit mode and the esc key is pressed', () => {
        const saveFilter = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(table_1.Table, { indexPattern: indexPattern, items: items, deleteFilter: () => { }, fieldWildcardMatcher: () => { }, saveFilter: saveFilter, isSaving: false }));
        // Start the editing process
        const editingComponent = enzyme_1.shallow(
        // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
        react_1.default.createElement("div", null, component.prop('columns')[2].render({ clientId: 1, value: 'tim*' })));
        editingComponent
            .find('EuiButtonIcon')
            .at(0)
            .simulate('click');
        // Ensure the state change propagates
        component.update();
        // Get the rendered input cell
        const filterNameTableCell = enzyme_1.shallow(
        // Fixes Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `symbol`.
        react_1.default.createElement("div", null, component.prop('columns')[0].render('tim*', { clientId: 1 })));
        // Press the ESCAPE key
        filterNameTableCell.find('EuiFieldText').simulate('keydown', { keyCode: eui_1.keyCodes.ESCAPE });
        expect(saveFilter).not.toBeCalled();
        // It should reset
        expect(component.state('editingFilterId')).toBe('');
    });
});
