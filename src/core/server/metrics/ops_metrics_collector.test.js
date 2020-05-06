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
const ops_metrics_collector_test_mocks_1 = require("./ops_metrics_collector.test.mocks");
const http_service_mock_1 = require("../http/http_service.mock");
const ops_metrics_collector_1 = require("./ops_metrics_collector");
describe('OpsMetricsCollector', () => {
    let collector;
    beforeEach(() => {
        const hapiServer = http_service_mock_1.httpServiceMock.createSetupContract().server;
        collector = new ops_metrics_collector_1.OpsMetricsCollector(hapiServer);
        ops_metrics_collector_test_mocks_1.mockOsCollector.collect.mockResolvedValue('osMetrics');
    });
    describe('#collect', () => {
        it('gathers metrics from the underlying collectors', async () => {
            ops_metrics_collector_test_mocks_1.mockOsCollector.collect.mockResolvedValue('osMetrics');
            ops_metrics_collector_test_mocks_1.mockProcessCollector.collect.mockResolvedValue('processMetrics');
            ops_metrics_collector_test_mocks_1.mockServerCollector.collect.mockResolvedValue({
                requests: 'serverRequestsMetrics',
                response_times: 'serverTimingMetrics',
            });
            const metrics = await collector.collect();
            expect(ops_metrics_collector_test_mocks_1.mockOsCollector.collect).toHaveBeenCalledTimes(1);
            expect(ops_metrics_collector_test_mocks_1.mockProcessCollector.collect).toHaveBeenCalledTimes(1);
            expect(ops_metrics_collector_test_mocks_1.mockServerCollector.collect).toHaveBeenCalledTimes(1);
            expect(metrics).toEqual({
                process: 'processMetrics',
                os: 'osMetrics',
                requests: 'serverRequestsMetrics',
                response_times: 'serverTimingMetrics',
            });
        });
    });
    describe('#reset', () => {
        it('call reset on the underlying collectors', () => {
            collector.reset();
            expect(ops_metrics_collector_test_mocks_1.mockOsCollector.reset).toHaveBeenCalledTimes(1);
            expect(ops_metrics_collector_test_mocks_1.mockProcessCollector.reset).toHaveBeenCalledTimes(1);
            expect(ops_metrics_collector_test_mocks_1.mockServerCollector.reset).toHaveBeenCalledTimes(1);
            collector.reset();
            expect(ops_metrics_collector_test_mocks_1.mockOsCollector.reset).toHaveBeenCalledTimes(2);
            expect(ops_metrics_collector_test_mocks_1.mockProcessCollector.reset).toHaveBeenCalledTimes(2);
            expect(ops_metrics_collector_test_mocks_1.mockServerCollector.reset).toHaveBeenCalledTimes(2);
        });
    });
});
