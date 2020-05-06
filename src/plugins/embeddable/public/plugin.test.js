"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const mocks_1 = require("../../../core/public/mocks");
const test_plugin_1 = require("./tests/test_plugin");
const lib_1 = require("./lib");
const public_1 = require("../../../../examples/embeddable_examples/public");
test('cannot register embeddable factory with the same ID', async () => {
    const coreSetup = mocks_1.coreMock.createSetup();
    const coreStart = mocks_1.coreMock.createStart();
    const { setup } = test_plugin_1.testPlugin(coreSetup, coreStart);
    const embeddableFactoryId = 'ID';
    const embeddableFactory = {};
    setup.registerEmbeddableFactory(embeddableFactoryId, embeddableFactory);
    expect(() => setup.registerEmbeddableFactory(embeddableFactoryId, embeddableFactory)).toThrowError('Embeddable factory [embeddableFactoryId = ID] already registered in Embeddables API.');
});
test('can set custom embeddable factory provider', async () => {
    const coreSetup = mocks_1.coreMock.createSetup();
    const coreStart = mocks_1.coreMock.createStart();
    const { setup, doStart } = test_plugin_1.testPlugin(coreSetup, coreStart);
    const customProvider = def => ({
        ...lib_1.defaultEmbeddableFactoryProvider(def),
        getDisplayName: () => 'Intercepted!',
    });
    setup.setCustomEmbeddableFactoryProvider(customProvider);
    setup.registerEmbeddableFactory('test', {
        type: 'test',
        create: () => Promise.resolve(undefined),
        getDisplayName: () => 'Test',
        isEditable: () => Promise.resolve(true),
    });
    const start = doStart();
    const factory = start.getEmbeddableFactory('test');
    expect(factory.getDisplayName()).toEqual('Intercepted!');
});
test('custom embeddable factory provider test for intercepting embeddable creation and destruction', async () => {
    const coreSetup = mocks_1.coreMock.createSetup();
    const coreStart = mocks_1.coreMock.createStart();
    const { setup, doStart } = test_plugin_1.testPlugin(coreSetup, coreStart);
    let updateCount = 0;
    const customProvider = def => {
        return {
            ...lib_1.defaultEmbeddableFactoryProvider(def),
            create: async (input, parent) => {
                const embeddable = await lib_1.defaultEmbeddableFactoryProvider(def).create(input, parent);
                if (embeddable) {
                    const subscription = embeddable.getInput$().subscribe(() => {
                        updateCount++;
                    }, () => { }, () => {
                        subscription.unsubscribe();
                        updateCount = 0;
                    });
                }
                return embeddable;
            },
        };
    };
    setup.setCustomEmbeddableFactoryProvider(customProvider);
    setup.registerEmbeddableFactory('test', {
        type: 'test',
        create: (input, parent) => Promise.resolve(new public_1.HelloWorldEmbeddable(input, parent)),
        getDisplayName: () => 'Test',
        isEditable: () => Promise.resolve(true),
    });
    const start = doStart();
    const factory = start.getEmbeddableFactory('test');
    const embeddable = await factory?.create({ id: '123' });
    embeddable.updateInput({ title: 'boo' });
    // initial subscription, plus the second update.
    expect(updateCount).toEqual(2);
    embeddable.destroy();
    await new Promise(resolve => process.nextTick(resolve));
    expect(updateCount).toEqual(0);
});
