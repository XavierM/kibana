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
const operators_1 = require("rxjs/operators");
const test_plugin_1 = require("./test_plugin");
const filterable_embeddable_1 = require("../lib/test_samples/embeddables/filterable_embeddable");
const filterable_embeddable_factory_1 = require("../lib/test_samples/embeddables/filterable_embeddable_factory");
const contact_card_embeddable_factory_1 = require("../lib/test_samples/embeddables/contact_card/contact_card_embeddable_factory");
const slow_contact_card_embeddable_factory_1 = require("../lib/test_samples/embeddables/contact_card/slow_contact_card_embeddable_factory");
const public_1 = require("../../../../../examples/embeddable_examples/public");
const filterable_container_1 = require("../lib/test_samples/embeddables/filterable_container");
const lib_1 = require("../lib");
const hello_world_container_1 = require("../lib/test_samples/embeddables/hello_world_container");
// eslint-disable-next-line
const mocks_1 = require("../../../../core/public/mocks");
const public_2 = require("../../../../plugins/data/public");
const { setup, doStart, coreStart, uiActions } = test_plugin_1.testPlugin(mocks_1.coreMock.createSetup(), mocks_1.coreMock.createStart());
setup.registerEmbeddableFactory(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, new filterable_embeddable_factory_1.FilterableEmbeddableFactory());
const factory = new slow_contact_card_embeddable_factory_1.SlowContactCardEmbeddableFactory({
    loadTickCount: 2,
    execAction: uiActions.executeTriggerActions,
});
setup.registerEmbeddableFactory(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, factory);
setup.registerEmbeddableFactory(public_1.HELLO_WORLD_EMBEDDABLE, new public_1.HelloWorldEmbeddableFactory());
const start = doStart();
test('Explicit embeddable input mapped to undefined will default to inherited', async () => {
    const derivedFilter = {
        $state: { store: public_2.esFilters.FilterStateStore.APP_STATE },
        meta: { disabled: false, alias: 'name', negate: false },
        query: { match: {} },
    };
    const container = new filterable_container_1.FilterableContainer({ id: 'hello', panels: {}, filters: [derivedFilter] }, start.getEmbeddableFactory);
    const embeddable = await container.addNewEmbeddable(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, {});
    if (lib_1.isErrorEmbeddable(embeddable)) {
        throw new Error('Error adding embeddable');
    }
    embeddable.updateInput({ filters: [] });
    expect(container.getInputForChild(embeddable.id).filters).toEqual([]);
    embeddable.updateInput({ filters: undefined });
    expect(container.getInputForChild(embeddable.id).filters).toEqual([
        derivedFilter,
    ]);
});
test('Explicit embeddable input mapped to undefined with no inherited value will get passed to embeddable', async (done) => {
    const container = new hello_world_container_1.HelloWorldContainer({ id: 'hello', panels: {} }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        getEmbeddableFactory: start.getEmbeddableFactory,
        notifications: coreStart.notifications,
        overlays: coreStart.overlays,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    const embeddable = await container.addNewEmbeddable(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, {});
    if (lib_1.isErrorEmbeddable(embeddable)) {
        throw new Error('Error adding embeddable');
    }
    embeddable.updateInput({ filters: [] });
    expect(container.getInputForChild(embeddable.id).filters).toEqual([]);
    const subscription = embeddable
        .getInput$()
        .pipe(operators_1.skip(1))
        .subscribe(() => {
        if (embeddable.getInput().filters === undefined) {
            subscription.unsubscribe();
            done();
        }
    });
    embeddable.updateInput({ filters: undefined });
});
// The goal is to make sure that if the container input changes after `onPanelAdded` is called
// but before the embeddable factory returns the embeddable, that the `inheritedChildInput` and
// embeddable input comparisons won't cause explicit input to be set when it shouldn't.
test('Explicit input tests in async situations', (done) => {
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: {
            '123': {
                explicitInput: { firstName: 'Sam', id: '123' },
                type: contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE,
            },
        },
    }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        getEmbeddableFactory: start.getEmbeddableFactory,
        notifications: coreStart.notifications,
        overlays: coreStart.overlays,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    container.updateInput({ lastName: 'lolol' });
    const subscription = container.getOutput$().subscribe(() => {
        if (container.getOutput().embeddableLoaded['123']) {
            const embeddable = container.getChild('123');
            expect(embeddable).toBeDefined();
            expect(embeddable.getInput().lastName).toBe('lolol');
            subscription.unsubscribe();
            done();
        }
    });
});
