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
const enzyme_to_json_1 = tslib_1.__importDefault(require("enzyme-to-json"));
const sinon_1 = require("sinon");
const index_1 = require("./index");
const testComponentA = react_1.default.createElement("p", { style: { width: '50px' } }, "A");
const testComponentB = react_1.default.createElement("p", { style: { width: '50px' } }, "B");
describe('Split panel', () => {
    it('should render correctly', () => {
        const panelContainer = enzyme_1.mount(react_1.default.createElement(index_1.PanelsContainer, null,
            react_1.default.createElement(index_1.Panel, null, testComponentA),
            react_1.default.createElement(index_1.Panel, null, testComponentB)));
        expect(enzyme_to_json_1.default(panelContainer)).toMatchSnapshot();
    });
    it('should calculate sizes correctly on mouse drags', () => {
        // Since this test is not running in the browser we can't expect all of the
        // APIs for sizing to be available. The below is a very hacky way of setting
        // the DOMElement width so that we have a lightweight test for width calculation
        // logic.
        const div = enzyme_1.mount(react_1.default.createElement("div", null));
        const proto = div
            .find('div')
            .first()
            .getDOMNode().__proto__;
        const originalGetBoundingClientRect = proto.getBoundingClientRect;
        proto.getBoundingClientRect = sinon_1.spy(() => {
            return {
                width: 1000,
            };
        });
        try {
            // Everything here runs sync.
            let widthsCache = [];
            const onWidthChange = (widths) => {
                widthsCache = widths;
            };
            const panelContainer = enzyme_1.mount(react_1.default.createElement(index_1.PanelsContainer, { onPanelWidthChange: onWidthChange },
                react_1.default.createElement(index_1.Panel, { initialWidth: 50 }, testComponentA),
                react_1.default.createElement(index_1.Panel, { initialWidth: 50 }, testComponentB)));
            const resizer = panelContainer.find(`[data-test-subj~="splitPanelResizer"]`).first();
            resizer.simulate('mousedown', { clientX: 0 });
            resizer.simulate('mousemove', { clientX: 250 });
            resizer.simulate('mouseup');
            panelContainer.update();
            expect(widthsCache).toEqual([125, 75]);
        }
        finally {
            proto.getBoundingClientRect = originalGetBoundingClientRect;
        }
    });
});
