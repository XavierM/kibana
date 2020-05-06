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
const replace_panel_action_1 = require("./replace_panel_action");
const embeddable_1 = require("../embeddable");
const test_helpers_1 = require("../test_helpers");
const embeddable_plugin_test_samples_1 = require("../../embeddable_plugin_test_samples");
const mocks_1 = require("../../../../../core/public/mocks");
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
                explicitInput: { firstName: 'Sam', id: '123' },
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
test('Executes the replace panel action', async () => {
    let SavedObjectFinder;
    let notifications;
    const action = new replace_panel_action_1.ReplacePanelAction(coreStart, SavedObjectFinder, notifications, start.getEmbeddableFactories);
    action.execute({ embeddable });
});
test('Is not compatible when embeddable is not in a dashboard container', async () => {
    let SavedObjectFinder;
    let notifications;
    const action = new replace_panel_action_1.ReplacePanelAction(coreStart, SavedObjectFinder, notifications, start.getEmbeddableFactories);
    expect(await action.isCompatible({
        embeddable: new embeddable_plugin_test_samples_1.ContactCardEmbeddable({ firstName: 'sue', id: '123' }, { execAction: (() => null) }),
    })).toBe(false);
});
test('Execute throws an error when called with an embeddable not in a parent', async () => {
    let SavedObjectFinder;
    let notifications;
    const action = new replace_panel_action_1.ReplacePanelAction(coreStart, SavedObjectFinder, notifications, start.getEmbeddableFactories);
    async function check() {
        await action.execute({ embeddable: container });
    }
    await expect(check()).rejects.toThrow(Error);
});
test('Returns title', async () => {
    let SavedObjectFinder;
    let notifications;
    const action = new replace_panel_action_1.ReplacePanelAction(coreStart, SavedObjectFinder, notifications, start.getEmbeddableFactories);
    expect(action.getDisplayName({ embeddable })).toBeDefined();
});
test('Returns an icon', async () => {
    let SavedObjectFinder;
    let notifications;
    const action = new replace_panel_action_1.ReplacePanelAction(coreStart, SavedObjectFinder, notifications, start.getEmbeddableFactories);
    expect(action.getIconType({ embeddable })).toBeDefined();
});
