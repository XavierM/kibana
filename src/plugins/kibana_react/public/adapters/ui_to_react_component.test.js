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
const ui_to_react_component_1 = require("./ui_to_react_component");
const react_to_ui_component_1 = require("./react_to_ui_component");
const UiComp = () => ({
    render: (el, { cnt = 0 }) => {
        el.innerHTML = `cnt: ${cnt}`;
    },
});
describe('uiToReactComponent', () => {
    test('can render React component', () => {
        const ReactComp = ui_to_react_component_1.uiToReactComponent(UiComp);
        const div = document.createElement('div');
        ReactDOM.render(React.createElement(ReactComp, null), div);
        expect(div.innerHTML).toBe('<div>cnt: 0</div>');
    });
    test('can pass in props', async () => {
        const ReactComp = ui_to_react_component_1.uiToReactComponent(UiComp);
        const div = document.createElement('div');
        ReactDOM.render(React.createElement(ReactComp, { cnt: 5 }), div);
        expect(div.innerHTML).toBe('<div>cnt: 5</div>');
    });
    test('re-renders when React component is re-rendered', async () => {
        const ReactComp = ui_to_react_component_1.uiToReactComponent(UiComp);
        const div = document.createElement('div');
        ReactDOM.render(React.createElement(ReactComp, { cnt: 1 }), div);
        expect(div.innerHTML).toBe('<div>cnt: 1</div>');
        ReactDOM.render(React.createElement(ReactComp, { cnt: 2 }), div);
        expect(div.innerHTML).toBe('<div>cnt: 2</div>');
    });
    test('does not crash if .unmount() not provided', () => {
        const UiComp2 = () => ({
            render: (el, { cnt = 0 }) => {
                el.innerHTML = `cnt: ${cnt}`;
            },
        });
        const ReactComp = ui_to_react_component_1.uiToReactComponent(UiComp2);
        const div = document.createElement('div');
        ReactDOM.render(React.createElement(ReactComp, { cnt: 1 }), div);
        ReactDOM.unmountComponentAtNode(div);
        expect(div.innerHTML).toBe('');
    });
    test('calls .unmount() method once when component un-mounts', () => {
        const unmount = jest.fn();
        const UiComp2 = () => ({
            render: (el, { cnt = 0 }) => {
                el.innerHTML = `cnt: ${cnt}`;
            },
            unmount,
        });
        const ReactComp = ui_to_react_component_1.uiToReactComponent(UiComp2);
        const div = document.createElement('div');
        expect(unmount).toHaveBeenCalledTimes(0);
        ReactDOM.render(React.createElement(ReactComp, { cnt: 1 }), div);
        expect(unmount).toHaveBeenCalledTimes(0);
        ReactDOM.unmountComponentAtNode(div);
        expect(unmount).toHaveBeenCalledTimes(1);
    });
    test('calls .render() method only once when components mounts, and once on every re-render', () => {
        const render = jest.fn((el, { cnt = 0 }) => {
            el.innerHTML = `cnt: ${cnt}`;
        });
        const UiComp2 = () => ({
            render,
        });
        const ReactComp = ui_to_react_component_1.uiToReactComponent(UiComp2);
        const div = document.createElement('div');
        expect(render).toHaveBeenCalledTimes(0);
        ReactDOM.render(React.createElement(ReactComp, { cnt: 1 }), div);
        expect(render).toHaveBeenCalledTimes(1);
        ReactDOM.render(React.createElement(ReactComp, { cnt: 2 }), div);
        expect(render).toHaveBeenCalledTimes(2);
        ReactDOM.render(React.createElement(ReactComp, { cnt: 3 }), div);
        expect(render).toHaveBeenCalledTimes(3);
    });
    test('can specify wrapper element', async () => {
        const ReactComp = ui_to_react_component_1.uiToReactComponent(UiComp, 'span');
        const div = document.createElement('div');
        ReactDOM.render(React.createElement(ReactComp, { cnt: 5 }), div);
        expect(div.innerHTML).toBe('<span>cnt: 5</span>');
    });
});
test('can adapt component many times', () => {
    const ReactComp = ui_to_react_component_1.uiToReactComponent(react_to_ui_component_1.reactToUiComponent(ui_to_react_component_1.uiToReactComponent(react_to_ui_component_1.reactToUiComponent(ui_to_react_component_1.uiToReactComponent(UiComp)))));
    const div = document.createElement('div');
    ReactDOM.render(React.createElement(ReactComp, null), div);
    expect(div.textContent).toBe('cnt: 0');
    ReactDOM.render(React.createElement(ReactComp, { cnt: 123 }), div);
    expect(div.textContent).toBe('cnt: 123');
});
