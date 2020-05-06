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
jest.mock('../lib/url_shortener', () => ({}));
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const share_context_menu_1 = require("./share_context_menu");
const defaultProps = {
    allowEmbed: true,
    allowShortUrl: false,
    shareMenuItems: [],
    sharingData: null,
    isDirty: false,
    onClose: () => { },
    basePath: '',
    post: () => Promise.resolve({}),
    objectType: 'dashboard',
};
test('should render context menu panel when there are more than one panel', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(share_context_menu_1.ShareContextMenu, Object.assign({}, defaultProps)));
    expect(component).toMatchSnapshot();
});
test('should only render permalink panel when there are no other panels', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(share_context_menu_1.ShareContextMenu, Object.assign({}, defaultProps, { allowEmbed: false })));
    expect(component).toMatchSnapshot();
});
describe('shareContextMenuExtensions', () => {
    const shareContextMenuItems = [
        {
            panel: {
                id: '1',
                title: 'AAA panel',
                content: react_1.default.createElement("div", null, "panel content"),
            },
            shareMenuItem: {
                name: 'AAA panel',
                sortOrder: 5,
            },
        },
        {
            panel: {
                id: '2',
                title: 'ZZZ panel',
                content: react_1.default.createElement("div", null, "panel content"),
            },
            shareMenuItem: {
                name: 'ZZZ panel',
                sortOrder: 0,
            },
        },
    ];
    test('should sort ascending on sort order first and then ascending on name', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(share_context_menu_1.ShareContextMenu, Object.assign({}, defaultProps, { allowEmbed: false, shareMenuItems: shareContextMenuItems })));
        expect(component).toMatchSnapshot();
    });
});
