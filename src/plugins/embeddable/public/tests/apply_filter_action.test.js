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
const test_plugin_1 = require("./test_plugin");
const lib_1 = require("../lib");
const test_samples_1 = require("../lib/test_samples");
// eslint-disable-next-line
const mocks_1 = require("../../../../plugins/inspector/public/mocks");
const public_1 = require("../../../../plugins/data/public");
test('ApplyFilterAction applies the filter to the root of the container tree', async () => {
    const { doStart, setup } = test_plugin_1.testPlugin();
    const factory2 = new test_samples_1.FilterableEmbeddableFactory();
    const factory1 = new test_samples_1.FilterableContainerFactory(async () => await api.getEmbeddableFactory);
    setup.registerEmbeddableFactory(factory2.type, factory2);
    setup.registerEmbeddableFactory(factory1.type, factory1);
    const api = doStart();
    const applyFilterAction = lib_1.createFilterAction();
    const root = new test_samples_1.FilterableContainer({ id: 'root', panels: {}, filters: [] }, api.getEmbeddableFactory);
    const node1 = await root.addNewEmbeddable(test_samples_1.FILTERABLE_CONTAINER, { panels: {}, id: 'node1' });
    const node2 = await root.addNewEmbeddable(test_samples_1.FILTERABLE_CONTAINER, { panels: {}, id: 'Node2' });
    if (lib_1.isErrorEmbeddable(node1) || lib_1.isErrorEmbeddable(node2)) {
        throw new Error();
    }
    const embeddable = await node2.addNewEmbeddable(test_samples_1.FILTERABLE_EMBEDDABLE, { id: 'leaf' });
    if (lib_1.isErrorEmbeddable(embeddable)) {
        throw new Error();
    }
    const filter = {
        $state: { store: public_1.esFilters.FilterStateStore.APP_STATE },
        meta: {
            disabled: false,
            negate: false,
            alias: '',
        },
        query: { match: { extension: { query: 'foo' } } },
    };
    await applyFilterAction.execute({ embeddable, filters: [filter] });
    expect(root.getInput().filters.length).toBe(1);
    expect(node1.getInput().filters.length).toBe(1);
    expect(embeddable.getInput().filters.length).toBe(1);
    expect(node2.getInput().filters.length).toBe(1);
});
test('ApplyFilterAction is incompatible if the root container does not accept a filter as input', async () => {
    const { doStart, coreStart, setup } = test_plugin_1.testPlugin();
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const factory = new test_samples_1.FilterableEmbeddableFactory();
    setup.registerEmbeddableFactory(factory.type, factory);
    const api = doStart();
    const applyFilterAction = lib_1.createFilterAction();
    const parent = new test_samples_1.HelloWorldContainer({ id: 'root', panels: {} }, {
        getActions: () => Promise.resolve([]),
        getEmbeddableFactory: api.getEmbeddableFactory,
        getAllEmbeddableFactories: api.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector,
        SavedObjectFinder: () => null,
    });
    const embeddable = await parent.addNewEmbeddable(test_samples_1.FILTERABLE_EMBEDDABLE, { id: 'leaf' });
    if (lib_1.isErrorEmbeddable(embeddable)) {
        throw new Error();
    }
    // @ts-ignore
    expect(await applyFilterAction.isCompatible({ embeddable })).toBe(false);
});
test('trying to execute on incompatible context throws an error ', async () => {
    const { doStart, coreStart, setup } = test_plugin_1.testPlugin();
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const factory = new test_samples_1.FilterableEmbeddableFactory();
    setup.registerEmbeddableFactory(factory.type, factory);
    const api = doStart();
    const applyFilterAction = lib_1.createFilterAction();
    const parent = new test_samples_1.HelloWorldContainer({ id: 'root', panels: {} }, {
        getActions: () => Promise.resolve([]),
        getEmbeddableFactory: api.getEmbeddableFactory,
        getAllEmbeddableFactories: api.getEmbeddableFactories,
        overlays: coreStart.overlays,
        notifications: coreStart.notifications,
        application: coreStart.application,
        inspector,
        SavedObjectFinder: () => null,
    });
    const embeddable = await parent.addNewEmbeddable(test_samples_1.FILTERABLE_EMBEDDABLE, { id: 'leaf' });
    if (lib_1.isErrorEmbeddable(embeddable)) {
        throw new Error();
    }
    async function check() {
        await applyFilterAction.execute({ embeddable });
    }
    await expect(check()).rejects.toThrow(Error);
});
test('gets title', async () => {
    const applyFilterAction = lib_1.createFilterAction();
    expect(applyFilterAction.getDisplayName({})).toBeDefined();
});
