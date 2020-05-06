"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const doc_viewer_1 = require("./doc_viewer");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const services_1 = require("../../services");
jest.mock('../../services', () => {
    let registry = [];
    return {
        getDocViewsRegistry: () => ({
            addDocView(view) {
                registry.push(view);
            },
            getDocViewsSorted() {
                return registry;
            },
            resetRegistry: () => {
                registry = [];
            },
        }),
    };
});
beforeEach(() => {
    services_1.getDocViewsRegistry().resetRegistry();
    jest.clearAllMocks();
});
test('Render <DocViewer/> with 3 different tabs', () => {
    const registry = services_1.getDocViewsRegistry();
    registry.addDocView({ order: 10, title: 'Render function', render: jest.fn() });
    registry.addDocView({ order: 20, title: 'React component', component: () => react_1.default.createElement("div", null, "test") });
    registry.addDocView({ order: 30, title: 'Invalid doc view' });
    const renderProps = { hit: {} };
    const wrapper = enzyme_1.shallow(react_1.default.createElement(doc_viewer_1.DocViewer, Object.assign({}, renderProps)));
    expect(wrapper).toMatchSnapshot();
});
test('Render <DocViewer/> with 1 tab displaying error message', () => {
    function SomeComponent() {
        // this is just a placeholder
        return null;
    }
    const registry = services_1.getDocViewsRegistry();
    registry.addDocView({
        order: 10,
        title: 'React component',
        component: SomeComponent,
    });
    const renderProps = { hit: {} };
    const errorMsg = 'Catch me if you can!';
    const wrapper = enzyme_1.mount(react_1.default.createElement(doc_viewer_1.DocViewer, Object.assign({}, renderProps)));
    const error = new Error(errorMsg);
    wrapper.find(SomeComponent).simulateError(error);
    const errorMsgComponent = test_1.findTestSubject(wrapper, 'docViewerError');
    expect(errorMsgComponent.text()).toMatch(new RegExp(`${errorMsg}`));
});
