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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const error_toast_1 = require("./error_toast");
let openModal;
beforeEach(() => (openModal = jest.fn()));
function render(props = {}) {
    return (react_1.default.createElement(error_toast_1.ErrorToast, { openModal: openModal, error: props.error || new Error('error message'), title: props.title || 'An error occured', toastMessage: props.toastMessage || 'This is the toast message', i18nContext: () => ({ children }) => react_1.default.createElement(react_1.default.Fragment, null, children) }));
}
it('renders matching snapshot', () => {
    expect(enzyme_1.shallow(render())).toMatchSnapshot();
});
it('should open a modal when clicking button', () => {
    const wrapper = enzyme_helpers_1.mountWithIntl(render());
    expect(openModal).not.toHaveBeenCalled();
    wrapper.find('button').simulate('click');
    expect(openModal).toHaveBeenCalled();
});
afterAll(() => {
    // Cleanup document.body to cleanup any modals which might be left over from tests.
    document.body.innerHTML = '';
});
