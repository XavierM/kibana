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
const sinon_1 = tslib_1.__importDefault(require("sinon"));
const exit_full_screen_button_1 = require("./exit_full_screen_button");
const eui_1 = require("@elastic/eui");
const enzyme_1 = require("enzyme");
test('is rendered', () => {
    const component = enzyme_1.mount(react_1.default.createElement(exit_full_screen_button_1.ExitFullScreenButton, { onExitFullScreenMode: () => { } }));
    expect(component).toMatchSnapshot();
});
describe('onExitFullScreenMode', () => {
    test('is called when the button is pressed', () => {
        const onExitHandler = sinon_1.default.stub();
        const component = enzyme_1.mount(react_1.default.createElement(exit_full_screen_button_1.ExitFullScreenButton, { onExitFullScreenMode: onExitHandler }));
        component.find('button').simulate('click');
        sinon_1.default.assert.calledOnce(onExitHandler);
    });
    test('is called when the ESC key is pressed', () => {
        const onExitHandler = sinon_1.default.stub();
        enzyme_1.mount(react_1.default.createElement(exit_full_screen_button_1.ExitFullScreenButton, { onExitFullScreenMode: onExitHandler }));
        const escapeKeyEvent = new KeyboardEvent('keydown', { keyCode: eui_1.keyCodes.ESCAPE });
        document.dispatchEvent(escapeKeyEvent);
        sinon_1.default.assert.calledOnce(onExitHandler);
    });
});
