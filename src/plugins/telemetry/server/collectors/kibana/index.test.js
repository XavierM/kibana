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
const mocks_1 = require("../../../../../core/server/mocks");
const _1 = require("./");
describe('telemetry_kibana', () => {
    let collector;
    const usageCollectionMock = {
        makeUsageCollector: jest.fn().mockImplementation(config => (collector = config)),
        registerCollector: jest.fn(),
    };
    const legacyConfig$ = mocks_1.pluginInitializerContextConfigMock({}).legacy.globalConfig$;
    const callCluster = jest.fn().mockImplementation(() => ({}));
    beforeAll(() => _1.registerKibanaUsageCollector(usageCollectionMock, legacyConfig$));
    afterAll(() => jest.clearAllTimers());
    test('registered collector is set', () => {
        expect(collector).not.toBeUndefined();
        expect(collector.type).toBe('kibana');
    });
    test('fetch', async () => {
        expect(await collector.fetch(callCluster)).toStrictEqual({
            index: '.kibana-tests',
            dashboard: { total: 0 },
            visualization: { total: 0 },
            search: { total: 0 },
            index_pattern: { total: 0 },
            graph_workspace: { total: 0 },
            timelion_sheet: { total: 0 },
        });
    });
    test('formatForBulkUpload', async () => {
        const resultFromFetch = {
            index: '.kibana-tests',
            dashboard: { total: 0 },
            visualization: { total: 0 },
            search: { total: 0 },
            index_pattern: { total: 0 },
            graph_workspace: { total: 0 },
            timelion_sheet: { total: 0 },
        };
        expect(collector.formatForBulkUpload(resultFromFetch)).toStrictEqual({
            type: 'kibana_stats',
            payload: {
                usage: resultFromFetch,
            },
        });
    });
});
