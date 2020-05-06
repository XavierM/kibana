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
const utils_1 = require("./utils");
const public_1 = require("src/plugins/data/public");
const aggs = [
    {
        title: 'Count',
        type: public_1.AggGroupNames.Metrics,
        subtype: 'Metric Aggregations',
    },
    {
        title: 'Average',
        type: public_1.AggGroupNames.Metrics,
        subtype: 'Metric Aggregations',
    },
    {
        title: 'Cumulative Sum',
        type: public_1.AggGroupNames.Metrics,
        subtype: 'Parent Pipeline Aggregations',
    },
    {
        title: 'Min Bucket',
        type: public_1.AggGroupNames.Metrics,
        subtype: 'Parent Pipeline Aggregations',
    },
    {
        title: 'Sub string agg',
        type: 'string',
        subtype: 'Sub-String aggregations',
    },
    {
        title: 'String agg',
        type: 'string',
        subtype: 'String aggregations',
    },
];
describe('Default Editor groupAggregationsBy', () => {
    it('should return aggs grouped by type field', () => {
        const groupedAggs = [
            {
                label: public_1.AggGroupNames.Metrics,
                options: [
                    {
                        label: 'Average',
                        target: {
                            title: 'Average',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Metric Aggregations',
                        },
                    },
                    {
                        label: 'Count',
                        target: {
                            title: 'Count',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Metric Aggregations',
                        },
                    },
                    {
                        label: 'Cumulative Sum',
                        target: {
                            title: 'Cumulative Sum',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Parent Pipeline Aggregations',
                        },
                    },
                    {
                        label: 'Min Bucket',
                        target: {
                            title: 'Min Bucket',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Parent Pipeline Aggregations',
                        },
                    },
                ],
            },
            {
                label: 'string',
                options: [
                    {
                        label: 'String agg',
                        target: {
                            title: 'String agg',
                            type: 'string',
                            subtype: 'String aggregations',
                        },
                    },
                    {
                        label: 'Sub string agg',
                        target: {
                            title: 'Sub string agg',
                            type: 'string',
                            subtype: 'Sub-String aggregations',
                        },
                    },
                ],
            },
        ];
        expect(utils_1.groupAndSortBy(aggs, 'type', 'title')).toEqual(groupedAggs);
    });
    it('should return aggs grouped by subtype field', () => {
        const groupedAggs = [
            {
                label: 'Metric Aggregations',
                options: [
                    {
                        label: 'Average',
                        target: {
                            title: 'Average',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Metric Aggregations',
                        },
                    },
                    {
                        label: 'Count',
                        target: {
                            title: 'Count',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Metric Aggregations',
                        },
                    },
                ],
            },
            {
                label: 'Parent Pipeline Aggregations',
                options: [
                    {
                        label: 'Cumulative Sum',
                        target: {
                            title: 'Cumulative Sum',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Parent Pipeline Aggregations',
                        },
                    },
                    {
                        label: 'Min Bucket',
                        target: {
                            title: 'Min Bucket',
                            type: public_1.AggGroupNames.Metrics,
                            subtype: 'Parent Pipeline Aggregations',
                        },
                    },
                ],
            },
            {
                label: 'String aggregations',
                options: [
                    {
                        label: 'String agg',
                        target: {
                            title: 'String agg',
                            type: 'string',
                            subtype: 'String aggregations',
                        },
                    },
                ],
            },
            {
                label: 'Sub-String aggregations',
                options: [
                    {
                        label: 'Sub string agg',
                        target: {
                            title: 'Sub string agg',
                            type: 'string',
                            subtype: 'Sub-String aggregations',
                        },
                    },
                ],
            },
        ];
        expect(utils_1.groupAndSortBy(aggs, 'subtype', 'title')).toEqual(groupedAggs);
    });
});
