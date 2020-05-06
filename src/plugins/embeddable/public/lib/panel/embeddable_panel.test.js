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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const react_2 = require("@kbn/i18n/react");
const triggers_1 = require("../triggers");
const types_1 = require("../types");
const embeddables_1 = require("../embeddables");
const embeddable_panel_1 = require("./embeddable_panel");
const actions_1 = require("../test_samples/actions");
const contact_card_embeddable_factory_1 = require("../test_samples/embeddables/contact_card/contact_card_embeddable_factory");
const hello_world_container_1 = require("../test_samples/embeddables/hello_world_container");
// eslint-disable-next-line
const mocks_1 = require("../../../../inspector/public/mocks");
const eui_1 = require("@elastic/eui");
const mocks_2 = require("../../mocks");
const actionRegistry = new Map();
const triggerRegistry = new Map();
const { setup, doStart } = mocks_2.embeddablePluginMock.createInstance();
const editModeAction = actions_1.createEditModeAction();
const trigger = {
    id: triggers_1.CONTEXT_MENU_TRIGGER,
};
const embeddableFactory = new contact_card_embeddable_factory_1.ContactCardEmbeddableFactory((() => null), {});
actionRegistry.set(editModeAction.id, editModeAction);
triggerRegistry.set(trigger.id, trigger);
setup.registerEmbeddableFactory(embeddableFactory.type, embeddableFactory);
const start = doStart();
const getEmbeddableFactory = start.getEmbeddableFactory;
test('HelloWorldContainer initializes embeddables', async (done) => {
    const container = new hello_world_container_1.HelloWorldContainer({
        id: '123',
        panels: {
            '123': {
                explicitInput: { id: '123', firstName: 'Sam' },
                type: contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE,
            },
        },
    }, { getEmbeddableFactory });
    const subscription = container.getOutput$().subscribe(() => {
        if (container.getOutput().embeddableLoaded['123']) {
            const embeddable = container.getChild('123');
            expect(embeddable).toBeDefined();
            expect(embeddable.id).toBe('123');
            done();
        }
    });
    if (container.getOutput().embeddableLoaded['123']) {
        const embeddable = container.getChild('123');
        expect(embeddable).toBeDefined();
        expect(embeddable.id).toBe('123');
        subscription.unsubscribe();
        done();
    }
});
test('HelloWorldContainer.addNewEmbeddable', async () => {
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {} }, {
        getEmbeddableFactory,
    });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Kibana',
    });
    expect(embeddable).toBeDefined();
    if (!embeddables_1.isErrorEmbeddable(embeddable)) {
        expect(embeddable.getInput().firstName).toBe('Kibana');
    }
    else {
        expect(false).toBe(true);
    }
    const embeddableInContainer = container.getChild(embeddable.id);
    expect(embeddableInContainer).toBeDefined();
    expect(embeddableInContainer.id).toBe(embeddable.id);
});
test('Container view mode change propagates to children', async () => {
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {}, viewMode: types_1.ViewMode.VIEW }, {
        getEmbeddableFactory,
    });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Bob',
    });
    expect(embeddable.getInput().viewMode).toBe(types_1.ViewMode.VIEW);
    container.updateInput({ viewMode: types_1.ViewMode.EDIT });
    expect(embeddable.getInput().viewMode).toBe(types_1.ViewMode.EDIT);
});
test('HelloWorldContainer in view mode hides edit mode actions', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {}, viewMode: types_1.ViewMode.VIEW }, {
        getEmbeddableFactory,
    });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Bob',
    });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(embeddable_panel_1.EmbeddablePanel, { embeddable: embeddable, getActions: () => Promise.resolve([]), getAllEmbeddableFactories: start.getEmbeddableFactories, getEmbeddableFactory: start.getEmbeddableFactory, notifications: {}, application: {}, overlays: {}, inspector: inspector, SavedObjectFinder: () => null })));
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    expect(test_1.findTestSubject(component, `embeddablePanelContextMenuOpen`).length).toBe(1);
    await enzyme_helpers_1.nextTick();
    component.update();
    expect(test_1.findTestSubject(component, `embeddablePanelAction-${editModeAction.id}`).length).toBe(0);
});
const renderInEditModeAndOpenContextMenu = async (embeddableInputs, getActions = () => Promise.resolve([])) => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {}, viewMode: types_1.ViewMode.VIEW }, {
        getEmbeddableFactory,
    });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, embeddableInputs);
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(embeddable_panel_1.EmbeddablePanel, { embeddable: embeddable, getActions: getActions, getAllEmbeddableFactories: start.getEmbeddableFactories, getEmbeddableFactory: start.getEmbeddableFactory, notifications: {}, overlays: {}, application: {}, inspector: inspector, SavedObjectFinder: () => null })));
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    await enzyme_helpers_1.nextTick();
    component.update();
    return { component };
};
test('HelloWorldContainer in edit mode hides disabledActions', async () => {
    const action = {
        id: 'FOO',
        type: 'FOO',
        getIconType: () => undefined,
        getDisplayName: () => 'foo',
        isCompatible: async () => true,
        execute: async () => { },
    };
    const getActions = () => Promise.resolve([action]);
    const { component: component1 } = await renderInEditModeAndOpenContextMenu({
        firstName: 'Bob',
    }, getActions);
    const { component: component2 } = await renderInEditModeAndOpenContextMenu({
        firstName: 'Bob',
        disabledActions: ['FOO'],
    }, getActions);
    const fooContextMenuActionItem1 = test_1.findTestSubject(component1, 'embeddablePanelAction-FOO');
    const fooContextMenuActionItem2 = test_1.findTestSubject(component2, 'embeddablePanelAction-FOO');
    expect(fooContextMenuActionItem1.length).toBe(1);
    expect(fooContextMenuActionItem2.length).toBe(0);
});
test('HelloWorldContainer hides disabled badges', async () => {
    const action = {
        id: 'BAR',
        type: 'BAR',
        getIconType: () => undefined,
        getDisplayName: () => 'bar',
        isCompatible: async () => true,
        execute: async () => { },
    };
    const getActions = () => Promise.resolve([action]);
    const { component: component1 } = await renderInEditModeAndOpenContextMenu({
        firstName: 'Bob',
    }, getActions);
    const { component: component2 } = await renderInEditModeAndOpenContextMenu({
        firstName: 'Bob',
        disabledActions: ['BAR'],
    }, getActions);
    expect(component1.find(eui_1.EuiBadge).length).toBe(1);
    expect(component2.find(eui_1.EuiBadge).length).toBe(0);
});
test('HelloWorldContainer in edit mode shows edit mode actions', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {}, viewMode: types_1.ViewMode.VIEW }, {
        getEmbeddableFactory,
    });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Bob',
    });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(embeddable_panel_1.EmbeddablePanel, { embeddable: embeddable, getActions: () => Promise.resolve([]), getAllEmbeddableFactories: start.getEmbeddableFactories, getEmbeddableFactory: start.getEmbeddableFactory, notifications: {}, overlays: {}, application: {}, inspector: inspector, SavedObjectFinder: () => null })));
    const button = test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon');
    expect(button.length).toBe(1);
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    expect(test_1.findTestSubject(component, `embeddablePanelContextMenuOpen`).length).toBe(1);
    await enzyme_helpers_1.nextTick();
    component.update();
    expect(test_1.findTestSubject(component, `embeddablePanelAction-${editModeAction.id}`).length).toBe(0);
    container.updateInput({ viewMode: types_1.ViewMode.EDIT });
    await enzyme_helpers_1.nextTick();
    component.update();
    // Need to close and re-open to refresh. It doesn't update automatically.
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    await enzyme_helpers_1.nextTick();
    test_1.findTestSubject(component, 'embeddablePanelToggleMenuIcon').simulate('click');
    await enzyme_helpers_1.nextTick();
    expect(test_1.findTestSubject(component, 'embeddablePanelContextMenuOpen').length).toBe(1);
    container.updateInput({ viewMode: types_1.ViewMode.VIEW });
    await enzyme_helpers_1.nextTick();
    component.update();
    // TODO: Fix this.
    // const action = findTestSubject(component, `embeddablePanelAction-${editModeAction.id}`);
    // expect(action.length).toBe(1);
});
test('Updates when hidePanelTitles is toggled', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {}, viewMode: types_1.ViewMode.VIEW, hidePanelTitles: false }, { getEmbeddableFactory });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Rob',
        lastName: 'Stark',
    });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(embeddable_panel_1.EmbeddablePanel, { embeddable: embeddable, getActions: () => Promise.resolve([]), getAllEmbeddableFactories: start.getEmbeddableFactories, getEmbeddableFactory: start.getEmbeddableFactory, notifications: {}, overlays: {}, application: {}, inspector: inspector, SavedObjectFinder: () => null })));
    let title = test_1.findTestSubject(component, `embeddablePanelHeading-HelloRobStark`);
    expect(title.length).toBe(1);
    await container.updateInput({ hidePanelTitles: true });
    await enzyme_helpers_1.nextTick();
    component.update();
    title = test_1.findTestSubject(component, `embeddablePanelHeading-HelloRobStark`);
    expect(title.length).toBe(0);
    await container.updateInput({ hidePanelTitles: false });
    await enzyme_helpers_1.nextTick();
    component.update();
    title = test_1.findTestSubject(component, `embeddablePanelHeading-HelloRobStark`);
    expect(title.length).toBe(1);
});
test('Check when hide header option is false', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {}, viewMode: types_1.ViewMode.VIEW, hidePanelTitles: false }, { getEmbeddableFactory });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Arya',
        lastName: 'Stark',
    });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(embeddable_panel_1.EmbeddablePanel, { embeddable: embeddable, getActions: () => Promise.resolve([]), getAllEmbeddableFactories: start.getEmbeddableFactories, getEmbeddableFactory: start.getEmbeddableFactory, notifications: {}, overlays: {}, application: {}, inspector: inspector, SavedObjectFinder: () => null, hideHeader: false })));
    const title = test_1.findTestSubject(component, `embeddablePanelHeading-HelloAryaStark`);
    expect(title.length).toBe(1);
});
test('Check when hide header option is true', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {}, viewMode: types_1.ViewMode.VIEW, hidePanelTitles: false }, { getEmbeddableFactory });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Arya',
        lastName: 'Stark',
    });
    const component = enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(embeddable_panel_1.EmbeddablePanel, { embeddable: embeddable, getActions: () => Promise.resolve([]), getAllEmbeddableFactories: start.getEmbeddableFactories, getEmbeddableFactory: start.getEmbeddableFactory, notifications: {}, overlays: {}, application: {}, inspector: inspector, SavedObjectFinder: () => null, hideHeader: true })));
    const title = test_1.findTestSubject(component, `embeddablePanelHeading-HelloAryaStark`);
    expect(title.length).toBe(0);
});
