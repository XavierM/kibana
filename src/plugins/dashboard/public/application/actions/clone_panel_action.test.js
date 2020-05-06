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
const embeddable_plugin_1 = require("../../embeddable_plugin");
const embeddable_1 = require("../embeddable");
const test_helpers_1 = require("../test_helpers");
const embeddable_plugin_test_samples_1 = require("../../embeddable_plugin_test_samples");
const mocks_1 = require("../../../../../core/public/mocks");
const _1 = require(".");
// eslint-disable-next-line
const mocks_2 = require("src/plugins/embeddable/public/mocks");
const { setup, doStart } = mocks_2.embeddablePluginMock.createInstance();
setup.registerEmbeddableFactory(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, new embeddable_plugin_test_samples_1.ContactCardEmbeddableFactory((() => null), {}));
const start = doStart();
let container;
let embeddable;
let coreStart;
beforeEach(async () => {
    coreStart = mocks_1.coreMock.createStart();
    coreStart.savedObjects.client = {
        ...coreStart.savedObjects.client,
        get: jest.fn().mockImplementation(() => ({ attributes: { title: 'Holy moly' } })),
        find: jest.fn().mockImplementation(() => ({ total: 15 })),
        create: jest.fn().mockImplementation(() => ({ id: 'brandNewSavedObject' })),
    };
    const options = {
        ExitFullScreenButton: () => null,
        SavedObjectFinder: () => null,
        application: {},
        embeddable: start,
        inspector: {},
        notifications: {},
        overlays: coreStart.overlays,
        savedObjectMetaData: {},
        uiActions: {},
    };
    const input = test_helpers_1.getSampleDashboardInput({
        panels: {
            '123': test_helpers_1.getSampleDashboardPanel({
                explicitInput: { firstName: 'Kibanana', id: '123' },
                type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
            }),
        },
    });
    container = new embeddable_1.DashboardContainer(input, options);
    const contactCardEmbeddable = await container.addNewEmbeddable(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Kibana',
    });
    if (embeddable_plugin_1.isErrorEmbeddable(contactCardEmbeddable)) {
        throw new Error('Failed to create embeddable');
    }
    else {
        embeddable = contactCardEmbeddable;
    }
});
test('Clone adds a new embeddable', async () => {
    const dashboard = embeddable.getRoot();
    const originalPanelCount = Object.keys(dashboard.getInput().panels).length;
    const originalPanelKeySet = new Set(Object.keys(dashboard.getInput().panels));
    const action = new _1.ClonePanelAction(coreStart);
    await action.execute({ embeddable });
    expect(Object.keys(container.getInput().panels).length).toEqual(originalPanelCount + 1);
    const newPanelId = Object.keys(container.getInput().panels).find(key => !originalPanelKeySet.has(key));
    expect(newPanelId).toBeDefined();
    const newPanel = container.getInput().panels[newPanelId];
    expect(newPanel.type).toEqual(embeddable.type);
});
test('Clones an embeddable without a saved object ID', async () => {
    const dashboard = embeddable.getRoot();
    const panel = dashboard.getInput().panels[embeddable.id];
    const action = new _1.ClonePanelAction(coreStart);
    // @ts-ignore
    const newPanel = await action.cloneEmbeddable(panel, embeddable.type);
    expect(newPanel.type).toEqual(embeddable.type);
});
test('Clones an embeddable with a saved object ID', async () => {
    const dashboard = embeddable.getRoot();
    const panel = dashboard.getInput().panels[embeddable.id];
    panel.explicitInput.savedObjectId = 'holySavedObjectBatman';
    const action = new _1.ClonePanelAction(coreStart);
    // @ts-ignore
    const newPanel = await action.cloneEmbeddable(panel, embeddable.type);
    expect(coreStart.savedObjects.client.get).toHaveBeenCalledTimes(1);
    expect(coreStart.savedObjects.client.find).toHaveBeenCalledTimes(1);
    expect(coreStart.savedObjects.client.create).toHaveBeenCalledTimes(1);
    expect(newPanel.type).toEqual(embeddable.type);
});
test('Gets a unique title ', async () => {
    coreStart.savedObjects.client.find = jest.fn().mockImplementation(({ search }) => {
        if (search === '"testFirstTitle"')
            return { total: 1 };
        else if (search === '"testSecondTitle"')
            return { total: 41 };
        else if (search === '"testThirdTitle"')
            return { total: 90 };
    });
    const action = new _1.ClonePanelAction(coreStart);
    // @ts-ignore
    expect(await action.getUniqueTitle('testFirstTitle', embeddable.type)).toEqual('testFirstTitle (copy)');
    // @ts-ignore
    expect(await action.getUniqueTitle('testSecondTitle (copy 39)', embeddable.type)).toEqual('testSecondTitle (copy 40)');
    // @ts-ignore
    expect(await action.getUniqueTitle('testSecondTitle (copy 20)', embeddable.type)).toEqual('testSecondTitle (copy 40)');
    // @ts-ignore
    expect(await action.getUniqueTitle('testThirdTitle', embeddable.type)).toEqual('testThirdTitle (copy 89)');
    // @ts-ignore
    expect(await action.getUniqueTitle('testThirdTitle (copy 10000)', embeddable.type)).toEqual('testThirdTitle (copy 89)');
});
