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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const dashboard_empty_screen_1 = require("./dashboard_empty_screen");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const mocks_1 = require("../../../../core/public/mocks");
describe('DashboardEmptyScreen', () => {
    const setupMock = mocks_1.coreMock.createSetup();
    const defaultProps = {
        showLinkToVisualize: true,
        onLinkClick: jest.fn(),
        uiSettings: setupMock.uiSettings,
        http: setupMock.http,
    };
    function mountComponent(props) {
        const compProps = props || defaultProps;
        return enzyme_helpers_1.mountWithIntl(react_1.default.createElement(dashboard_empty_screen_1.DashboardEmptyScreen, Object.assign({}, compProps)));
    }
    test('renders correctly with visualize paragraph', () => {
        const component = mountComponent();
        expect(component).toMatchSnapshot();
        const paragraph = test_1.findTestSubject(component, 'linkToVisualizeParagraph');
        expect(paragraph.length).toBe(1);
    });
    test('renders correctly without visualize paragraph', () => {
        const component = mountComponent({ ...defaultProps, ...{ showLinkToVisualize: false } });
        expect(component).toMatchSnapshot();
        const linkToVisualizeParagraph = test_1.findTestSubject(component, 'linkToVisualizeParagraph');
        expect(linkToVisualizeParagraph.length).toBe(0);
        const enterEditModeParagraph = component.find('.dshStartScreen__panelDesc');
        expect(enterEditModeParagraph.length).toBe(1);
    });
    test('when specified, prop onVisualizeClick is called correctly', () => {
        const onVisualizeClick = jest.fn();
        const component = mountComponent({
            ...defaultProps,
            ...{ showLinkToVisualize: true, onVisualizeClick },
        });
        const button = test_1.findTestSubject(component, 'addVisualizationButton');
        button.simulate('click');
        expect(onVisualizeClick).toHaveBeenCalled();
    });
    test('renders correctly with readonly mode', () => {
        const component = mountComponent({ ...defaultProps, ...{ isReadonlyMode: true } });
        expect(component).toMatchSnapshot();
        const paragraph = component.find('.dshStartScreen__panelDesc');
        expect(paragraph.length).toBe(0);
    });
});
