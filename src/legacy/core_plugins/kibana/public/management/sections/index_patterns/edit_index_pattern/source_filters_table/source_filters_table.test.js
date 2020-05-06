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
const source_filters_table_1 = require("./source_filters_table");
jest.mock('@elastic/eui', () => ({
    EuiButton: 'eui-button',
    EuiTitle: 'eui-title',
    EuiText: 'eui-text',
    EuiHorizontalRule: 'eui-horizontal-rule',
    EuiSpacer: 'eui-spacer',
    EuiCallOut: 'eui-call-out',
    EuiLink: 'eui-link',
    EuiOverlayMask: 'eui-overlay-mask',
    EuiConfirmModal: 'eui-confirm-modal',
    EuiLoadingSpinner: 'eui-loading-spinner',
    Comparators: {
        property: () => { },
        default: () => { },
    },
}));
jest.mock('./components/header', () => ({ Header: 'header' }));
jest.mock('./components/table', () => ({
    // Note: this seems to fix React complaining about non lowercase attributes
    Table: () => {
        return 'table';
    },
}));
const getIndexPatternMock = (mockedFields = {}) => ({
    sourceFilters: [{ value: 'time*' }, { value: 'nam*' }, { value: 'age*' }],
    ...mockedFields,
});
describe('SourceFiltersTable', () => {
    test('should render normally', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: getIndexPatternMock(), fieldWildcardMatcher: () => { }, filterFilter: '' }));
        expect(component).toMatchSnapshot();
    });
    test('should filter based on the query bar', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: getIndexPatternMock(), fieldWildcardMatcher: () => { }, filterFilter: '' }));
        component.setProps({ filterFilter: 'ti' });
        expect(component).toMatchSnapshot();
    });
    test('should should a loading indicator when saving', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: getIndexPatternMock({
                sourceFilters: [{ value: 'tim*' }],
            }), filterFilter: '', fieldWildcardMatcher: () => { } }));
        component.setState({ isSaving: true });
        expect(component).toMatchSnapshot();
    });
    test('should show a delete modal', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: getIndexPatternMock({
                sourceFilters: [{ value: 'tim*' }],
            }), filterFilter: '', fieldWildcardMatcher: () => { } }));
        component.instance().startDeleteFilter({ value: 'tim*', clientId: 1 });
        component.update(); // We are not calling `.setState` directly so we need to re-render
        expect(component).toMatchSnapshot();
    });
    test('should remove a filter', async () => {
        const save = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: getIndexPatternMock({
                save,
                sourceFilters: [{ value: 'tim*' }, { value: 'na*' }],
            }), filterFilter: '', fieldWildcardMatcher: () => { } }));
        component.instance().startDeleteFilter({ value: 'tim*', clientId: 1 });
        component.update(); // We are not calling `.setState` directly so we need to re-render
        await component.instance().deleteFilter();
        component.update(); // We are not calling `.setState` directly so we need to re-render
        expect(save).toBeCalled();
        expect(component).toMatchSnapshot();
    });
    test('should add a filter', async () => {
        const save = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: getIndexPatternMock({
                save,
                sourceFilters: [{ value: 'tim*' }],
            }), filterFilter: '', fieldWildcardMatcher: () => { } }));
        await component.instance().onAddFilter('na*');
        component.update(); // We are not calling `.setState` directly so we need to re-render
        expect(save).toBeCalled();
        expect(component).toMatchSnapshot();
    });
    test('should update a filter', async () => {
        const save = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: getIndexPatternMock({
                save,
                sourceFilters: [{ value: 'tim*' }],
            }), filterFilter: '', fieldWildcardMatcher: () => { } }));
        await component.instance().saveFilter({ clientId: 'tim*', value: 'ti*' });
        component.update(); // We are not calling `.setState` directly so we need to re-render
        expect(save).toBeCalled();
        expect(component).toMatchSnapshot();
    });
});
