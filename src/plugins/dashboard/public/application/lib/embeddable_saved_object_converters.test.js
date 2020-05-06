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
const embeddable_saved_object_converters_1 = require("./embeddable_saved_object_converters");
test('convertSavedDashboardPanelToPanelState', () => {
    const savedDashboardPanel = {
        type: 'search',
        embeddableConfig: {
            something: 'hi!',
        },
        id: 'savedObjectId',
        panelIndex: '123',
        gridData: {
            x: 0,
            y: 0,
            h: 15,
            w: 15,
            i: '123',
        },
        version: '7.0.0',
    };
    expect(embeddable_saved_object_converters_1.convertSavedDashboardPanelToPanelState(savedDashboardPanel)).toEqual({
        gridData: {
            x: 0,
            y: 0,
            h: 15,
            w: 15,
            i: '123',
        },
        explicitInput: {
            something: 'hi!',
            id: '123',
            savedObjectId: 'savedObjectId',
        },
        type: 'search',
    });
});
test('convertSavedDashboardPanelToPanelState does not include undefined id', () => {
    const savedDashboardPanel = {
        type: 'search',
        embeddableConfig: {
            something: 'hi!',
        },
        panelIndex: '123',
        gridData: {
            x: 0,
            y: 0,
            h: 15,
            w: 15,
            i: '123',
        },
        version: '7.0.0',
    };
    const converted = embeddable_saved_object_converters_1.convertSavedDashboardPanelToPanelState(savedDashboardPanel);
    expect(converted.hasOwnProperty('savedObjectId')).toBe(false);
});
test('convertPanelStateToSavedDashboardPanel', () => {
    const dashboardPanel = {
        gridData: {
            x: 0,
            y: 0,
            h: 15,
            w: 15,
            i: '123',
        },
        explicitInput: {
            something: 'hi!',
            id: '123',
            savedObjectId: 'savedObjectId',
        },
        type: 'search',
    };
    expect(embeddable_saved_object_converters_1.convertPanelStateToSavedDashboardPanel(dashboardPanel, '6.3.0')).toEqual({
        type: 'search',
        embeddableConfig: {
            something: 'hi!',
        },
        id: 'savedObjectId',
        panelIndex: '123',
        gridData: {
            x: 0,
            y: 0,
            h: 15,
            w: 15,
            i: '123',
        },
        version: '6.3.0',
    });
});
test('convertPanelStateToSavedDashboardPanel will not add an undefined id when not needed', () => {
    const dashboardPanel = {
        gridData: {
            x: 0,
            y: 0,
            h: 15,
            w: 15,
            i: '123',
        },
        explicitInput: {
            id: '123',
            something: 'hi!',
        },
        type: 'search',
    };
    const converted = embeddable_saved_object_converters_1.convertPanelStateToSavedDashboardPanel(dashboardPanel, '8.0.0');
    expect(converted.hasOwnProperty('id')).toBe(false);
});
