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
const mocks_1 = require("../../../../../../core/public/mocks");
const action_service_mock_1 = require("../../../services/action_service.mock");
const table_1 = require("./table");
const defaultProps = {
    basePath: mocks_1.httpServiceMock.createSetupContract().basePath,
    actionRegistry: action_service_mock_1.actionServiceMock.createStart(),
    selectedSavedObjects: [
        {
            id: '1',
            type: 'index-pattern',
            attributes: {},
            references: [],
            meta: {
                title: `MyIndexPattern*`,
                icon: 'indexPatternApp',
                editUrl: '#/management/kibana/index_patterns/1',
                inAppUrl: {
                    path: '/management/kibana/index_patterns/1',
                    uiCapabilitiesPath: 'management.kibana.index_patterns',
                },
            },
        },
    ],
    selectionConfig: {
        onSelectionChange: () => { },
    },
    filterOptions: [{ value: 2 }],
    onDelete: () => { },
    onExport: () => { },
    goInspectObject: () => { },
    canGoInApp: () => true,
    pageIndex: 1,
    pageSize: 2,
    items: [
        {
            id: '1',
            type: 'index-pattern',
            attributes: {},
            references: [],
            meta: {
                title: `MyIndexPattern*`,
                icon: 'indexPatternApp',
                editUrl: '#/management/kibana/index_patterns/1',
                inAppUrl: {
                    path: '/management/kibana/index_patterns/1',
                    uiCapabilitiesPath: 'management.kibana.index_patterns',
                },
            },
        },
    ],
    itemId: 'id',
    totalItemCount: 3,
    onQueryChange: () => { },
    onTableChange: () => { },
    isSearching: false,
    onShowRelationships: () => { },
    canDelete: true,
};
describe('Table', () => {
    it('should render normally', () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(table_1.Table, Object.assign({}, defaultProps)));
        expect(component).toMatchSnapshot();
    });
    it('should handle query parse error', () => {
        const onQueryChangeMock = jest.fn();
        const customizedProps = {
            ...defaultProps,
            onQueryChange: onQueryChangeMock,
        };
        const component = enzyme_helpers_1.mountWithI18nProvider(react_1.default.createElement(table_1.Table, Object.assign({}, customizedProps)));
        const searchBar = test_1.findTestSubject(component, 'savedObjectSearchBar');
        // Send invalid query
        searchBar.simulate('keyup', { keyCode: eui_1.keyCodes.ENTER, target: { value: '?' } });
        expect(onQueryChangeMock).toHaveBeenCalledTimes(0);
        expect(component.state().isSearchTextValid).toBe(false);
        onQueryChangeMock.mockReset();
        // Send valid query to ensure component can recover from invalid query
        searchBar.simulate('keyup', { keyCode: eui_1.keyCodes.ENTER, target: { value: 'I am valid' } });
        expect(onQueryChangeMock).toHaveBeenCalledTimes(1);
        expect(component.state().isSearchTextValid).toBe(true);
    });
    it(`prevents saved objects from being deleted`, () => {
        const selectedSavedObjects = [
            { type: 'visualization' },
            { type: 'search' },
            { type: 'index-pattern' },
        ];
        const customizedProps = { ...defaultProps, selectedSavedObjects, canDelete: false };
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(table_1.Table, Object.assign({}, customizedProps)));
        expect(component).toMatchSnapshot();
    });
});
