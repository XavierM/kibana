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
const React = tslib_1.__importStar(require("react"));
const ReactDOM = tslib_1.__importStar(require("react-dom"));
const mocks_1 = require("../../../core/public/mocks");
const management_app_1 = require("./management_app");
// @ts-ignore
const legacy_1 = require("./legacy");
function createTestApp() {
    const legacySection = new legacy_1.LegacyManagementSection('legacy');
    return new management_app_1.ManagementApp({
        id: 'test-app',
        title: 'Test App',
        basePath: '',
        mount(params) {
            params.setBreadcrumbs([{ text: 'Test App' }]);
            ReactDOM.render(React.createElement("div", null, "Test App - Hello world!"), params.element);
            return () => {
                ReactDOM.unmountComponentAtNode(params.element);
            };
        },
    }, () => [], jest.fn(), () => legacySection, mocks_1.coreMock.createSetup().getStartServices);
}
test('Management app can mount and unmount', async () => {
    const testApp = createTestApp();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const unmount = testApp.mount({ element: container, basePath: '', setBreadcrumbs: jest.fn() });
    expect(container).toMatchSnapshot();
    (await unmount)();
    expect(container).toMatchSnapshot();
});
test('Enabled by default, can disable', () => {
    const testApp = createTestApp();
    expect(testApp.enabled).toBe(true);
    testApp.disable();
    expect(testApp.enabled).toBe(false);
});
