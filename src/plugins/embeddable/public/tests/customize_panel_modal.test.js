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
const React = tslib_1.__importStar(require("react"));
const lib_1 = require("../lib");
const contact_card_embeddable_factory_1 = require("../lib/test_samples/embeddables/contact_card/contact_card_embeddable_factory");
const hello_world_container_1 = require("../lib/test_samples/embeddables/hello_world_container");
// eslint-disable-next-line
const mocks_1 = require("../../../../core/public/mocks");
const test_plugin_1 = require("./test_plugin");
const customize_panel_modal_1 = require("../lib/panel/panel_header/panel_actions/customize_title/customize_panel_modal");
const enzyme_1 = require("enzyme");
let api;
let container;
let embeddable;
beforeEach(async () => {
    const { doStart, coreStart, uiActions, setup } = test_plugin_1.testPlugin(mocks_1.coreMock.createSetup(), mocks_1.coreMock.createStart());
    const contactCardFactory = new contact_card_embeddable_factory_1.ContactCardEmbeddableFactory(uiActions.executeTriggerActions, {});
    setup.registerEmbeddableFactory(contactCardFactory.type, contactCardFactory);
    api = doStart();
    container = new hello_world_container_1.HelloWorldContainer({ id: '123', panels: {} }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: api.getEmbeddableFactory,
        getAllEmbeddableFactories: api.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    const contactCardEmbeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Joe',
    });
    if (lib_1.isErrorEmbeddable(contactCardEmbeddable)) {
        throw new Error('Error creating new hello world embeddable');
    }
    else {
        embeddable = contactCardEmbeddable;
    }
});
test('Is initialized with the embeddables title', async () => {
    const component = enzyme_1.mount(React.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: embeddable, updateTitle: () => { } }));
    const inputField = test_1.findTestSubject(component, 'customEmbeddablePanelTitleInput').find('input');
    expect(inputField.props().placeholder).toBe(embeddable.getOutput().title);
    expect(inputField.props().placeholder).toBe(embeddable.getOutput().defaultTitle);
    expect(inputField.props().value).toBe('');
});
test('Calls updateTitle with a new title', async () => {
    const updateTitle = jest.fn();
    const component = enzyme_1.mount(React.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: embeddable, updateTitle: updateTitle }));
    const inputField = test_1.findTestSubject(component, 'customEmbeddablePanelTitleInput').find('input');
    const event = { target: { value: 'new title' } };
    inputField.simulate('change', event);
    test_1.findTestSubject(component, 'saveNewTitleButton').simulate('click');
    expect(updateTitle).toBeCalledWith('new title');
});
test('Input value shows custom title if one given', async () => {
    embeddable.updateInput({ title: 'new title' });
    const updateTitle = jest.fn();
    const component = enzyme_1.mount(React.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: embeddable, updateTitle: updateTitle }));
    const inputField = test_1.findTestSubject(component, 'customEmbeddablePanelTitleInput').find('input');
    expect(inputField.props().value).toBe('new title');
    test_1.findTestSubject(component, 'saveNewTitleButton').simulate('click');
    expect(inputField.props().value).toBe('new title');
});
test('Reset updates the input with the default title when the embeddable has no title override', async () => {
    const updateTitle = jest.fn();
    embeddable.updateInput({ title: 'my custom title' });
    const component = enzyme_1.mount(React.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: embeddable, updateTitle: updateTitle }));
    const inputField = test_1.findTestSubject(component, 'customEmbeddablePanelTitleInput').find('input');
    const event = { target: { value: 'another custom title' } };
    inputField.simulate('change', event);
    test_1.findTestSubject(component, 'resetCustomEmbeddablePanelTitle').simulate('click');
    expect(inputField.props().placeholder).toBe(embeddable.getOutput().defaultTitle);
});
test('Reset updates the input with the default title when the embeddable has a title override', async () => {
    const updateTitle = jest.fn();
    const component = enzyme_1.mount(React.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: embeddable, updateTitle: updateTitle }));
    const inputField = test_1.findTestSubject(component, 'customEmbeddablePanelTitleInput').find('input');
    const event = { target: { value: 'new title' } };
    inputField.simulate('change', event);
    test_1.findTestSubject(component, 'resetCustomEmbeddablePanelTitle').simulate('click');
    expect(inputField.props().placeholder).toBe(embeddable.getOutput().defaultTitle);
});
test('Reset calls updateTitle with undefined', async () => {
    const updateTitle = jest.fn();
    const component = enzyme_1.mount(React.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: embeddable, updateTitle: updateTitle }));
    const inputField = test_1.findTestSubject(component, 'customEmbeddablePanelTitleInput').find('input');
    const event = { target: { value: 'new title' } };
    inputField.simulate('change', event);
    test_1.findTestSubject(component, 'resetCustomEmbeddablePanelTitle').simulate('click');
    test_1.findTestSubject(component, 'saveNewTitleButton').simulate('click');
    expect(updateTitle).toBeCalledWith(undefined);
});
test('Can set title to an empty string', async () => {
    const updateTitle = jest.fn();
    const component = enzyme_1.mount(React.createElement(customize_panel_modal_1.CustomizePanelModal, { embeddable: embeddable, updateTitle: updateTitle }));
    const inputField = test_1.findTestSubject(component, 'customizePanelHideTitle');
    inputField.simulate('click');
    test_1.findTestSubject(component, 'saveNewTitleButton').simulate('click');
    expect(inputField.props().value).toBeUndefined();
    expect(updateTitle).toBeCalledWith('');
});
