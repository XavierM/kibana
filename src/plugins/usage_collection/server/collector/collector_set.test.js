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
const lodash_1 = require("lodash");
const collector_1 = require("./collector");
const collector_set_1 = require("./collector_set");
const usage_collector_1 = require("./usage_collector");
const mocks_1 = require("../../../../core/server/mocks");
const logger = mocks_1.loggingServiceMock.createLogger();
const loggerSpies = {
    debug: jest.spyOn(logger, 'debug'),
    warn: jest.spyOn(logger, 'warn'),
};
describe('CollectorSet', () => {
    describe('registers a collector set and runs lifecycle events', () => {
        let init;
        let fetch;
        beforeEach(() => {
            init = lodash_1.noop;
            fetch = lodash_1.noop;
            loggerSpies.debug.mockRestore();
            loggerSpies.warn.mockRestore();
        });
        const mockCallCluster = () => Promise.resolve({ passTest: 1000 });
        it('should throw an error if non-Collector type of object is registered', () => {
            const collectors = new collector_set_1.CollectorSet({ logger });
            const registerPojo = () => {
                collectors.registerCollector({
                    type: 'type_collector_test',
                    init,
                    fetch,
                }); // We are intentionally sending it wrong.
            };
            expect(registerPojo).toThrowError('CollectorSet can only have Collector instances registered');
        });
        it('should log debug status of fetching from the collector', async () => {
            const collectors = new collector_set_1.CollectorSet({ logger });
            collectors.registerCollector(new collector_1.Collector(logger, {
                type: 'MY_TEST_COLLECTOR',
                fetch: (caller) => caller(),
                isReady: () => true,
            }));
            const result = await collectors.bulkFetch(mockCallCluster);
            expect(loggerSpies.debug).toHaveBeenCalledTimes(1);
            expect(loggerSpies.debug).toHaveBeenCalledWith('Fetching data from MY_TEST_COLLECTOR collector');
            expect(result).toStrictEqual([
                {
                    type: 'MY_TEST_COLLECTOR',
                    result: { passTest: 1000 },
                },
            ]);
        });
        it('should gracefully handle a collector fetch method throwing an error', async () => {
            const collectors = new collector_set_1.CollectorSet({ logger });
            collectors.registerCollector(new collector_1.Collector(logger, {
                type: 'MY_TEST_COLLECTOR',
                fetch: () => new Promise((_resolve, reject) => reject()),
                isReady: () => true,
            }));
            let result;
            try {
                result = await collectors.bulkFetch(mockCallCluster);
            }
            catch (err) {
                // Do nothing
            }
            // This must return an empty object instead of null/undefined
            expect(result).toStrictEqual([]);
        });
        it('should not break if isReady is not a function', async () => {
            const collectors = new collector_set_1.CollectorSet({ logger });
            collectors.registerCollector(new collector_1.Collector(logger, {
                type: 'MY_TEST_COLLECTOR',
                fetch: () => ({ test: 1 }),
                isReady: true,
            }));
            const result = await collectors.bulkFetch(mockCallCluster);
            expect(result).toStrictEqual([
                {
                    type: 'MY_TEST_COLLECTOR',
                    result: { test: 1 },
                },
            ]);
        });
        it('should not break if isReady is not provided', async () => {
            const collectors = new collector_set_1.CollectorSet({ logger });
            collectors.registerCollector(new collector_1.Collector(logger, {
                type: 'MY_TEST_COLLECTOR',
                fetch: () => ({ test: 1 }),
            }));
            const result = await collectors.bulkFetch(mockCallCluster);
            expect(result).toStrictEqual([
                {
                    type: 'MY_TEST_COLLECTOR',
                    result: { test: 1 },
                },
            ]);
        });
        it('should infer the types from the implementations of fetch and formatForBulkUpload', async () => {
            const collectors = new collector_set_1.CollectorSet({ logger });
            collectors.registerCollector(new collector_1.Collector(logger, {
                type: 'MY_TEST_COLLECTOR',
                fetch: () => ({ test: 1 }),
                formatForBulkUpload: result => ({
                    type: 'MY_TEST_COLLECTOR',
                    payload: { test: result.test * 2 },
                }),
                isReady: () => true,
            }));
            const result = await collectors.bulkFetch(mockCallCluster);
            expect(result).toStrictEqual([
                {
                    type: 'MY_TEST_COLLECTOR',
                    result: { test: 1 },
                },
            ]);
        });
    });
    describe('toApiFieldNames', () => {
        let collectorSet;
        beforeEach(() => {
            collectorSet = new collector_set_1.CollectorSet({ logger });
        });
        it('should snake_case and convert field names to api standards', () => {
            const apiData = {
                os: {
                    load: {
                        '15m': 2.3525390625,
                        '1m': 2.22412109375,
                        '5m': 2.4462890625,
                    },
                    memory: {
                        free_in_bytes: 458280960,
                        total_in_bytes: 17179869184,
                        used_in_bytes: 16721588224,
                    },
                    uptime_in_millis: 137844000,
                },
                daysOfTheWeek: ['monday', 'tuesday', 'wednesday'],
            };
            const result = collectorSet.toApiFieldNames(apiData);
            expect(result).toStrictEqual({
                os: {
                    load: { '15m': 2.3525390625, '1m': 2.22412109375, '5m': 2.4462890625 },
                    memory: { free_bytes: 458280960, total_bytes: 17179869184, used_bytes: 16721588224 },
                    uptime_ms: 137844000,
                },
                days_of_the_week: ['monday', 'tuesday', 'wednesday'],
            });
        });
        it('should correct object key fields nested in arrays', () => {
            const apiData = {
                daysOfTheWeek: [
                    {
                        dayName: 'monday',
                        dayIndex: 1,
                    },
                    {
                        dayName: 'tuesday',
                        dayIndex: 2,
                    },
                    {
                        dayName: 'wednesday',
                        dayIndex: 3,
                    },
                ],
            };
            const result = collectorSet.toApiFieldNames(apiData);
            expect(result).toStrictEqual({
                days_of_the_week: [
                    { day_index: 1, day_name: 'monday' },
                    { day_index: 2, day_name: 'tuesday' },
                    { day_index: 3, day_name: 'wednesday' },
                ],
            });
        });
    });
    describe('isUsageCollector', () => {
        const collectorOptions = { type: 'MY_TEST_COLLECTOR', fetch: () => { }, isReady: () => true };
        it('returns true only for UsageCollector instances', () => {
            const collectors = new collector_set_1.CollectorSet({ logger });
            const usageCollector = new usage_collector_1.UsageCollector(logger, collectorOptions);
            const collector = new collector_1.Collector(logger, collectorOptions);
            const randomClass = new (class Random {
            })();
            expect(collectors.isUsageCollector(usageCollector)).toEqual(true);
            expect(collectors.isUsageCollector(collector)).toEqual(false);
            expect(collectors.isUsageCollector(randomClass)).toEqual(false);
            expect(collectors.isUsageCollector({})).toEqual(false);
            expect(collectors.isUsageCollector(null)).toEqual(false);
            expect(collectors.isUsageCollector('')).toEqual(false);
            expect(collectors.isUsageCollector(void 0)).toEqual(false);
        });
    });
});
