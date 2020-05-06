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
const enzyme_1 = require("enzyme");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const react_2 = require("@kbn/i18n/react");
const embeddable_plugin_1 = require("../../embeddable_plugin");
const dashboard_container_1 = require("../embeddable/dashboard_container");
const test_helpers_1 = require("../test_helpers");
const embeddable_plugin_test_samples_1 = require("../../embeddable_plugin_test_samples");
const mocks_1 = require("../../../../embeddable/public/mocks");
const mocks_2 = require("../../../../inspector/public/mocks");
const public_1 = require("../../../../kibana_react/public");
const mocks_3 = require("../../../../ui_actions/public/mocks");
test('DashboardContainer in edit mode shows edit mode actions', async () => {
    const inspector = mocks_2.inspectorPluginMock.createStartContract();
    const { setup, doStart } = mocks_1.embeddablePluginMock.createInstance();
    const uiActionsSetup = mocks_3.uiActionsPluginMock.createSetupContract();
    const editModeAction = embeddable_plugin_test_samples_1.createEditModeAction();
    uiActionsSetup.registerAction(editModeAction);
    uiActionsSetup.attachAction(embeddable_plugin_1.CONTEXT_MENU_TRIGGER, editModeAction);
    setup.registerEmbeddableFactory(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, new embeddable_plugin_test_samples_1.ContactCardEmbeddableFactory((() => null), {}));
    const start = doStart();
    const initialInput = test_helpers_1.getSampleDashboardInput({ viewMode: embeddable_plugin_1.ViewMode.VIEW });
    const options = {
        application: {},
        embeddable: start,
        notifications: {},
        overlays: {},
        inspector: {},
        SavedObjectFinder: () => null,
        ExitFullScreenButton: () => null,
        uiActions: {},
    };
    const container = new dashboard_container_1.DashboardContainer(initialInput, options);
    const embeddable = await container.addNewEmbeddable(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Bob',
    });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(public_1.KibanaContextProvider, { services: options },
            react_1.default.createElement(embeddable_plugin_1.EmbeddablePanel, { embeddable: embeddable, getActions: () => Promise.resolve([]), getAllEmbeddableFactories: (() => []), getEmbeddableFactory: (() => null), notifications: {}, application: {}, overlays: {}, inspector: inspector, SavedObjectFinder: () => null }))));
    const button = test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon');
    expect(button.length).toBe(1);
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    expect(test_1.findTestSubject(component, `embeddablePanelContextMenuOpen`).length).toBe(1);
    const editAction = test_1.findTestSubject(component, `embeddablePanelAction-${editModeAction.id}`);
    expect(editAction.length).toBe(0);
    container.updateInput({ viewMode: embeddable_plugin_1.ViewMode.EDIT });
    await enzyme_helpers_1.nextTick();
    component.update();
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    await enzyme_helpers_1.nextTick();
    component.update();
    expect(test_1.findTestSubject(component, 'embeddablePanelContextMenuOpen').length).toBe(0);
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    await enzyme_helpers_1.nextTick();
    component.update();
    expect(test_1.findTestSubject(component, 'embeddablePanelContextMenuOpen').length).toBe(1);
    await enzyme_helpers_1.nextTick();
    component.update();
    // TODO: Address this.
    // const action = findTestSubject(component, `embeddablePanelAction-${editModeAction.id}`);
    // expect(action.length).toBe(1);
});
