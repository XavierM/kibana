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
const dashboard_constants_1 = require("../dashboard_constants");
const create_panel_state_1 = require("./create_panel_state");
const embeddable_plugin_test_samples_1 = require("../../../embeddable_plugin_test_samples");
const panels = {};
test('createPanelState adds a new panel state in 0,0 position', () => {
    const panelState = create_panel_state_1.createPanelState({
        type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
        explicitInput: { test: 'hi', id: '123' },
    }, panels);
    expect(panelState.explicitInput.test).toBe('hi');
    expect(panelState.type).toBe(embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE);
    expect(panelState.explicitInput.id).toBeDefined();
    expect(panelState.gridData.x).toBe(0);
    expect(panelState.gridData.y).toBe(0);
    expect(panelState.gridData.h).toBe(dashboard_constants_1.DEFAULT_PANEL_HEIGHT);
    expect(panelState.gridData.w).toBe(dashboard_constants_1.DEFAULT_PANEL_WIDTH);
    panels[panelState.explicitInput.id] = panelState;
});
test('createPanelState adds a second new panel state', () => {
    const panelState = create_panel_state_1.createPanelState({ type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE, explicitInput: { test: 'bye', id: '456' } }, panels);
    expect(panelState.gridData.x).toBe(dashboard_constants_1.DEFAULT_PANEL_WIDTH);
    expect(panelState.gridData.y).toBe(0);
    expect(panelState.gridData.h).toBe(dashboard_constants_1.DEFAULT_PANEL_HEIGHT);
    expect(panelState.gridData.w).toBe(dashboard_constants_1.DEFAULT_PANEL_WIDTH);
    panels[panelState.explicitInput.id] = panelState;
});
test('createPanelState adds a third new panel state', () => {
    const panelState = create_panel_state_1.createPanelState({
        type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
        explicitInput: { test: 'bye', id: '789' },
    }, panels);
    expect(panelState.gridData.x).toBe(0);
    expect(panelState.gridData.y).toBe(dashboard_constants_1.DEFAULT_PANEL_HEIGHT);
    expect(panelState.gridData.h).toBe(dashboard_constants_1.DEFAULT_PANEL_HEIGHT);
    expect(panelState.gridData.w).toBe(dashboard_constants_1.DEFAULT_PANEL_WIDTH);
    panels[panelState.explicitInput.id] = panelState;
});
test('createPanelState adds a new panel state in the top most position', () => {
    delete panels['456'];
    const panelState = create_panel_state_1.createPanelState({
        type: embeddable_plugin_test_samples_1.CONTACT_CARD_EMBEDDABLE,
        explicitInput: { test: 'bye', id: '987' },
    }, panels);
    expect(panelState.gridData.x).toBe(dashboard_constants_1.DEFAULT_PANEL_WIDTH);
    expect(panelState.gridData.y).toBe(0);
    expect(panelState.gridData.h).toBe(dashboard_constants_1.DEFAULT_PANEL_HEIGHT);
    expect(panelState.gridData.w).toBe(dashboard_constants_1.DEFAULT_PANEL_WIDTH);
});
