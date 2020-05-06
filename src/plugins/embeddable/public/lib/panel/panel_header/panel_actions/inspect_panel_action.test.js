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
const inspect_panel_action_1 = require("./inspect_panel_action");
const test_samples_1 = require("../../../test_samples");
// eslint-disable-next-line
const mocks_1 = require("../../../../../../../plugins/inspector/public/mocks");
const embeddables_1 = require("../../../embeddables");
const helpers_1 = require("../../../../tests/helpers");
const public_1 = require("../../../../../../../plugins/data/public");
const mocks_2 = require("../../../../mocks");
const setupTests = async () => {
    const { setup, doStart } = mocks_2.embeddablePluginMock.createInstance();
    setup.registerEmbeddableFactory(test_samples_1.FILTERABLE_EMBEDDABLE, new test_samples_1.FilterableEmbeddableFactory());
    const getFactory = doStart().getEmbeddableFactory;
    const container = new test_samples_1.FilterableContainer({
        id: 'hello',
        panels: {},
        filters: [
            {
                $state: { store: public_1.esFilters.FilterStateStore.APP_STATE },
                meta: { disabled: false, alias: 'name', negate: false },
                query: { match: {} },
            },
        ],
    }, getFactory);
    const embeddable = await container.addNewEmbeddable(test_samples_1.FILTERABLE_EMBEDDABLE, {
        id: '123',
    });
    if (embeddables_1.isErrorEmbeddable(embeddable)) {
        throw new Error('Error creating new filterable embeddable');
    }
    return {
        embeddable,
        container,
    };
};
test('Is compatible when inspector adapters are available', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    inspector.isAvailable.mockImplementation(() => true);
    const { embeddable } = await setupTests();
    const inspectAction = new inspect_panel_action_1.InspectPanelAction(inspector);
    expect(await inspectAction.isCompatible({ embeddable })).toBe(true);
    expect(inspector.isAvailable).toHaveBeenCalledTimes(1);
    expect(inspector.isAvailable.mock.calls[0][0]).toMatchObject({
        filters: expect.any(String),
    });
});
test('Is not compatible when inspector adapters are not available', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    inspector.isAvailable.mockImplementation(() => false);
    const inspectAction = new inspect_panel_action_1.InspectPanelAction(inspector);
    expect(await inspectAction.isCompatible({
        embeddable: new test_samples_1.ContactCardEmbeddable({
            firstName: 'Davos',
            lastName: 'Seaworth',
            id: '123',
        }, { execAction: () => Promise.resolve(undefined) }),
    })).toBe(false);
    expect(inspector.isAvailable).toHaveBeenCalledTimes(1);
    expect(inspector.isAvailable.mock.calls[0][0]).toMatchInlineSnapshot(`undefined`);
});
test('Executes when inspector adapters are available', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    inspector.isAvailable.mockImplementation(() => true);
    const { embeddable } = await setupTests();
    const inspectAction = new inspect_panel_action_1.InspectPanelAction(inspector);
    expect(inspector.open).toHaveBeenCalledTimes(0);
    await inspectAction.execute({ embeddable });
    expect(inspector.open).toHaveBeenCalledTimes(1);
});
test('Execute throws an error when inspector adapters are not available', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    inspector.isAvailable.mockImplementation(() => false);
    const inspectAction = new inspect_panel_action_1.InspectPanelAction(inspector);
    const [, error] = await helpers_1.of(inspectAction.execute({
        embeddable: new test_samples_1.ContactCardEmbeddable({
            firstName: 'John',
            lastName: 'Snow',
            id: '123',
        }, { execAction: () => Promise.resolve(undefined) }),
    }));
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatchInlineSnapshot(`"Action not compatible with context"`);
});
test('Returns title', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const inspectAction = new inspect_panel_action_1.InspectPanelAction(inspector);
    expect(inspectAction.getDisplayName()).toBe('Inspect');
});
test('Returns an icon', async () => {
    const inspector = mocks_1.inspectorPluginMock.createStartContract();
    const inspectAction = new inspect_panel_action_1.InspectPanelAction(inspector);
    expect(inspectAction.getIconType()).toBe('inspect');
});
