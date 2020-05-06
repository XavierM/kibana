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
// @ts-ignore
const react_sizeme_1 = tslib_1.__importDefault(require("react-sizeme"));
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const operators_1 = require("rxjs/operators");
const dashboard_grid_1 = require("./dashboard_grid");
const dashboard_container_1 = require("../dashboard_container");
const test_helpers_1 = require("../../test_helpers");
const embeddable_plugin_test_samples_1 = require("../../../embeddable_plugin_test_samples");
const public_1 = require("../../../../../kibana_react/public");
// eslint-disable-next-line
const mocks_1 = require("src/plugins/embeddable/public/mocks");
let dashboardContainer;
function prepare(props) {
    const { setup, doStart } = mocks_1.embeddablePluginMock.createInstance();
    setup.registerEmbeddableFactory(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, new embeddable_plugin_test_samples_1.ContactCardEmbeddableFactory((() => null), {}));
    const start = doStart();
    const getEmbeddableFactory = start.getEmbeddableFactory;
    const initialInput = test_helpers_1.getSampleDashboardInput({
        panels: {
            '1': {
                gridData: { x: 0, y: 0, w: 6, h: 6, i: '1' },
                type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
                explicitInput: { id: '1' },
            },
            '2': {
                gridData: { x: 6, y: 6, w: 6, h: 6, i: '2' },
                type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
                explicitInput: { id: '2' },
            },
        },
    });
    const options = {
        application: {},
        embeddable: {
            getTriggerCompatibleActions: (() => []),
            getEmbeddableFactories: start.getEmbeddableFactories,
            getEmbeddableFactory,
        },
        notifications: {},
        overlays: {},
        inspector: {
            isAvailable: jest.fn(),
        },
        SavedObjectFinder: () => null,
        ExitFullScreenButton: () => null,
        uiActions: {
            getTriggerCompatibleActions: (() => []),
        },
    };
    dashboardContainer = new dashboard_container_1.DashboardContainer(initialInput, options);
    const defaultTestProps = {
        container: dashboardContainer,
        kibana: null,
        intl: null,
    };
    return {
        props: Object.assign(defaultTestProps, props),
        options,
    };
}
beforeAll(() => {
    // sizeme detects the width to be 0 in our test environment. noPlaceholder will mean that the grid contents will
    // get rendered even when width is 0, which will improve our tests.
    react_sizeme_1.default.noPlaceholders = true;
});
afterAll(() => {
    react_sizeme_1.default.noPlaceholders = false;
});
test('renders DashboardGrid', () => {
    const { props, options } = prepare();
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
        react_1.default.createElement(dashboard_grid_1.DashboardGrid, Object.assign({}, props))));
    const panelElements = component.find('EmbeddableChildPanel');
    expect(panelElements.length).toBe(2);
});
test('renders DashboardGrid with no visualizations', () => {
    const { props, options } = prepare();
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
        react_1.default.createElement(dashboard_grid_1.DashboardGrid, Object.assign({}, props))));
    props.container.updateInput({ panels: {} });
    component.update();
    expect(component.find('EmbeddableChildPanel').length).toBe(0);
});
test('DashboardGrid removes panel when removed from container', () => {
    const { props, options } = prepare();
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
        react_1.default.createElement(dashboard_grid_1.DashboardGrid, Object.assign({}, props))));
    const originalPanels = props.container.getInput().panels;
    const filteredPanels = { ...originalPanels };
    delete filteredPanels['1'];
    props.container.updateInput({ panels: filteredPanels });
    component.update();
    const panelElements = component.find('EmbeddableChildPanel');
    expect(panelElements.length).toBe(1);
});
test('DashboardGrid renders expanded panel', () => {
    const { props, options } = prepare();
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
        react_1.default.createElement(dashboard_grid_1.DashboardGrid, Object.assign({}, props))));
    props.container.updateInput({ expandedPanelId: '1' });
    component.update();
    // Both panels should still exist in the dom, so nothing needs to be re-fetched once minimized.
    expect(component.find('EmbeddableChildPanel').length).toBe(2);
    expect(component.find('DashboardGridUi').state().expandedPanelId).toBe('1');
    props.container.updateInput({ expandedPanelId: undefined });
    component.update();
    expect(component.find('EmbeddableChildPanel').length).toBe(2);
    expect(component.find('DashboardGridUi').state().expandedPanelId).toBeUndefined();
});
test('DashboardGrid unmount unsubscribes', async (done) => {
    const { props, options } = prepare();
    const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
        react_1.default.createElement(dashboard_grid_1.DashboardGrid, Object.assign({}, props))));
    component.unmount();
    props.container
        .getInput$()
        .pipe(operators_1.skip(1))
        .subscribe(() => {
        done();
    });
    props.container.updateInput({ expandedPanelId: '1' });
});
