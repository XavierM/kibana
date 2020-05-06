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
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const lib_1 = require("../lib");
const filterable_embeddable_1 = require("../lib/test_samples/embeddables/filterable_embeddable");
const error_embeddable_1 = require("../lib/embeddables/error_embeddable");
const filterable_embeddable_factory_1 = require("../lib/test_samples/embeddables/filterable_embeddable_factory");
const contact_card_embeddable_factory_1 = require("../lib/test_samples/embeddables/contact_card/contact_card_embeddable_factory");
const slow_contact_card_embeddable_factory_1 = require("../lib/test_samples/embeddables/contact_card/slow_contact_card_embeddable_factory");
const public_1 = require("../../../../../examples/embeddable_examples/public");
const hello_world_container_1 = require("../lib/test_samples/embeddables/hello_world_container");
const filterable_container_1 = require("../lib/test_samples/embeddables/filterable_container");
// eslint-disable-next-line
const mocks_1 = require("../../../../core/public/mocks");
const test_plugin_1 = require("./test_plugin");
const helpers_1 = require("./helpers");
const public_2 = require("../../../../plugins/data/public");
async function creatHelloWorldContainerAndEmbeddable(containerInput = { id: 'hello', panels: {} }, embeddableInput = {}) {
    const coreSetup = mocks_1.coreMock.createSetup();
    const coreStart = mocks_1.coreMock.createStart();
    const { setup, doStart, uiActions } = test_plugin_1.testPlugin(coreSetup, coreStart);
    const filterableFactory = new filterable_embeddable_factory_1.FilterableEmbeddableFactory();
    const slowContactCardFactory = new slow_contact_card_embeddable_factory_1.SlowContactCardEmbeddableFactory({
        execAction: uiActions.executeTriggerActions,
    });
    const helloWorldFactory = new public_1.HelloWorldEmbeddableFactory();
    setup.registerEmbeddableFactory(filterableFactory.type, filterableFactory);
    setup.registerEmbeddableFactory(slowContactCardFactory.type, slowContactCardFactory);
    setup.registerEmbeddableFactory(helloWorldFactory.type, helloWorldFactory);
    const start = doStart();
    const container = new hello_world_container_1.HelloWorldContainer(containerInput, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: start.getEmbeddableFactory,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, embeddableInput);
    if (lib_1.isErrorEmbeddable(embeddable)) {
        throw new Error('Error adding embeddable');
    }
    return { container, embeddable, coreSetup, coreStart, setup, start, uiActions };
}
test('Container initializes embeddables', async (done) => {
    const { container } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello',
        panels: {
            '123': {
                explicitInput: { id: '123' },
                type: contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE,
            },
        },
    });
    if (container.getOutput().embeddableLoaded['123']) {
        const embeddable = container.getChild('123');
        expect(embeddable).toBeDefined();
        expect(embeddable.id).toBe('123');
        done();
    }
});
test('Container.addNewEmbeddable', async () => {
    const { container, embeddable } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {} }, {
        firstName: 'Susy',
    });
    expect(embeddable).toBeDefined();
    if (!lib_1.isErrorEmbeddable(embeddable)) {
        expect(embeddable.getInput().firstName).toBe('Susy');
    }
    else {
        expect(false).toBe(true);
    }
    const embeddableInContainer = container.getChild(embeddable.id);
    expect(embeddableInContainer).toBeDefined();
    expect(embeddableInContainer.id).toBe(embeddable.id);
});
test('Container.removeEmbeddable removes and cleans up', async (done) => {
    const { start, coreStart, uiActions } = await creatHelloWorldContainerAndEmbeddable();
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: {
            '123': {
                explicitInput: { id: '123', firstName: 'Sam', lastName: 'Tarley' },
                type: contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE,
            },
        },
    }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: start.getEmbeddableFactory,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    const embeddable = await container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Susy',
        lastName: 'Q',
    });
    if (lib_1.isErrorEmbeddable(embeddable)) {
        expect(false).toBe(true);
        return;
    }
    embeddable.updateInput({ lastName: 'Z' });
    container
        .getOutput$()
        .pipe(operators_1.skip(1))
        .subscribe(() => {
        const noFind = container.getChild(embeddable.id);
        expect(noFind).toBeUndefined();
        expect(container.getInput().panels[embeddable.id]).toBeUndefined();
        if (lib_1.isErrorEmbeddable(embeddable)) {
            expect(false).toBe(true);
            done();
        }
        expect(() => embeddable.updateInput({ nameTitle: 'Sir' })).toThrowError();
        expect(container.getOutput().embeddableLoaded[embeddable.id]).toBeUndefined();
        done();
    });
    container.removeEmbeddable(embeddable.id);
});
test('Container.input$ is notified when child embeddable input is updated', async () => {
    const { container, embeddable } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {} }, {
        firstName: 'Susy',
        lastName: 'Q',
    });
    expect(lib_1.isErrorEmbeddable(embeddable)).toBe(false);
    const changes = jest.fn();
    expect(changes).toHaveBeenCalledTimes(0);
    const subscription = container.getInput$().subscribe(changes);
    expect(changes).toHaveBeenCalledTimes(1);
    embeddable.updateInput({ lastName: 'Z' });
    expect(changes).toHaveBeenCalledTimes(2);
    expect(embeddable.getInput().lastName === 'Z');
    embeddable.updateInput({ lastName: embeddable.getOutput().originalLastName });
    expect(embeddable.getInput().lastName === 'Q');
    expect(changes).toBeCalledTimes(3);
    subscription.unsubscribe();
    embeddable.updateInput({ nameTitle: 'Dr.' });
    expect(changes).toBeCalledTimes(3);
});
test('Container.input$', async () => {
    const { container, embeddable } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {} }, {
        firstName: 'Susy',
        id: 'Susy',
    });
    expect(lib_1.isErrorEmbeddable(embeddable)).toBe(false);
    const changes = jest.fn();
    const input = container.getInput();
    expect(input.panels[embeddable.id].explicitInput).toEqual({ firstName: 'Susy', id: 'Susy' });
    const subscription = container.getInput$().subscribe(changes);
    embeddable.updateInput({ nameTitle: 'Dr.' });
    expect(container.getInput().panels[embeddable.id].explicitInput).toEqual({
        nameTitle: 'Dr.',
        firstName: 'Susy',
        id: 'Susy',
    });
    subscription.unsubscribe();
});
test('Container.getInput$ not triggered if state is the same', async () => {
    const { container, embeddable } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {} }, {
        firstName: 'Susy',
        id: 'Susy',
    });
    expect(lib_1.isErrorEmbeddable(embeddable)).toBe(false);
    const changes = jest.fn();
    const input = container.getInput();
    expect(input.panels[embeddable.id].explicitInput).toEqual({
        id: 'Susy',
        firstName: 'Susy',
    });
    const subscription = container.getInput$().subscribe(changes);
    embeddable.updateInput({ nameTitle: 'Dr.' });
    expect(changes).toBeCalledTimes(2);
    embeddable.updateInput({ nameTitle: 'Dr.' });
    expect(changes).toBeCalledTimes(2);
    subscription.unsubscribe();
});
test('Container view mode change propagates to children', async () => {
    const { container, embeddable } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {}, viewMode: lib_1.ViewMode.VIEW }, {
        firstName: 'Susy',
        id: 'Susy',
    });
    expect(embeddable.getInput().viewMode).toBe(lib_1.ViewMode.VIEW);
    container.updateInput({ viewMode: lib_1.ViewMode.EDIT });
    expect(embeddable.getInput().viewMode).toBe(lib_1.ViewMode.EDIT);
});
test(`Container updates its state when a child's input is updated`, async (done) => {
    const { container, embeddable, start, coreStart, uiActions, } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {}, viewMode: lib_1.ViewMode.VIEW }, {
        id: '123',
        firstName: 'Susy',
    });
    expect(lib_1.isErrorEmbeddable(embeddable)).toBe(false);
    const containerSubscription = Rx.merge(container.getInput$(), container.getOutput$()).subscribe(() => {
        const child = container.getChild(embeddable.id);
        if (container.getOutput().embeddableLoaded[embeddable.id] &&
            child.getInput().nameTitle === 'Dr.') {
            containerSubscription.unsubscribe();
            // Make sure a brand new container built off the output of container also creates an embeddable
            // with "Dr.", not the default the embeddable was first added with. Makes sure changed input
            // is preserved with the container.
            const containerClone = new hello_world_container_1.HelloWorldContainer(container.getInput(), {
                getActions: uiActions.getTriggerCompatibleActions,
                getAllEmbeddableFactories: start.getEmbeddableFactories,
                getEmbeddableFactory: start.getEmbeddableFactory,
                notifications: coreStart.notifications,
                overlays: coreStart.overlays,
                application: coreStart.application,
                inspector: {},
                SavedObjectFinder: () => null,
            });
            const cloneSubscription = Rx.merge(containerClone.getOutput$(), containerClone.getInput$()).subscribe(() => {
                const childClone = containerClone.getChild(embeddable.id);
                if (containerClone.getOutput().embeddableLoaded[embeddable.id] &&
                    childClone.getInput().nameTitle === 'Dr.') {
                    cloneSubscription.unsubscribe();
                    done();
                }
            });
        }
    });
    embeddable.updateInput({ nameTitle: 'Dr.' });
});
test(`Derived container state passed to children`, async () => {
    const { container, embeddable } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {}, viewMode: lib_1.ViewMode.VIEW }, {
        firstName: 'Susy',
    });
    let subscription = embeddable
        .getInput$()
        .pipe(operators_1.skip(1))
        .subscribe((changes) => {
        expect(changes.viewMode).toBe(lib_1.ViewMode.EDIT);
    });
    container.updateInput({ viewMode: lib_1.ViewMode.EDIT });
    subscription.unsubscribe();
    subscription = embeddable
        .getInput$()
        .pipe(operators_1.skip(1))
        .subscribe((changes) => {
        expect(changes.viewMode).toBe(lib_1.ViewMode.VIEW);
    });
    container.updateInput({ viewMode: lib_1.ViewMode.VIEW });
    subscription.unsubscribe();
});
test(`Can subscribe to children embeddable updates`, async (done) => {
    const { embeddable } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello container',
        panels: {},
        viewMode: lib_1.ViewMode.VIEW,
    }, {
        firstName: 'Susy',
    });
    expect(lib_1.isErrorEmbeddable(embeddable)).toBe(false);
    const subscription = embeddable.getInput$().subscribe((input) => {
        if (input.nameTitle === 'Dr.') {
            subscription.unsubscribe();
            done();
        }
    });
    embeddable.updateInput({ nameTitle: 'Dr.' });
});
test('Test nested reactions', async (done) => {
    const { container, embeddable } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {}, viewMode: lib_1.ViewMode.VIEW }, {
        firstName: 'Susy',
    });
    expect(lib_1.isErrorEmbeddable(embeddable)).toBe(false);
    const containerSubscription = container.getInput$().subscribe((input) => {
        const embeddableNameTitle = embeddable.getInput().nameTitle;
        const viewMode = input.viewMode;
        const nameTitleFromContainer = container.getInputForChild(embeddable.id).nameTitle;
        if (embeddableNameTitle === 'Dr.' &&
            nameTitleFromContainer === 'Dr.' &&
            viewMode === lib_1.ViewMode.EDIT) {
            containerSubscription.unsubscribe();
            embeddableSubscription.unsubscribe();
            done();
        }
    });
    const embeddableSubscription = embeddable.getInput$().subscribe(() => {
        if (embeddable.getInput().nameTitle === 'Dr.') {
            container.updateInput({ viewMode: lib_1.ViewMode.EDIT });
        }
    });
    embeddable.updateInput({ nameTitle: 'Dr.' });
});
test('Explicit embeddable input mapped to undefined will default to inherited', async () => {
    const { start } = await creatHelloWorldContainerAndEmbeddable();
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
    const { container } = await creatHelloWorldContainerAndEmbeddable({ id: 'hello', panels: {} });
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
test('Panel removed from input state', async () => {
    const { container } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello',
        panels: {},
        filters: [],
    });
    const embeddable = await container.addNewEmbeddable(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, {});
    const filteredPanels = { ...container.getInput().panels };
    delete filteredPanels[embeddable.id];
    const newInput = {
        ...container.getInput(),
        panels: filteredPanels,
    };
    container.updateInput(newInput);
    await new Promise(r => setTimeout(r, 1));
    expect(container.getChild(embeddable.id)).toBeUndefined();
    expect(container.getOutput().embeddableLoaded[embeddable.id]).toBeUndefined();
});
test('Panel added to input state', async () => {
    const { container, start } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello',
        panels: {},
        filters: [],
    });
    const embeddable = await container.addNewEmbeddable(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, {});
    const embeddable2 = await container.addNewEmbeddable(filterable_embeddable_1.FILTERABLE_EMBEDDABLE, {});
    const container2 = new filterable_container_1.FilterableContainer({ id: 'hello', panels: {}, filters: [] }, start.getEmbeddableFactory);
    container2.updateInput(container.getInput());
    await new Promise(r => setTimeout(r, 1));
    expect(container.getChild(embeddable.id)).toBeDefined();
    expect(container.getOutput().embeddableLoaded[embeddable.id]).toBe(true);
    expect(container.getChild(embeddable2.id)).toBeDefined();
    expect(container.getOutput().embeddableLoaded[embeddable2.id]).toBe(true);
});
test('Container changes made directly after adding a new embeddable are propagated', async (done) => {
    const coreSetup = mocks_1.coreMock.createSetup();
    const coreStart = mocks_1.coreMock.createStart();
    const { setup, doStart, uiActions } = test_plugin_1.testPlugin(coreSetup, coreStart);
    const factory = new slow_contact_card_embeddable_factory_1.SlowContactCardEmbeddableFactory({
        loadTickCount: 3,
        execAction: uiActions.executeTriggerActions,
    });
    setup.registerEmbeddableFactory(factory.type, factory);
    const start = doStart();
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: {},
        viewMode: lib_1.ViewMode.EDIT,
    }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: start.getEmbeddableFactory,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    const subscription = Rx.merge(container.getOutput$(), container.getInput$())
        .pipe(operators_1.skip(2))
        .subscribe(() => {
        expect(Object.keys(container.getOutput().embeddableLoaded).length).toBe(1);
        if (Object.keys(container.getOutput().embeddableLoaded).length > 0) {
            const embeddableId = Object.keys(container.getOutput().embeddableLoaded)[0];
            if (container.getOutput().embeddableLoaded[embeddableId] === true) {
                const embeddable = container.getChild(embeddableId);
                if (embeddable.getInput().viewMode === lib_1.ViewMode.VIEW) {
                    subscription.unsubscribe();
                    done();
                }
            }
        }
    });
    container.addNewEmbeddable(contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'A girl',
        lastName: 'has no name',
    });
    container.updateInput({ viewMode: lib_1.ViewMode.VIEW });
});
test('container stores ErrorEmbeddables when a factory for a child cannot be found (so the panel can be removed)', async (done) => {
    const { container } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello',
        panels: {
            '123': {
                type: 'IDontExist',
                explicitInput: { id: '123' },
            },
        },
        viewMode: lib_1.ViewMode.EDIT,
    });
    container.getOutput$().subscribe(() => {
        if (container.getOutput().embeddableLoaded['123']) {
            const child = container.getChild('123');
            expect(child.type).toBe(error_embeddable_1.ERROR_EMBEDDABLE_TYPE);
            done();
        }
    });
});
test('container stores ErrorEmbeddables when a saved object cannot be found', async (done) => {
    const { container } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello',
        panels: {
            '123': {
                type: 'vis',
                explicitInput: { id: '123', savedObjectId: '456' },
            },
        },
        viewMode: lib_1.ViewMode.EDIT,
    });
    container.getOutput$().subscribe(() => {
        if (container.getOutput().embeddableLoaded['123']) {
            const child = container.getChild('123');
            expect(child.type).toBe(error_embeddable_1.ERROR_EMBEDDABLE_TYPE);
            done();
        }
    });
});
test('ErrorEmbeddables get updated when parent does', async (done) => {
    const { container } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello',
        panels: {
            '123': {
                type: 'vis',
                explicitInput: { id: '123', savedObjectId: '456' },
            },
        },
        viewMode: lib_1.ViewMode.EDIT,
    });
    container.getOutput$().subscribe(() => {
        if (container.getOutput().embeddableLoaded['123']) {
            const embeddable = container.getChild('123');
            expect(embeddable.getInput().viewMode).toBe(lib_1.ViewMode.EDIT);
            container.updateInput({ viewMode: lib_1.ViewMode.VIEW });
            expect(embeddable.getInput().viewMode).toBe(lib_1.ViewMode.VIEW);
            done();
        }
    });
});
test('untilEmbeddableLoaded() throws an error if there is no such child panel in the container', async () => {
    const { container } = await creatHelloWorldContainerAndEmbeddable({
        id: 'hello',
        panels: {},
    });
    expect(container.untilEmbeddableLoaded('idontexist')).rejects.toThrowError();
});
test('untilEmbeddableLoaded() throws an error if there is no such child panel in the container - 2', async () => {
    const { doStart, coreStart, uiActions } = test_plugin_1.testPlugin(mocks_1.coreMock.createSetup(), mocks_1.coreMock.createStart());
    const start = doStart();
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: {},
    }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: start.getEmbeddableFactory,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    const [, error] = await helpers_1.of(container.untilEmbeddableLoaded('123'));
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatchInlineSnapshot(`"Panel not found"`);
});
test('untilEmbeddableLoaded() resolves if child is loaded in the container', async (done) => {
    const { setup, doStart, coreStart, uiActions } = test_plugin_1.testPlugin(mocks_1.coreMock.createSetup(), mocks_1.coreMock.createStart());
    const factory = new public_1.HelloWorldEmbeddableFactory();
    setup.registerEmbeddableFactory(factory.type, factory);
    const start = doStart();
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: {
            '123': {
                type: public_1.HELLO_WORLD_EMBEDDABLE,
                explicitInput: { id: '123' },
            },
        },
    }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: start.getEmbeddableFactory,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    const child = await container.untilEmbeddableLoaded('123');
    expect(child).toBeDefined();
    expect(child.type).toBe(public_1.HELLO_WORLD_EMBEDDABLE);
    done();
});
test('untilEmbeddableLoaded resolves with undefined if child is subsequently removed', async (done) => {
    const { doStart, setup, coreStart, uiActions } = test_plugin_1.testPlugin(mocks_1.coreMock.createSetup(), mocks_1.coreMock.createStart());
    const factory = new slow_contact_card_embeddable_factory_1.SlowContactCardEmbeddableFactory({
        loadTickCount: 3,
        execAction: uiActions.executeTriggerActions,
    });
    setup.registerEmbeddableFactory(factory.type, factory);
    const start = doStart();
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: {
            '123': {
                explicitInput: { id: '123', firstName: 'Sam', lastName: 'Tarley' },
                type: contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE,
            },
        },
    }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: start.getEmbeddableFactory,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    container.untilEmbeddableLoaded('123').then(embed => {
        expect(embed).toBeUndefined();
        done();
    });
    container.updateInput({ panels: {} });
});
test('adding a panel then subsequently removing it before its loaded removes the panel', async (done) => {
    const { doStart, coreStart, uiActions, setup } = test_plugin_1.testPlugin(mocks_1.coreMock.createSetup(), mocks_1.coreMock.createStart());
    const factory = new slow_contact_card_embeddable_factory_1.SlowContactCardEmbeddableFactory({
        loadTickCount: 1,
        execAction: uiActions.executeTriggerActions,
    });
    setup.registerEmbeddableFactory(factory.type, factory);
    const start = doStart();
    const container = new hello_world_container_1.HelloWorldContainer({
        id: 'hello',
        panels: {
            '123': {
                explicitInput: { id: '123', firstName: 'Sam', lastName: 'Tarley' },
                type: contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE,
            },
        },
    }, {
        getActions: uiActions.getTriggerCompatibleActions,
        getEmbeddableFactory: start.getEmbeddableFactory,
        getAllEmbeddableFactories: start.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector: {},
        SavedObjectFinder: () => null,
    });
    // Final state should be that the panel is removed.
    Rx.merge(container.getInput$(), container.getOutput$()).subscribe(() => {
        if (container.getInput().panels['123'] === undefined &&
            container.getOutput().embeddableLoaded['123'] === undefined &&
            container.getInput().panels['456'] !== undefined &&
            container.getOutput().embeddableLoaded['456'] === true) {
            done();
        }
    });
    container.updateInput({ panels: {} });
    container.updateInput({
        panels: {
            '456': {
                explicitInput: { id: '456' },
                type: contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE,
            },
        },
    });
});
