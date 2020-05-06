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
const derivative_1 = require("./derivative");
const cumulative_sum_1 = require("./cumulative_sum");
const moving_avg_1 = require("./moving_avg");
const serial_diff_1 = require("./serial_diff");
const agg_configs_1 = require("../agg_configs");
const test_helpers_1 = require("../test_helpers");
const mocks_1 = require("../../../field_formats/mocks");
const mocks_2 = require("../../../../../../../src/core/public/mocks");
describe('parent pipeline aggs', function () {
    const getInternalStartServices = () => ({
        fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
        notifications: mocks_2.notificationServiceMock.createStartContract(),
    });
    const typesRegistry = test_helpers_1.mockAggTypesRegistry();
    const metrics = [
        {
            name: 'derivative',
            title: 'Derivative',
            provider: derivative_1.getDerivativeMetricAgg({ getInternalStartServices }),
        },
        {
            name: 'cumulative_sum',
            title: 'Cumulative Sum',
            provider: cumulative_sum_1.getCumulativeSumMetricAgg({ getInternalStartServices }),
        },
        {
            name: 'moving_avg',
            title: 'Moving Avg',
            provider: moving_avg_1.getMovingAvgMetricAgg({ getInternalStartServices }),
            dslName: 'moving_fn',
        },
        {
            name: 'serial_diff',
            title: 'Serial Diff',
            provider: serial_diff_1.getSerialDiffMetricAgg({ getInternalStartServices }),
        },
    ];
    metrics.forEach(metric => {
        describe(`${metric.title} metric`, () => {
            let aggDsl;
            let metricAgg;
            let aggConfig;
            const init = (params = {
                metricAgg: '1',
                customMetric: null,
            }) => {
                const field = {
                    name: 'field',
                    format: {
                        type: {
                            id: 'bytes',
                        },
                    },
                };
                const indexPattern = {
                    id: '1234',
                    title: 'logstash-*',
                    fields: {
                        getByName: () => field,
                        filter: () => [field],
                    },
                };
                const aggConfigs = new agg_configs_1.AggConfigs(indexPattern, [
                    {
                        id: '1',
                        type: 'count',
                        schema: 'metric',
                    },
                    {
                        id: '2',
                        type: metric.name,
                        schema: 'metric',
                        params,
                    },
                    {
                        id: '3',
                        type: 'max',
                        params: { field: 'field' },
                        schema: 'metric',
                    },
                ], { typesRegistry, fieldFormats: getInternalStartServices().fieldFormats });
                // Grab the aggConfig off the vis (we don't actually use the vis for anything else)
                metricAgg = metric.provider;
                aggConfig = aggConfigs.aggs[1];
                aggDsl = aggConfig.toDsl(aggConfigs);
            };
            it(`should return a label prefixed with ${metric.title} of`, () => {
                init();
                expect(metricAgg.makeLabel(aggConfig)).toEqual(`${metric.title} of Count`);
            });
            it(`should return a label ${metric.title} of max bytes`, () => {
                init({
                    metricAgg: 'custom',
                    customMetric: {
                        id: '1-orderAgg',
                        type: 'max',
                        params: { field: 'field' },
                        schema: 'orderAgg',
                    },
                });
                expect(metricAgg.makeLabel(aggConfig)).toEqual(`${metric.title} of Max field`);
            });
            it(`should return a label prefixed with number of ${metric.title.toLowerCase()}`, () => {
                init({
                    metricAgg: 'custom',
                    customMetric: {
                        id: '2-orderAgg',
                        type: metric.name,
                        params: {
                            buckets_path: 'custom',
                            customMetric: {
                                id: '2-orderAgg-orderAgg',
                                type: 'count',
                                schema: 'orderAgg',
                            },
                        },
                        schema: 'orderAgg',
                    },
                });
                expect(metricAgg.makeLabel(aggConfig)).toEqual(`2. ${metric.title.toLowerCase()} of Count`);
            });
            it('should set parent aggs', () => {
                init({
                    metricAgg: 'custom',
                    customMetric: {
                        id: '2-metric',
                        type: 'max',
                        params: { field: 'field' },
                        schema: 'orderAgg',
                    },
                });
                expect(aggDsl[metric.dslName || metric.name].buckets_path).toBe('2-metric');
                expect(aggDsl.parentAggs['2-metric'].max.field).toBe('field');
            });
            it('should set nested parent aggs', () => {
                init({
                    metricAgg: 'custom',
                    customMetric: {
                        id: '2-metric',
                        type: metric.name,
                        params: {
                            buckets_path: 'custom',
                            customMetric: {
                                id: '2-metric-metric',
                                type: 'max',
                                params: { field: 'field' },
                                schema: 'orderAgg',
                            },
                        },
                        schema: 'orderAgg',
                    },
                });
                expect(aggDsl[metric.dslName || metric.name].buckets_path).toBe('2-metric');
                expect(aggDsl.parentAggs['2-metric'][metric.dslName || metric.name].buckets_path).toBe('2-metric-metric');
            });
            it('should have correct formatter', () => {
                init({
                    metricAgg: '3',
                });
                expect(metricAgg.getFormat(aggConfig).type.id).toBe('bytes');
            });
            it('should have correct customMetric nested formatter', () => {
                init({
                    metricAgg: 'custom',
                    customMetric: {
                        id: '2-metric',
                        type: metric.name,
                        params: {
                            buckets_path: 'custom',
                            customMetric: {
                                id: '2-metric-metric',
                                type: 'max',
                                params: { field: 'field' },
                                schema: 'orderAgg',
                            },
                        },
                        schema: 'orderAgg',
                    },
                });
                expect(metricAgg.getFormat(aggConfig).type.id).toBe('bytes');
            });
            it("should call modifyAggConfigOnSearchRequestStart for its customMetric's parameters", () => {
                init({
                    metricAgg: 'custom',
                    customMetric: {
                        id: '2-metric',
                        type: 'max',
                        params: { field: 'field' },
                        schema: 'orderAgg',
                    },
                });
                const searchSource = {};
                const customMetricSpy = jest.fn();
                const customMetric = aggConfig.params.customMetric;
                // Attach a modifyAggConfigOnSearchRequestStart with a spy to the first parameter
                customMetric.type.params[0].modifyAggConfigOnSearchRequestStart = customMetricSpy;
                aggConfig.type.params.forEach(param => {
                    param.modifyAggConfigOnSearchRequestStart(aggConfig, searchSource, {});
                });
                expect(customMetricSpy.mock.calls[0]).toEqual([customMetric, searchSource, {}]);
            });
        });
    });
});
