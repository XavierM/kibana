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
const enzyme_1 = require("enzyme");
const react_1 = tslib_1.__importDefault(require("react"));
const header_extension_1 = require("./header_extension");
describe('HeaderExtension', () => {
    it('calls navControl.render with div node', () => {
        const renderSpy = jest.fn();
        enzyme_1.mount(react_1.default.createElement(header_extension_1.HeaderExtension, { extension: renderSpy }));
        expect(renderSpy.mock.calls.length).toEqual(1);
        const [divNode] = renderSpy.mock.calls[0];
        expect(divNode).toBeInstanceOf(HTMLElement);
    });
    it('calls unrender callback when unmounted', () => {
        const unrenderSpy = jest.fn();
        const render = () => unrenderSpy;
        const wrapper = enzyme_1.mount(react_1.default.createElement(header_extension_1.HeaderExtension, { extension: render }));
        wrapper.unmount();
        expect(unrenderSpy.mock.calls.length).toEqual(1);
    });
});
