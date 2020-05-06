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
const date_histogram_1 = require("./date_histogram");
const _interval_options_1 = require("../_interval_options");
const agg_configs_1 = require("../../agg_configs");
const test_helpers_1 = require("../../test_helpers");
const date_histogram_2 = require("../date_histogram");
const bucket_agg_types_1 = require("../bucket_agg_types");
const mocks_1 = require("../../../../../../../core/public/mocks");
const mocks_2 = require("../../../../query/mocks");
const mocks_3 = require("../../../../field_formats/mocks");
describe('AggConfig Filters', () => {
    describe('date_histogram', () => {
        let aggTypesDependencies;
        let agg;
        let filter;
        let bucketStart;
        let field;
        beforeEach(() => {
            const { uiSettings } = mocks_1.coreMock.createSetup();
            aggTypesDependencies = {
                uiSettings,
                query: mocks_2.queryServiceMock.createSetupContract(),
                getInternalStartServices: () => ({
                    fieldFormats: mocks_3.fieldFormatsServiceMock.createStartContract(),
                    notifications: mocks_1.notificationServiceMock.createStartContract(),
                }),
            };
            test_helpers_1.mockDataServices();
        });
        const init = (interval = 'auto', duration = moment_1.default.duration(15, 'minutes')) => {
            field = {
                name: 'date',
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
                    type: bucket_agg_types_1.BUCKET_TYPES.DATE_HISTOGRAM,
                    schema: 'segment',
                    params: { field: field.name, interval, customInterval: '5d' },
                },
            ], {
                typesRegistry: test_helpers_1.mockAggTypesRegistry([date_histogram_2.getDateHistogramBucketAgg(aggTypesDependencies)]),
                fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
            });
            const bucketKey = 1422579600000;
            agg = aggConfigs.aggs[0];
            bucketStart = moment_1.default(bucketKey);
            const timePad = moment_1.default.duration(duration / 2);
            agg.buckets.setBounds({
                min: bucketStart.clone().subtract(timePad),
                max: bucketStart.clone().add(timePad),
            });
            agg.buckets.setInterval(interval);
            filter = date_histogram_1.createFilterDateHistogram(agg, bucketKey);
        };
        test('creates a valid range filter', () => {
            init();
            expect(filter).toHaveProperty('range');
            expect(filter.range).toHaveProperty(field.name);
            const fieldParams = filter.range[field.name];
            expect(fieldParams).toHaveProperty('gte');
            expect(typeof fieldParams.gte).toBe('string');
            expect(fieldParams).toHaveProperty('lt');
            expect(typeof fieldParams.lt).toBe('string');
            expect(fieldParams).toHaveProperty('format');
            expect(fieldParams.format).toBe('strict_date_optional_time');
            expect(filter).toHaveProperty('meta');
            expect(filter.meta).toHaveProperty('index', '1234');
        });
        test('extends the filter edge to 1ms before the next bucket for all interval options', () => {
            _interval_options_1.intervalOptions.forEach(option => {
                let duration;
                if (option.val !== 'custom' && moment_1.default(1, option.val).isValid()) {
                    // @ts-ignore
                    duration = moment_1.default.duration(10, option.val);
                    if (+duration < 10) {
                        throw new Error('unable to create interval for ' + option.val);
                    }
                }
                init(option.val, duration);
                const interval = agg.buckets.getInterval();
                const params = filter.range[field.name];
                expect(params.gte).toBe(bucketStart.toISOString());
                expect(params.lt).toBe(bucketStart
                    .clone()
                    .add(interval)
                    .toISOString());
            });
        });
    });
});
