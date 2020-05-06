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
const test_1 = require("@elastic/eui/lib/test");
const react_1 = tslib_1.__importDefault(require("react"));
const operators_1 = require("rxjs/operators");
const enzyme_1 = require("enzyme");
const react_2 = require("@kbn/i18n/react");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const dashboard_viewport_1 = require("./dashboard_viewport");
const dashboard_container_1 = require("../dashboard_container");
const test_helpers_1 = require("../../test_helpers");
const embeddable_plugin_test_samples_1 = require("../../../embeddable_plugin_test_samples");
const public_1 = require("../../../../../kibana_react/public");
// eslint-disable-next-line
const mocks_1 = require("src/plugins/embeddable/public/mocks");
let dashboardContainer;
const ExitFullScreenButton = () => react_1.default.createElement("div", { "data-test-subj": "exitFullScreenModeText" }, "EXIT");
function getProps(props) {
    const { setup, doStart } = mocks_1.embeddablePluginMock.createInstance();
    setup.registerEmbeddableFactory(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, new embeddable_plugin_test_samples_1.ContactCardEmbeddableFactory((() => null), {}));
    const start = doStart();
    const options = {
        application: {},
        embeddable: {
            getTriggerCompatibleActions: (() => []),
            getEmbeddableFactories: start.getEmbeddableFactories,
            getEmbeddableFactory: start.getEmbeddableFactory,
        },
        notifications: {},
        overlays: {},
        inspector: {
            isAvailable: jest.fn(),
        },
        SavedObjectFinder: () => null,
        ExitFullScreenButton,
        uiActions: {
            getTriggerCompatibleActions: (() => []),
        },
    };
    const input = test_helpers_1.getSampleDashboardInput({
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
    dashboardContainer = new dashboard_container_1.DashboardContainer(input, options);
    const defaultTestProps = {
        container: dashboardContainer,
    };
    return {
        props: Object.assign(defaultTestProps, props),
        options,
    };
}
test('renders DashboardViewport', () => {
    const { props, options } = getProps();
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
            react_1.default.createElement(dashboard_viewport_1.DashboardViewport, Object.assign({}, props)))));
    const panels = test_1.findTestSubject(component, 'dashboardPanel');
    expect(panels.length).toBe(2);
});
test('renders DashboardViewport with no visualizations', () => {
    const { props, options } = getProps();
    props.container.updateInput({ panels: {} });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
            react_1.default.createElement(dashboard_viewport_1.DashboardViewport, Object.assign({}, props)))));
    const panels = test_1.findTestSubject(component, 'dashboardPanel');
    expect(panels.length).toBe(0);
    component.unmount();
});
test('renders DashboardEmptyScreen', () => {
    const renderEmptyScreen = jest.fn();
    const { props, options } = getProps({ renderEmpty: renderEmptyScreen });
    props.container.updateInput({ isEmptyState: true });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
            react_1.default.createElement(dashboard_viewport_1.DashboardViewport, Object.assign({}, props)))));
    const dashboardEmptyScreenDiv = component.find('.dshDashboardEmptyScreen');
    expect(dashboardEmptyScreenDiv.length).toBe(1);
    expect(renderEmptyScreen).toHaveBeenCalled();
    component.unmount();
});
test('renders exit full screen button when in full screen mode', async () => {
    const { props, options } = getProps();
    props.container.updateInput({ isFullScreenMode: true });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
            react_1.default.createElement(dashboard_viewport_1.DashboardViewport, Object.assign({}, props)))));
    expect(component
        .find('.dshDashboardViewport')
        .childAt(0)
        .type().name).toBe('ExitFullScreenButton');
    props.container.updateInput({ isFullScreenMode: false });
    component.update();
    await enzyme_helpers_1.nextTick();
    expect(component
        .find('.dshDashboardViewport')
        .childAt(0)
        .type().name).not.toBe('ExitFullScreenButton');
    component.unmount();
});
test('renders exit full screen button when in full screen mode and empty screen', async () => {
    const renderEmptyScreen = jest.fn();
    renderEmptyScreen.mockReturnValue(react_1.default.createElement('div'));
    const { props, options } = getProps({ renderEmpty: renderEmptyScreen });
    props.container.updateInput({ isEmptyState: true, isFullScreenMode: true });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
            react_1.default.createElement(dashboard_viewport_1.DashboardViewport, Object.assign({}, props)))));
    expect(component
        .find('.dshDashboardEmptyScreen')
        .childAt(0)
        .type().name).toBe('ExitFullScreenButton');
    props.container.updateInput({ isFullScreenMode: false });
    component.update();
    await enzyme_helpers_1.nextTick();
    expect(component
        .find('.dshDashboardEmptyScreen')
        .childAt(0)
        .type().name).not.toBe('ExitFullScreenButton');
    component.unmount();
});
test('DashboardViewport unmount unsubscribes', async (done) => {
    const { props, options } = getProps();
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
            react_1.default.createElement(dashboard_viewport_1.DashboardViewport, Object.assign({}, props)))));
    component.unmount();
    props.container
        .getInput$()
        .pipe(operators_1.skip(1))
        .subscribe(() => {
        done();
    });
    props.container.updateInput({ panels: {} });
});
