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
const React = tslib_1.__importStar(require("react"));
const add_panel_flyout_1 = require("./add_panel_flyout");
const contact_card_embeddable_factory_1 = require("../../../../test_samples/embeddables/contact_card/contact_card_embeddable_factory");
const hello_world_container_1 = require("../../../../test_samples/embeddables/hello_world_container");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const mocks_1 = require("../../../../../../../../core/public/mocks");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const mocks_2 = require("../../../../../mocks");
function DummySavedObjectFinder(props) {
    return (React.createElement("div", null,
        React.createElement("div", null, "Hello World"),
        props.children));
}
test('createNewEmbeddable() add embeddable to container', async () => {
    const { setup, doStart } = mocks_2.embeddablePluginMock.createInstance();
    const core = mocks_1.coreMock.createStart();
    const { overlays } = core;
    const contactCardEmbeddableFactory = new contact_card_embeddable_factory_1.ContactCardEmbeddableFactory((() => null), overlays);
    contactCardEmbeddableFactory.getExplicitInput = () => ({
        firstName: 'foo',
        lastName: 'bar',
    });
    setup.registerEmbeddableFactory(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, contactCardEmbeddableFactory);
    const start = doStart();
    const getEmbeddableFactory = start.getEmbeddableFactory;
    const input = {
        id: '1',
        panels: {},
    };
    const container = new hello_world_container_1.HelloWorldContainer(input, { getEmbeddableFactory });
    const onClose = jest.fn();
    const component = enzyme_helpers_1.mountWithIntl(React.createElement(add_panel_flyout_1.AddPanelFlyout, { container: container, onClose: onClose, getFactory: getEmbeddableFactory, getAllFactories: start.getEmbeddableFactories, notifications: core.notifications, SavedObjectFinder: () => null }));
    expect(Object.values(container.getInput().panels).length).toBe(0);
    component.instance().createNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE);
    await new Promise(r => setTimeout(r, 1));
    const ids = Object.keys(container.getInput().panels);
    const embeddableId = ids[0];
    const child = container.getChild(embeddableId);
    expect(child.getInput()).toMatchObject({
        firstName: 'foo',
        lastName: 'bar',
    });
});
test('selecting embeddable in "Create new ..." list calls createNewEmbeddable()', async () => {
    const { setup, doStart } = mocks_2.embeddablePluginMock.createInstance();
    const core = mocks_1.coreMock.createStart();
    const { overlays } = core;
    const contactCardEmbeddableFactory = new contact_card_embeddable_factory_1.ContactCardEmbeddableFactory((() => null), overlays);
    contactCardEmbeddableFactory.getExplicitInput = () => ({
        firstName: 'foo',
        lastName: 'bar',
    });
    setup.registerEmbeddableFactory(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, contactCardEmbeddableFactory);
    const start = doStart();
    const getEmbeddableFactory = start.getEmbeddableFactory;
    const input = {
        id: '1',
        panels: {},
    };
    const container = new hello_world_container_1.HelloWorldContainer(input, { getEmbeddableFactory });
    const onClose = jest.fn();
    const component = enzyme_helpers_1.mountWithIntl(React.createElement(add_panel_flyout_1.AddPanelFlyout, { container: container, onClose: onClose, getFactory: getEmbeddableFactory, getAllFactories: start.getEmbeddableFactories, notifications: core.notifications, SavedObjectFinder: props => React.createElement(DummySavedObjectFinder, Object.assign({}, props)) }));
    const spy = jest.fn();
    component.instance().createNewEmbeddable = spy;
    expect(spy).toHaveBeenCalledTimes(0);
    test_1.findTestSubject(component, 'createNew').simulate('click');
    test_1.findTestSubject(component, `createNew-${contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE}`).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
});
