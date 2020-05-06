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
const telemetry_application_usage_collector_1 = require("./telemetry_application_usage_collector");
describe('telemetry_application_usage', () => {
    jest.useFakeTimers();
    let collector;
    const usageCollectionMock = {
        makeUsageCollector: jest.fn().mockImplementation(config => (collector = config)),
        registerCollector: jest.fn(),
    };
    const getUsageCollector = jest.fn();
    const registerType = jest.fn();
    const callCluster = jest.fn();
    beforeAll(() => _1.registerApplicationUsageCollector(usageCollectionMock, registerType, getUsageCollector));
    afterAll(() => jest.clearAllTimers());
    test('registered collector is set', () => {
        expect(collector).not.toBeUndefined();
    });
    test('if no savedObjectClient initialised, return undefined', async () => {
        expect(await collector.fetch(callCluster)).toBeUndefined();
        jest.runTimersToTime(telemetry_application_usage_collector_1.ROLL_INDICES_INTERVAL);
    });
    test('when savedObjectClient is initialised, return something', async () => {
        const savedObjectClient = mocks_1.savedObjectsRepositoryMock.create();
        savedObjectClient.find.mockImplementation(async () => ({
            saved_objects: [],
            total: 0,
        }));
        getUsageCollector.mockImplementation(() => savedObjectClient);
        jest.runTimersToTime(telemetry_application_usage_collector_1.ROLL_INDICES_INTERVAL); // Force rollTotals to run
        expect(await collector.fetch(callCluster)).toStrictEqual({});
        expect(savedObjectClient.bulkCreate).not.toHaveBeenCalled();
    });
    test('paging in findAll works', async () => {
        const savedObjectClient = mocks_1.savedObjectsRepositoryMock.create();
        let total = 201;
        savedObjectClient.find.mockImplementation(async (opts) => {
            if (opts.type === telemetry_application_usage_collector_1.SAVED_OBJECTS_TOTAL_TYPE) {
                return {
                    saved_objects: [
                        {
                            id: 'appId',
                            attributes: {
                                appId: 'appId',
                                minutesOnScreen: 10,
                                numberOfClicks: 10,
                            },
                        },
                    ],
                    total: 1,
                };
            }
            if ((opts.page || 1) > 2) {
                return { saved_objects: [], total };
            }
            const doc = {
                id: 'test-id',
                attributes: {
                    appId: 'appId',
                    timestamp: new Date().toISOString(),
                    minutesOnScreen: 1,
                    numberOfClicks: 1,
                },
            };
            const savedObjects = new Array(opts.perPage).fill(doc);
            total = savedObjects.length * 2 + 1;
            return { saved_objects: savedObjects, total };
        });
        getUsageCollector.mockImplementation(() => savedObjectClient);
        jest.runTimersToTime(telemetry_application_usage_collector_1.ROLL_INDICES_INTERVAL); // Force rollTotals to run
        expect(await collector.fetch(callCluster)).toStrictEqual({
            appId: {
                clicks_total: total - 1 + 10,
                clicks_7_days: total - 1,
                clicks_30_days: total - 1,
                clicks_90_days: total - 1,
                minutes_on_screen_total: total - 1 + 10,
                minutes_on_screen_7_days: total - 1,
                minutes_on_screen_30_days: total - 1,
                minutes_on_screen_90_days: total - 1,
            },
        });
        expect(savedObjectClient.bulkCreate).toHaveBeenCalledWith([
            {
                id: 'appId',
                type: telemetry_application_usage_collector_1.SAVED_OBJECTS_TOTAL_TYPE,
                attributes: {
                    appId: 'appId',
                    minutesOnScreen: total - 1 + 10,
                    numberOfClicks: total - 1 + 10,
                },
            },
        ], { overwrite: true });
        expect(savedObjectClient.delete).toHaveBeenCalledTimes(total - 1);
        expect(savedObjectClient.delete).toHaveBeenCalledWith(telemetry_application_usage_collector_1.SAVED_OBJECTS_TRANSACTIONAL_TYPE, 'test-id');
    });
});
