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
const url_panel_content_1 = require("./url_panel_content");
const defaultProps = {
    allowShortUrl: true,
    objectType: 'dashboard',
    basePath: '',
    post: () => Promise.resolve({}),
};
test('render', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(url_panel_content_1.UrlPanelContent, Object.assign({}, defaultProps)));
    expect(component).toMatchSnapshot();
});
test('should enable saved object export option when objectId is provided', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(url_panel_content_1.UrlPanelContent, Object.assign({}, defaultProps, { objectId: "id1" })));
    expect(component).toMatchSnapshot();
});
test('should hide short url section when allowShortUrl is false', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(url_panel_content_1.UrlPanelContent, Object.assign({}, defaultProps, { allowShortUrl: false, objectId: "id1" })));
    expect(component).toMatchSnapshot();
});
