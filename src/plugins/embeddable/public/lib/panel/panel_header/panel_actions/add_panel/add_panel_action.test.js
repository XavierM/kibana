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
const __1 = require("../../../../");
const add_panel_action_1 = require("./add_panel_action");
const filterable_embeddable_1 = require("../../../../test_samples/embeddables/filterable_embeddable");
const filterable_embeddable_factory_1 = require("../../../../test_samples/embeddables/filterable_embeddable_factory");
const filterable_container_1 = require("../../../../test_samples/embeddables/filterable_container");
// eslint-disable-next-line
const mocks_1 = require("../../../../../../../../core/public/mocks");
const test_samples_1 = require("../../../../test_samples");
const public_1 = require("../../../../../../../../plugins/data/public");
const mocks_2 = require("../../../../../mocks");
const { setup, doStart } = mocks_2.embeddablePluginMock.createInstance();
setup.registerEmbeddableFactory(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, new filterable_embeddable_factory_1.FilterableEmbeddableFactory());
const getFactory = doStart().getEmbeddableFactory;
let container;
let embeddable;
let action;
beforeEach(async () => {
    const start = mocks_1.coreMock.createStart();
    action = new add_panel_action_1.AddPanelAction(() => undefined, () => [], start.overlays, start.notifications, () => null);
    const derivedFilter = {
        $state: { store: public_1.esFilters.FilterStateStore.APP_STATE },
        meta: { disabled: false, alias: 'name', negate: false },
        query: { match: {} },
    };
    container = new filterable_container_1.FilterableContainer({ id: 'hello', panels: {}, filters: [derivedFilter] }, getFactory);
    const filterableEmbeddable = await container.addNewEmbeddable(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, {
        id: '123',
    });
    if (__1.isErrorEmbeddable(filterableEmbeddable)) {
        throw new Error('Error creating new filterable embeddable');
    }
    else {
        embeddable = filterableEmbeddable;
    }
});
test('Is not compatible when container is in view mode', async () => {
    const start = mocks_1.coreMock.createStart();
    const addPanelAction = new add_panel_action_1.AddPanelAction(() => undefined, () => [], start.overlays, start.notifications, () => null);
    container.updateInput({ viewMode: __1.ViewMode.VIEW });
    expect(await addPanelAction.isCompatible({ embeddable: container })).toBe(false);
});
test('Is not compatible when embeddable is not a container', async () => {
    expect(await action.isCompatible({ embeddable })).toBe(false);
});
test('Is compatible when embeddable is a parent and in edit mode', async () => {
    container.updateInput({ viewMode: __1.ViewMode.EDIT });
    expect(await action.isCompatible({ embeddable: container })).toBe(true);
});
test('Execute throws an error when called with an embeddable that is not a container', async () => {
    async function check() {
        await action.execute({
            embeddable: new test_samples_1.ContactCardEmbeddable({
                firstName: 'sue',
                id: '123',
                viewMode: __1.ViewMode.EDIT,
            }, {}),
        });
    }
    await expect(check()).rejects.toThrow(Error);
});
test('Execute does not throw an error when called with a compatible container', async () => {
    container.updateInput({ viewMode: __1.ViewMode.EDIT });
    await action.execute({
        embeddable: container,
    });
});
test('Returns title', async () => {
    expect(action.getDisplayName()).toBeDefined();
});
test('Returns an icon', async () => {
    expect(action.getIconType()).toBeDefined();
});
