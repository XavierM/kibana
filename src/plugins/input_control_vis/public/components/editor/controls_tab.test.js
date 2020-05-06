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
const test_utils_1 = require("../../test_utils");
const controls_tab_1 = require("./controls_tab");
const indexPatternsMock = {
    get: test_utils_1.getIndexPatternMock,
};
let props;
beforeEach(() => {
    props = {
        deps: test_utils_1.getDepsMock(),
        vis: {
            API: {
                indexPatterns: indexPatternsMock,
            },
            type: {
                name: 'test',
                title: 'test',
                visualization: null,
                requestHandler: 'test',
                responseHandler: 'test',
                stage: 'beta',
                requiresSearch: false,
                hidden: false,
            },
        },
        stateParams: {
            controls: [
                {
                    id: '1',
                    indexPattern: 'indexPattern1',
                    fieldName: 'keywordField',
                    label: 'custom label',
                    type: 'list',
                    options: {
                        type: 'terms',
                        multiselect: true,
                        size: 5,
                        order: 'desc',
                    },
                    parent: 'parent',
                },
                {
                    id: '2',
                    indexPattern: 'indexPattern1',
                    fieldName: 'numberField',
                    label: '',
                    type: 'range',
                    options: {
                        step: 1,
                    },
                    parent: 'parent',
                },
            ],
        },
        setValue: jest.fn(),
        intl: null,
    };
});
test('renders ControlsTab', () => {
    const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(controls_tab_1.ControlsTab.WrappedComponent, Object.assign({}, props)));
    expect(component).toMatchSnapshot();
});
describe('behavior', () => {
    test('add control button', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(controls_tab_1.ControlsTab.WrappedComponent, Object.assign({}, props)));
        test_1.findTestSubject(component, 'inputControlEditorAddBtn').simulate('click');
        // // Use custom match function since control.id is dynamically generated and never the same.
        expect(props.setValue).toHaveBeenCalledWith('controls', expect.arrayContaining(props.stateParams.controls));
        expect(props.setValue.mock.calls[0][1].length).toEqual(3);
    });
    test('remove control button', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(controls_tab_1.ControlsTab.WrappedComponent, Object.assign({}, props)));
        test_1.findTestSubject(component, 'inputControlEditorRemoveControl0').simulate('click');
        const expectedParams = [
            'controls',
            [
                {
                    id: '2',
                    indexPattern: 'indexPattern1',
                    fieldName: 'numberField',
                    label: '',
                    type: 'range',
                    parent: 'parent',
                    options: {
                        step: 1,
                    },
                },
            ],
        ];
        expect(props.setValue).toHaveBeenCalledWith(...expectedParams);
    });
    test('move down control button', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(controls_tab_1.ControlsTab.WrappedComponent, Object.assign({}, props)));
        test_1.findTestSubject(component, 'inputControlEditorMoveDownControl0').simulate('click');
        const expectedParams = [
            'controls',
            [
                {
                    id: '2',
                    indexPattern: 'indexPattern1',
                    fieldName: 'numberField',
                    label: '',
                    type: 'range',
                    parent: 'parent',
                    options: {
                        step: 1,
                    },
                },
                {
                    id: '1',
                    indexPattern: 'indexPattern1',
                    fieldName: 'keywordField',
                    label: 'custom label',
                    type: 'list',
                    parent: 'parent',
                    options: {
                        type: 'terms',
                        multiselect: true,
                        size: 5,
                        order: 'desc',
                    },
                },
            ],
        ];
        expect(props.setValue).toHaveBeenCalledWith(...expectedParams);
    });
    test('move up control button', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(controls_tab_1.ControlsTab.WrappedComponent, Object.assign({}, props)));
        test_1.findTestSubject(component, 'inputControlEditorMoveUpControl1').simulate('click');
        const expectedParams = [
            'controls',
            [
                {
                    id: '2',
                    indexPattern: 'indexPattern1',
                    fieldName: 'numberField',
                    label: '',
                    type: 'range',
                    parent: 'parent',
                    options: {
                        step: 1,
                    },
                },
                {
                    id: '1',
                    indexPattern: 'indexPattern1',
                    fieldName: 'keywordField',
                    label: 'custom label',
                    type: 'list',
                    parent: 'parent',
                    options: {
                        type: 'terms',
                        multiselect: true,
                        size: 5,
                        order: 'desc',
                    },
                },
            ],
        ];
        expect(props.setValue).toHaveBeenCalledWith(...expectedParams);
    });
});
