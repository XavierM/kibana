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
const mount_1 = require("./mount");
describe('MountWrapper', () => {
    it('renders an html element in react tree', () => {
        const mountPoint = (container) => {
            const el = document.createElement('p');
            el.textContent = 'hello';
            el.className = 'bar';
            container.append(el);
            return () => { };
        };
        const wrapper = react_1.default.createElement(mount_1.MountWrapper, { mount: mountPoint });
        const container = enzyme_1.mount(wrapper);
        expect(container.html()).toMatchInlineSnapshot(`"<div class=\\"kbnMountWrapper\\"><p class=\\"bar\\">hello</p></div>"`);
    });
    it('updates the react tree when the mounted element changes', () => {
        const el = document.createElement('p');
        el.textContent = 'initial';
        const mountPoint = (container) => {
            container.append(el);
            return () => { };
        };
        const wrapper = react_1.default.createElement(mount_1.MountWrapper, { mount: mountPoint });
        const container = enzyme_1.mount(wrapper);
        expect(container.html()).toMatchInlineSnapshot(`"<div class=\\"kbnMountWrapper\\"><p>initial</p></div>"`);
        el.textContent = 'changed';
        container.update();
        expect(container.html()).toMatchInlineSnapshot(`"<div class=\\"kbnMountWrapper\\"><p>changed</p></div>"`);
    });
    it('can render a detached react component', () => {
        const mountPoint = mount_1.mountReactNode(react_1.default.createElement("span", null, "detached"));
        const wrapper = react_1.default.createElement(mount_1.MountWrapper, { mount: mountPoint });
        const container = enzyme_1.mount(wrapper);
        expect(container.html()).toMatchInlineSnapshot(`"<div class=\\"kbnMountWrapper\\"><span>detached</span></div>"`);
    });
    it('accepts a className prop to override default className', () => {
        const mountPoint = mount_1.mountReactNode(react_1.default.createElement("span", null, "detached"));
        const wrapper = react_1.default.createElement(mount_1.MountWrapper, { mount: mountPoint, className: "customClass" });
        const container = enzyme_1.mount(wrapper);
        expect(container.html()).toMatchInlineSnapshot(`"<div class=\\"customClass\\"><span>detached</span></div>"`);
    });
});
