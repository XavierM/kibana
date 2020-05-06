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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const inspector_panel_1 = require("./inspector_panel");
describe('InspectorPanel', () => {
    let adapters;
    let views;
    beforeEach(() => {
        adapters = {
            foodapter: {
                foo() {
                    return 42;
                },
            },
            bardapter: {},
        };
        views = [
            {
                title: 'View 1',
                order: 200,
                component: () => react_1.default.createElement("h1", null, "View 1"),
            },
            {
                title: 'Foo View',
                order: 100,
                component: () => react_1.default.createElement("h1", null, "Foo view"),
                shouldShow(adapters2) {
                    return adapters2.foodapter;
                },
            },
            {
                title: 'Never',
                order: 200,
                component: () => null,
                shouldShow() {
                    return false;
                },
            },
        ];
    });
    it('should render as expected', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(inspector_panel_1.InspectorPanel, { adapters: adapters, views: views }));
        expect(component).toMatchSnapshot();
    });
    it('should not allow updating adapters', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(inspector_panel_1.InspectorPanel, { adapters: adapters, views: views }));
        adapters.notAllowed = {};
        expect(() => component.setProps({ adapters })).toThrow();
    });
});
