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
const react_to_ui_component_1 = require("./react_to_ui_component");
const ReactComp = ({ cnt = 0 }) => {
    return React.createElement("div", null,
        "cnt: ",
        cnt);
};
describe('reactToUiComponent', () => {
    test('can render UI component', () => {
        const UiComp = react_to_ui_component_1.reactToUiComponent(ReactComp);
        const div = document.createElement('div');
        const instance = UiComp();
        instance.render(div, {});
        expect(div.innerHTML).toBe('<div>cnt: 0</div>');
    });
    test('can pass in props', async () => {
        const UiComp = react_to_ui_component_1.reactToUiComponent(ReactComp);
        const div = document.createElement('div');
        const instance = UiComp();
        instance.render(div, { cnt: 5 });
        expect(div.innerHTML).toBe('<div>cnt: 5</div>');
    });
    test('can re-render multiple times', async () => {
        const UiComp = react_to_ui_component_1.reactToUiComponent(ReactComp);
        const div = document.createElement('div');
        const instance = UiComp();
        instance.render(div, { cnt: 1 });
        expect(div.innerHTML).toBe('<div>cnt: 1</div>');
        instance.render(div, { cnt: 2 });
        expect(div.innerHTML).toBe('<div>cnt: 2</div>');
    });
    test('renders React component only when .render() method is called', () => {
        let renderCnt = 0;
        const MyReactComp = ({ cnt = 0 }) => {
            renderCnt++;
            return React.createElement("div", null,
                "cnt: ",
                cnt);
        };
        const UiComp = react_to_ui_component_1.reactToUiComponent(MyReactComp);
        const instance = UiComp();
        const div = document.createElement('div');
        expect(renderCnt).toBe(0);
        instance.render(div, { cnt: 1 });
        expect(renderCnt).toBe(1);
        instance.render(div, { cnt: 2 });
        expect(renderCnt).toBe(2);
        instance.render(div, { cnt: 3 });
        expect(renderCnt).toBe(3);
    });
});
