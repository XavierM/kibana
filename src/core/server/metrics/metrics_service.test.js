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
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const metrics_service_test_mocks_1 = require("./metrics_service.test.mocks");
const metrics_service_1 = require("./metrics_service");
const core_context_mock_1 = require("../core_context.mock");
const config_service_mock_1 = require("../config/config_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const operators_1 = require("rxjs/operators");
const testInterval = 100;
const dummyMetrics = { metricA: 'value', metricB: 'otherValue' };
describe('MetricsService', () => {
    const httpMock = http_service_mock_1.httpServiceMock.createSetupContract();
    let metricsService;
    beforeEach(() => {
        jest.useFakeTimers();
        const configService = config_service_mock_1.configServiceMock.create({
            atPath: { interval: moment_1.default.duration(testInterval) },
        });
        const coreContext = core_context_mock_1.mockCoreContext.create({ configService });
        metricsService = new metrics_service_1.MetricsService(coreContext);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    describe('#start', () => {
        it('invokes setInterval with the configured interval', async () => {
            await metricsService.setup({ http: httpMock });
            await metricsService.start();
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), testInterval);
        });
        it('collects the metrics at every interval', async () => {
            metrics_service_test_mocks_1.mockOpsCollector.collect.mockResolvedValue(dummyMetrics);
            await metricsService.setup({ http: httpMock });
            await metricsService.start();
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(testInterval);
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(2);
            jest.advanceTimersByTime(testInterval);
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(3);
        });
        it('resets the collector after each collection', async () => {
            metrics_service_test_mocks_1.mockOpsCollector.collect.mockResolvedValue(dummyMetrics);
            const { getOpsMetrics$ } = await metricsService.setup({ http: httpMock });
            await metricsService.start();
            // `advanceTimersByTime` only ensure the interval handler is executed
            // however the `reset` call is executed after the async call to `collect`
            // meaning that we are going to miss the call if we don't wait for the
            // actual observable emission that is performed after
            const waitForNextEmission = () => getOpsMetrics$()
                .pipe(operators_1.take(1))
                .toPromise();
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(1);
            expect(metrics_service_test_mocks_1.mockOpsCollector.reset).toHaveBeenCalledTimes(1);
            let nextEmission = waitForNextEmission();
            jest.advanceTimersByTime(testInterval);
            await nextEmission;
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(2);
            expect(metrics_service_test_mocks_1.mockOpsCollector.reset).toHaveBeenCalledTimes(2);
            nextEmission = waitForNextEmission();
            jest.advanceTimersByTime(testInterval);
            await nextEmission;
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(3);
            expect(metrics_service_test_mocks_1.mockOpsCollector.reset).toHaveBeenCalledTimes(3);
        });
        it('throws when called before setup', async () => {
            await expect(metricsService.start()).rejects.toThrowErrorMatchingInlineSnapshot(`"#setup() needs to be run first"`);
        });
    });
    describe('#stop', () => {
        it('stops the metrics interval', async () => {
            const { getOpsMetrics$ } = await metricsService.setup({ http: httpMock });
            await metricsService.start();
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(testInterval);
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(2);
            await metricsService.stop();
            jest.advanceTimersByTime(10 * testInterval);
            expect(metrics_service_test_mocks_1.mockOpsCollector.collect).toHaveBeenCalledTimes(2);
            getOpsMetrics$().subscribe({ complete: () => { } });
        });
        it('completes the metrics observable', async () => {
            const { getOpsMetrics$ } = await metricsService.setup({ http: httpMock });
            await metricsService.start();
            let completed = false;
            getOpsMetrics$().subscribe({
                complete: () => {
                    completed = true;
                },
            });
            await metricsService.stop();
            expect(completed).toEqual(true);
        });
    });
});
