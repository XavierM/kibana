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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const embeddable_plugin_1 = require("../../embeddable_plugin");
const dashboard_container_1 = require("./dashboard_container");
const test_helpers_1 = require("../test_helpers");
const embeddable_plugin_test_samples_1 = require("../../embeddable_plugin_test_samples");
// eslint-disable-next-line
const mocks_1 = require("src/plugins/embeddable/public/mocks");
const options = {
    application: {},
    embeddable: {},
    notifications: {},
    overlays: {},
    inspector: {},
    SavedObjectFinder: () => null,
    ExitFullScreenButton: () => null,
    uiActions: {},
};
beforeEach(() => {
    const { setup, doStart } = mocks_1.embeddablePluginMock.createInstance();
    setup.registerEmbeddableFactory(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, new embeddable_plugin_test_samples_1.ContactCardEmbeddableFactory((() => null), {}));
    options.embeddable = doStart();
});
test('DashboardContainer initializes embeddables', async (done) => {
    const initialInput = test_helpers_1.getSampleDashboardInput({
        panels: {
            '123': test_helpers_1.getSampleDashboardPanel({
                explicitInput: { firstName: 'Sam', id: '123' },
                type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
            }),
        },
    });
    const container = new dashboard_container_1.DashboardContainer(initialInput, options);
    const subscription = container.getOutput$().subscribe(output => {
        if (container.getOutput().embeddableLoaded['123']) {
            const embeddable = container.getChild('123');
            expect(embeddable).toBeDefined();
            expect(embeddable.id).toBe('123');
            done();
        }
    });
    if (container.getOutput().embeddableLoaded['123']) {
        const embeddable = container.getChild('123');
        expect(embeddable).toBeDefined();
        expect(embeddable.id).toBe('123');
        subscription.unsubscribe();
        done();
    }
});
test('DashboardContainer.addNewEmbeddable', async () => {
    const container = new dashboard_container_1.DashboardContainer(test_helpers_1.getSampleDashboardInput(), options);
    const embeddable = await container.addNewEmbeddable(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Kibana',
    });
    expect(embeddable).toBeDefined();
    if (!embeddable_plugin_1.isErrorEmbeddable(embeddable)) {
        expect(embeddable.getInput().firstName).toBe('Kibana');
    }
    else {
        expect(false).toBe(true);
    }
    const embeddableInContainer = container.getChild(embeddable.id);
    expect(embeddableInContainer).toBeDefined();
    expect(embeddableInContainer.id).toBe(embeddable.id);
});
test('Container view mode change propagates to existing children', async () => {
    const initialInput = test_helpers_1.getSampleDashboardInput({
        panels: {
            '123': test_helpers_1.getSampleDashboardPanel({
                explicitInput: { firstName: 'Sam', id: '123' },
                type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
            }),
        },
    });
    const container = new dashboard_container_1.DashboardContainer(initialInput, options);
    await enzyme_helpers_1.nextTick();
    const embeddable = await container.getChild('123');
    expect(embeddable.getInput().viewMode).toBe(embeddable_plugin_1.ViewMode.VIEW);
    container.updateInput({ viewMode: embeddable_plugin_1.ViewMode.EDIT });
    expect(embeddable.getInput().viewMode).toBe(embeddable_plugin_1.ViewMode.EDIT);
});
test('Container view mode change propagates to new children', async () => {
    const container = new dashboard_container_1.DashboardContainer(test_helpers_1.getSampleDashboardInput(), options);
    const embeddable = await container.addNewEmbeddable(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, {
        firstName: 'Bob',
    });
    expect(embeddable.getInput().viewMode).toBe(embeddable_plugin_1.ViewMode.VIEW);
    container.updateInput({ viewMode: embeddable_plugin_1.ViewMode.EDIT });
    expect(embeddable.getInput().viewMode).toBe(embeddable_plugin_1.ViewMode.EDIT);
});
