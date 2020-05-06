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
const std_deviation_1 = require("./std_deviation");
const agg_configs_1 = require("../agg_configs");
const test_helpers_1 = require("../test_helpers");
const metric_agg_types_1 = require("./metric_agg_types");
const mocks_1 = require("../../../field_formats/mocks");
const mocks_2 = require("../../../../../../../src/core/public/mocks");
describe('AggTypeMetricStandardDeviationProvider class', () => {
    const aggTypesDependencies = {
        getInternalStartServices: () => ({
            fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
            notifications: mocks_2.notificationServiceMock.createStartContract(),
        }),
    };
    const typesRegistry = test_helpers_1.mockAggTypesRegistry([std_deviation_1.getStdDeviationMetricAgg(aggTypesDependencies)]);
    const getAggConfigs = (customLabel) => {
        const field = {
            name: 'memory',
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
                id: metric_agg_types_1.METRIC_TYPES.STD_DEV,
                type: metric_agg_types_1.METRIC_TYPES.STD_DEV,
                schema: 'metric',
                params: {
                    field: {
                        displayName: 'memory',
                    },
                    customLabel,
                },
            },
        ], { typesRegistry, fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats });
    };
    it('uses the custom label if it is set', () => {
        const aggConfigs = getAggConfigs('custom label');
        const responseAggs = std_deviation_1.getStdDeviationMetricAgg(aggTypesDependencies).getResponseAggs(aggConfigs.aggs[0]);
        const lowerStdDevLabel = responseAggs[0].makeLabel();
        const upperStdDevLabel = responseAggs[1].makeLabel();
        expect(lowerStdDevLabel).toBe('Lower custom label');
        expect(upperStdDevLabel).toBe('Upper custom label');
    });
    it('uses the default labels if custom label is not set', () => {
        const aggConfigs = getAggConfigs();
        const responseAggs = std_deviation_1.getStdDeviationMetricAgg(aggTypesDependencies).getResponseAggs(aggConfigs.aggs[0]);
        const lowerStdDevLabel = responseAggs[0].makeLabel();
        const upperStdDevLabel = responseAggs[1].makeLabel();
        expect(lowerStdDevLabel).toBe('Lower Standard Deviation of memory');
        expect(upperStdDevLabel).toBe('Upper Standard Deviation of memory');
    });
});
