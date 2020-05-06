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
const __1 = require("../../../");
const remove_panel_action_1 = require("./remove_panel_action");
const filterable_embeddable_1 = require("../../../test_samples/embeddables/filterable_embeddable");
const filterable_embeddable_factory_1 = require("../../../test_samples/embeddables/filterable_embeddable_factory");
const filterable_container_1 = require("../../../test_samples/embeddables/filterable_container");
const types_1 = require("../../../types");
const contact_card_embeddable_1 = require("../../../test_samples/embeddables/contact_card/contact_card_embeddable");
const public_1 = require("../../../../../../../plugins/data/public");
const mocks_1 = require("../../../../mocks");
const { setup, doStart } = mocks_1.embeddablePluginMock.createInstance();
setup.registerEmbeddableFactory(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, new filterable_embeddable_factory_1.FilterableEmbeddableFactory());
const getFactory = doStart().getEmbeddableFactory;
let container;
let embeddable;
beforeEach(async () => {
    const derivedFilter = {
        $state: { store: public_1.esFilters.FilterStateStore.APP_STATE },
        meta: { disabled: false, alias: 'name', negate: false },
        query: { match: {} },
    };
    container = new filterable_container_1.FilterableContainer({ id: 'hello', panels: {}, filters: [derivedFilter], viewMode: types_1.ViewMode.EDIT }, getFactory);
    const filterableEmbeddable = await container.addNewEmbeddable(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, {
        id: '123',
        viewMode: types_1.ViewMode.EDIT,
    });
    if (__1.isErrorEmbeddable(filterableEmbeddable)) {
        throw new Error('Error creating new filterable embeddable');
    }
    else {
        embeddable = filterableEmbeddable;
    }
});
test('Removes the embeddable', async () => {
    const removePanelAction = new remove_panel_action_1.RemovePanelAction();
    expect(container.getChild(embeddable.id)).toBeDefined();
    await removePanelAction.execute({ embeddable });
    expect(container.getChild(embeddable.id)).toBeUndefined();
});
test('Is not compatible when embeddable is not in a parent', async () => {
    const action = new remove_panel_action_1.RemovePanelAction();
    expect(await action.isCompatible({
        embeddable: new contact_card_embeddable_1.ContactCardEmbeddable({
            firstName: 'Sandor',
            lastName: 'Clegane',
            id: '123',
        }, { execAction: (() => null) }),
    })).toBe(false);
});
test('Execute throws an error when called with an embeddable not in a parent', async () => {
    const action = new remove_panel_action_1.RemovePanelAction();
    async function check() {
        await action.execute({ embeddable: container });
    }
    await expect(check()).rejects.toThrow(Error);
});
test('Returns title', async () => {
    const action = new remove_panel_action_1.RemovePanelAction();
    expect(action.getDisplayName()).toBeDefined();
});
test('Returns an icon type', async () => {
    const action = new remove_panel_action_1.RemovePanelAction();
    expect(action.getIconType()).toBeDefined();
});
