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
const median_1 = require("./median");
const agg_configs_1 = require("../agg_configs");
const test_helpers_1 = require("../test_helpers");
const metric_agg_types_1 = require("./metric_agg_types");
const mocks_1 = require("../../../field_formats/mocks");
const mocks_2 = require("../../../../../../../src/core/public/mocks");
describe('AggTypeMetricMedianProvider class', () => {
    let aggConfigs;
    const aggTypesDependencies = {
        getInternalStartServices: () => ({
            fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
            notifications: mocks_2.notificationServiceMock.createStartContract(),
        }),
    };
    beforeEach(() => {
        const typesRegistry = test_helpers_1.mockAggTypesRegistry([median_1.getMedianMetricAgg(aggTypesDependencies)]);
        const field = {
            name: 'bytes',
        };
        const indexPattern = {
            id: '1234',
            title: 'logstash-*',
            fields: {
                getByName: () => field,
                filter: () => [field],
            },
        };
        aggConfigs = new agg_configs_1.AggConfigs(indexPattern, [
            {
                id: metric_agg_types_1.METRIC_TYPES.MEDIAN,
                type: metric_agg_types_1.METRIC_TYPES.MEDIAN,
                schema: 'metric',
                params: {
                    field: 'bytes',
                },
            },
        ], {
            typesRegistry,
            fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
        });
    });
    it('requests the percentiles aggregation in the Elasticsearch query DSL', () => {
        const dsl = aggConfigs.toDsl();
        expect(dsl.median.percentiles.field).toEqual('bytes');
        expect(dsl.median.percentiles.percents).toEqual([50]);
    });
    it('converts the response', () => {
        const agg = aggConfigs.getResponseAggs()[0];
        expect(agg.getValue({
            [agg.id]: {
                values: {
                    '50.0': 10,
                },
            },
        })).toEqual(10);
    });
});
