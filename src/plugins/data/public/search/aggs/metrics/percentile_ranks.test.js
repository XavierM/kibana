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
const percentile_ranks_1 = require("./percentile_ranks");
const agg_configs_1 = require("../agg_configs");
const test_helpers_1 = require("../test_helpers");
const metric_agg_types_1 = require("./metric_agg_types");
const mocks_1 = require("../../../field_formats/mocks");
const mocks_2 = require("../../../../../../../src/core/public/mocks");
describe('AggTypesMetricsPercentileRanksProvider class', function () {
    let aggConfigs;
    let fieldFormats;
    let aggTypesDependencies;
    beforeEach(() => {
        fieldFormats = mocks_1.fieldFormatsServiceMock.createStartContract();
        fieldFormats.getDefaultInstance = (() => ({
            convert: (t) => t,
        }));
        aggTypesDependencies = {
            getInternalStartServices: () => ({
                fieldFormats,
                notifications: mocks_2.notificationServiceMock.createStartContract(),
            }),
        };
        const typesRegistry = test_helpers_1.mockAggTypesRegistry([percentile_ranks_1.getPercentileRanksMetricAgg(aggTypesDependencies)]);
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
                id: metric_agg_types_1.METRIC_TYPES.PERCENTILE_RANKS,
                type: metric_agg_types_1.METRIC_TYPES.PERCENTILE_RANKS,
                schema: 'metric',
                params: {
                    field: 'bytes',
                    customLabel: 'my custom field label',
                    values: [5000, 10000],
                },
            },
        ], { typesRegistry, fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats });
    });
    it('uses the custom label if it is set', function () {
        const responseAggs = percentile_ranks_1.getPercentileRanksMetricAgg(aggTypesDependencies).getResponseAggs(aggConfigs.aggs[0]);
        const percentileRankLabelFor5kBytes = responseAggs[0].makeLabel();
        const percentileRankLabelFor10kBytes = responseAggs[1].makeLabel();
        expect(percentileRankLabelFor5kBytes).toBe('Percentile rank 5000 of "my custom field label"');
        expect(percentileRankLabelFor10kBytes).toBe('Percentile rank 10000 of "my custom field label"');
    });
});
