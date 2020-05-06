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
const range_control_factory_1 = require("./range_control_factory");
const editor_utils_1 = require("../editor_utils");
const test_utils_1 = require("../test_utils");
describe('rangeControlFactory', () => {
    describe('fetch', () => {
        const controlParams = {
            id: '1',
            fieldName: 'myNumberField',
            options: {},
            type: editor_utils_1.CONTROL_TYPES.RANGE,
            label: 'test',
            indexPattern: {},
            parent: {},
        };
        const useTimeFilter = false;
        test('should set min and max from aggregation results', async () => {
            const esSearchResponse = {
                aggregations: {
                    maxAgg: { value: 100 },
                    minAgg: { value: 10 },
                },
            };
            const searchSourceMock = test_utils_1.getSearchSourceMock(esSearchResponse);
            const deps = test_utils_1.getDepsMock({
                searchSource: {
                    create: searchSourceMock,
                },
            });
            const rangeControl = await range_control_factory_1.rangeControlFactory(controlParams, useTimeFilter, deps);
            await rangeControl.fetch();
            expect(rangeControl.isEnabled()).toBe(true);
            expect(rangeControl.min).toBe(10);
            expect(rangeControl.max).toBe(100);
        });
        test('should disable control when there are 0 hits', async () => {
            // ES response when the query does not match any documents
            const esSearchResponse = {
                aggregations: {
                    maxAgg: { value: null },
                    minAgg: { value: null },
                },
            };
            const searchSourceMock = test_utils_1.getSearchSourceMock(esSearchResponse);
            const deps = test_utils_1.getDepsMock({
                searchSource: {
                    create: searchSourceMock,
                },
            });
            const rangeControl = await range_control_factory_1.rangeControlFactory(controlParams, useTimeFilter, deps);
            await rangeControl.fetch();
            expect(rangeControl.isEnabled()).toBe(false);
        });
        test('should disable control when response is empty', async () => {
            // ES response for dashboardonly user who does not have read permissions on index is 200 (which is weird)
            // and there is not aggregations key
            const esSearchResponse = {};
            const searchSourceMock = test_utils_1.getSearchSourceMock(esSearchResponse);
            const deps = test_utils_1.getDepsMock({
                searchSource: {
                    create: searchSourceMock,
                },
            });
            const rangeControl = await range_control_factory_1.rangeControlFactory(controlParams, useTimeFilter, deps);
            await rangeControl.fetch();
            expect(rangeControl.isEnabled()).toBe(false);
        });
    });
});
