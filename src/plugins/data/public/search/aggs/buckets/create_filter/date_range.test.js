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
const date_range_1 = require("../date_range");
const date_range_2 = require("./date_range");
const field_formats_1 = require("../../../../field_formats");
const agg_configs_1 = require("../../agg_configs");
const test_helpers_1 = require("../../test_helpers");
const bucket_agg_types_1 = require("../bucket_agg_types");
const mocks_1 = require("../../../../../../../core/public/mocks");
const mocks_2 = require("../../../../field_formats/mocks");
describe('AggConfig Filters', () => {
    describe('Date range', () => {
        let aggTypesDependencies;
        beforeEach(() => {
            const { uiSettings } = mocks_1.coreMock.createSetup();
            aggTypesDependencies = {
                uiSettings,
                getInternalStartServices: () => ({
                    fieldFormats: mocks_2.fieldFormatsServiceMock.createStartContract(),
                    notifications: mocks_1.notificationServiceMock.createStartContract(),
                }),
            };
        });
        const getConfig = (() => { });
        const getAggConfigs = () => {
            const field = {
                name: '@timestamp',
                format: new field_formats_1.DateFormat({}, getConfig),
            };
            const indexPattern = {
                id: '1234',
                title: 'logstash-*',
                fields: {
                    getByName: () => field,
                    filter: () => [field],
                },
            };
            return new agg_configs_1.AggConfigs(indexPattern, [
                {
                    type: bucket_agg_types_1.BUCKET_TYPES.DATE_RANGE,
                    params: {
                        field: '@timestamp',
                        ranges: [{ from: '2014-01-01', to: '2014-12-31' }],
                    },
                },
            ], {
                typesRegistry: test_helpers_1.mockAggTypesRegistry([date_range_1.getDateRangeBucketAgg(aggTypesDependencies)]),
                fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
            });
        };
        test('should return a range filter for date_range agg', () => {
            const aggConfigs = getAggConfigs();
            const from = new Date('1 Feb 2015');
            const to = new Date('7 Feb 2015');
            const filter = date_range_2.createFilterDateRange(aggConfigs.aggs[0], {
                from: from.valueOf(),
                to: to.valueOf(),
            });
            expect(filter).toHaveProperty('range');
            expect(filter).toHaveProperty('meta');
            expect(filter.meta).toHaveProperty('index', '1234');
            expect(filter.range).toHaveProperty('@timestamp');
            expect(filter.range['@timestamp']).toHaveProperty('gte', moment_1.default(from).toISOString());
            expect(filter.range['@timestamp']).toHaveProperty('lt', moment_1.default(to).toISOString());
        });
    });
});
