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
const form_row_1 = require("./form_row");
test('renders enabled control', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(form_row_1.FormRow, { label: "test control", id: "controlId", controlIndex: 0 },
        react_1.default.createElement("div", null, "My Control")));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('renders control with warning', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(form_row_1.FormRow, { label: "test control", id: "controlId", controlIndex: 0, warningMsg: "This is a warning" },
        react_1.default.createElement("div", null, "My Control")));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('renders disabled control with tooltip', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(form_row_1.FormRow, { label: "test control", id: "controlId", disableMsg: "I am disabled for testing purposes", controlIndex: 0 },
        react_1.default.createElement("div", null, "My Control")));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
