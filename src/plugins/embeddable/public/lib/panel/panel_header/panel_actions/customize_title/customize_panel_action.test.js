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
const __1 = require("../../../..");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const customize_panel_action_1 = require("./customize_panel_action");
const contact_card_embeddable_factory_1 = require("../../../../test_samples/embeddables/contact_card/contact_card_embeddable_factory");
const hello_world_container_1 = require("../../../../test_samples/embeddables/hello_world_container");
const mocks_1 = require("../../../../../mocks");
let container;
let embeddable;
function createHelloWorldContainer(input = { id: '123', panels: {} }) {
    const { setup, doStart } = mocks_1.embeddablePluginMock.createInstance();
    setup.registerEmbeddableFactory(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, new contact_card_embeddable_factory_1.ContactCardEmbeddableFactory((() => { }), {}));
    const getEmbeddableFactory = doStart().getEmbeddableFactory;
    return new hello_world_container_1.HelloWorldContainer(input, { getEmbeddableFactory });
}
beforeEach(async () => {
    container = createHelloWorldContainer();
    const contactCardEmbeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        id: 'robert',
        firstName: 'Robert',
        lastName: 'Baratheon',
    });
    if (__1.isErrorEmbeddable(contactCardEmbeddable)) {
        throw new Error('Error creating new hello world embeddable');
    }
    else {
        embeddable = contactCardEmbeddable;
    }
});
test('Updates the embeddable title when given', async (done) => {
    const getUserData = () => Promise.resolve({ title: 'What is up?' });
    const customizePanelAction = new customize_panel_action_1.CustomizePanelTitleAction(getUserData);
    expect(embeddable.getInput().title).toBeUndefined();
    expect(embeddable.getTitle()).toBe('Hello Robert Baratheon');
    await customizePanelAction.execute({ embeddable });
    await enzyme_helpers_1.nextTick();
    expect(embeddable.getTitle()).toBe('What is up?');
    expect(embeddable.getInput().title).toBe('What is up?');
    // Recreating the container should preserve the custom title.
    const containerClone = createHelloWorldContainer(container.getInput());
    // Need to wait for the container to tell us the embeddable has been loaded.
    const subscription = containerClone.getOutput$().subscribe(() => {
        if (containerClone.getOutput().embeddableLoaded[embeddable.id]) {
            expect(embeddable.getInput().title).toBe('What is up?');
            subscription.unsubscribe();
            done();
        }
    });
});
test('Empty string results in an empty title', async () => {
    const getUserData = () => Promise.resolve({ title: '' });
    const customizePanelAction = new customize_panel_action_1.CustomizePanelTitleAction(getUserData);
    expect(embeddable.getInput().title).toBeUndefined();
    expect(embeddable.getTitle()).toBe('Hello Robert Baratheon');
    await customizePanelAction.execute({ embeddable });
    await enzyme_helpers_1.nextTick();
    expect(embeddable.getTitle()).toBe('');
});
test('Undefined title results in the original title', async () => {
    const getUserData = () => Promise.resolve({ title: 'hi' });
    const customizePanelAction = new customize_panel_action_1.CustomizePanelTitleAction(getUserData);
    expect(embeddable.getInput().title).toBeUndefined();
    expect(embeddable.getTitle()).toBe('Hello Robert Baratheon');
    await customizePanelAction.execute({ embeddable });
    await enzyme_helpers_1.nextTick();
    expect(embeddable.getTitle()).toBe('hi');
    await new customize_panel_action_1.CustomizePanelTitleAction(() => Promise.resolve({ title: undefined })).execute({
        embeddable,
    });
    await enzyme_helpers_1.nextTick();
    expect(embeddable.getTitle()).toBe('Hello Robert Baratheon');
});
