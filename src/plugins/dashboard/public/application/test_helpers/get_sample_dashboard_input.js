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
const embeddable_plugin_1 = require("../../embeddable_plugin");
function getSampleDashboardInput(overrides) {
    return {
        id: '123',
        filters: [],
        useMargins: false,
        isFullScreenMode: false,
        title: 'My Dashboard',
        query: {
            language: 'kuery',
            query: 'hi',
        },
        timeRange: {
            to: 'now',
            from: 'now-15m',
        },
        viewMode: embeddable_plugin_1.ViewMode.VIEW,
        panels: {},
        ...overrides,
    };
}
exports.getSampleDashboardInput = getSampleDashboardInput;
function getSampleDashboardPanel(overrides) {
    return {
        gridData: {
            h: 15,
            w: 15,
            x: 0,
            y: 0,
            i: overrides.explicitInput.id,
        },
        type: overrides.type,
        explicitInput: overrides.explicitInput,
        ...overrides,
    };
}
exports.getSampleDashboardPanel = getSampleDashboardPanel;
