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
const rxjs_1 = require("rxjs");
const test_utils_1 = require("react-dom/test-utils");
const enzyme_1 = require("enzyme");
const react_1 = tslib_1.__importDefault(require("react"));
const app_containers_1 = require("./app_containers");
describe('AppWrapper', () => {
    it('toggles the `hidden-chrome` class depending on the chrome visibility state', () => {
        const chromeVisible$ = new rxjs_1.BehaviorSubject(true);
        const component = enzyme_1.mount(react_1.default.createElement(app_containers_1.AppWrapper, { "chromeVisible$": chromeVisible$ }, "app-content"));
        expect(component.getDOMNode()).toMatchInlineSnapshot(`
      <div
        class="app-wrapper"
      >
        app-content
      </div>
    `);
        test_utils_1.act(() => chromeVisible$.next(false));
        component.update();
        expect(component.getDOMNode()).toMatchInlineSnapshot(`
      <div
        class="app-wrapper hidden-chrome"
      >
        app-content
      </div>
    `);
        test_utils_1.act(() => chromeVisible$.next(true));
        component.update();
        expect(component.getDOMNode()).toMatchInlineSnapshot(`
      <div
        class="app-wrapper"
      >
        app-content
      </div>
    `);
    });
});
describe('AppContainer', () => {
    it('adds classes supplied by chrome', () => {
        const appClasses$ = new rxjs_1.BehaviorSubject([]);
        const component = enzyme_1.mount(react_1.default.createElement(app_containers_1.AppContainer, { "classes$": appClasses$ }, "app-content"));
        expect(component.getDOMNode()).toMatchInlineSnapshot(`
      <div
        class="application"
      >
        app-content
      </div>
    `);
        test_utils_1.act(() => appClasses$.next(['classA', 'classB']));
        component.update();
        expect(component.getDOMNode()).toMatchInlineSnapshot(`
      <div
        class="application classA classB"
      >
        app-content
      </div>
    `);
        test_utils_1.act(() => appClasses$.next(['classC']));
        component.update();
        expect(component.getDOMNode()).toMatchInlineSnapshot(`
      <div
        class="application classC"
      >
        app-content
      </div>
    `);
        test_utils_1.act(() => appClasses$.next([]));
        component.update();
        expect(component.getDOMNode()).toMatchInlineSnapshot(`
      <div
        class="application"
      >
        app-content
      </div>
    `);
    });
});
