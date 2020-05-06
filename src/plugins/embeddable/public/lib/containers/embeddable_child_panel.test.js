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
const embeddable_child_panel_1 = require("./embeddable_child_panel");
const contact_card_embeddable_factory_1 = require("../test_samples/embeddables/contact_card/contact_card_embeddable_factory");
const slow_contact_card_embeddable_factory_1 = require("../test_samples/embeddables/contact_card/slow_contact_card_embeddable_factory");
const hello_world_container_1 = require("../test_samples/embeddables/hello_world_container");
// eslint-disable-next-line
const mocks_1 = require("../../../../inspector/public/mocks");
const enzyme_1 = require("enzyme");
const mocks_2 = require("../../mocks");
test('EmbeddableChildPanel renders an embeddable when it is done loading', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const { setup, doStart } = mocks_2.embeddablePluginMock.createInstance();
    setup.registerEmbeddableFactory(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, new slow_contact_card_embeddable_factory_1.SlowContactCardEmbeddableFactory({ execAction: (() => null) }));
    const start = doStart();
    const getEmbeddableFactory = start.getEmbeddableFactory;
    const container = new hello_world_container_1.HelloWorldContainer({ id: 'hello', panels: {} }, {
        getEmbeddableFactory,
    });
    const newEmbeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Theon',
        lastName: 'Greyjoy',
        id: '123',
    });
    expect(newEmbeddable.id).toBeDefined();
    const component = enzyme_1.mount(react_1.default.createElement(embeddable_child_panel_1.EmbeddableChildPanel, { container: container, embeddableId: newEmbeddable.id, getActions: () => Promise.resolve([]), getAllEmbeddableFactories: start.getEmbeddableFactories, getEmbeddableFactory: getEmbeddableFactory, notifications: {}, application: {}, overlays: {}, inspector: inspector, SavedObjectFinder: () => null }));
    await enzyme_helpers_1.nextTick();
    component.update();
    // Due to the way embeddables mount themselves on the dom node, they are not forced to be
    // react components, and hence, we can't use the usual
    // findTestSubject(component, 'embeddablePanelHeading-HelloTheonGreyjoy');
    expect(component
        .getDOMNode()
        .querySelectorAll('[data-test-subj="embeddablePanelHeading-HelloTheonGreyjoy"]').length).toBe(1);
});
test(`EmbeddableChildPanel renders an error message if the factory doesn't exist`, async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const getEmbeddableFactory = () => undefined;
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: { '1': { type: 'idontexist', explicitInput: { id: '1' } } },
    }, { getEmbeddableFactory });
    const component = enzyme_1.mount(react_1.default.createElement(embeddable_child_panel_1.EmbeddableChildPanel, { container: container, embeddableId: '1', getActions: () => Promise.resolve([]), getAllEmbeddableFactories: (() => []), getEmbeddableFactory: (() => undefined), notifications: {}, overlays: {}, application: {}, inspector: inspector, SavedObjectFinder: () => null }));
    await enzyme_helpers_1.nextTick();
    component.update();
    expect(component.getDOMNode().querySelectorAll('[data-test-subj="embeddableStackError"]').length).toBe(1);
});
