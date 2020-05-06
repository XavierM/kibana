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
const build_pipeline_1 = require("./build_pipeline");
const mocks_1 = require("../../../../plugins/data/public/mocks");
describe('visualize loader pipeline helpers: build pipeline', () => {
    describe('prepareJson', () => {
        it('returns a correctly formatted key/value string', () => {
            const expected = `foo='{}' `; // trailing space is expected
            const actual = build_pipeline_1.prepareJson('foo', {});
            expect(actual).toBe(expected);
        });
        it('stringifies provided data', () => {
            const expected = `foo='{\"well\":\"hello\",\"there\":{\"friend\":true}}' `;
            const actual = build_pipeline_1.prepareJson('foo', { well: 'hello', there: { friend: true } });
            expect(actual).toBe(expected);
        });
        it('escapes single quotes', () => {
            const expected = `foo='{\"well\":\"hello \\'hi\\'\",\"there\":{\"friend\":true}}' `;
            const actual = build_pipeline_1.prepareJson('foo', { well: `hello 'hi'`, there: { friend: true } });
            expect(actual).toBe(expected);
        });
        it('returns empty string if data is undefined', () => {
            const actual = build_pipeline_1.prepareJson('foo', undefined);
            expect(actual).toBe('');
        });
    });
    describe('prepareString', () => {
        it('returns a correctly formatted key/value string', () => {
            const expected = `foo='bar' `; // trailing space is expected
            const actual = build_pipeline_1.prepareString('foo', 'bar');
            expect(actual).toBe(expected);
        });
        it('escapes single quotes', () => {
            const expected = `foo='\\'bar\\'' `;
            const actual = build_pipeline_1.prepareString('foo', `'bar'`);
            expect(actual).toBe(expected);
        });
        it('returns empty string if data is undefined', () => {
            const actual = build_pipeline_1.prepareString('foo', undefined);
            expect(actual).toBe('');
        });
    });
    describe('buildPipelineVisFunction', () => {
        let schemaConfig;
        let schemasDef;
        let uiState;
        beforeEach(() => {
            schemaConfig = {
                accessor: 0,
                label: '',
                format: {},
                params: {},
                aggType: '',
            };
            schemasDef = { metric: [schemaConfig] };
            uiState = {};
        });
        it('handles vega function', () => {
            const vis = {
                params: { spec: 'this is a test' },
            };
            const actual = build_pipeline_1.buildPipelineVisFunction.vega(vis.params, schemasDef, uiState);
            expect(actual).toMatchSnapshot();
        });
        it('handles input_control_vis function', () => {
            const params = {
                some: 'nested',
                data: { here: true },
            };
            const actual = build_pipeline_1.buildPipelineVisFunction.input_control_vis(params, schemasDef, uiState);
            expect(actual).toMatchSnapshot();
        });
        it('handles metrics/tsvb function', () => {
            const params = { foo: 'bar' };
            const actual = build_pipeline_1.buildPipelineVisFunction.metrics(params, schemasDef, uiState);
            expect(actual).toMatchSnapshot();
        });
        it('handles timelion function', () => {
            const params = { expression: 'foo', interval: 'bar' };
            const actual = build_pipeline_1.buildPipelineVisFunction.timelion(params, schemasDef, uiState);
            expect(actual).toMatchSnapshot();
        });
        it('handles markdown function', () => {
            const params = {
                markdown: '## hello _markdown_',
                fontSize: 12,
                openLinksInNewTab: true,
                foo: 'bar',
            };
            const actual = build_pipeline_1.buildPipelineVisFunction.markdown(params, schemasDef, uiState);
            expect(actual).toMatchSnapshot();
        });
        it('handles undefined markdown function', () => {
            const params = { fontSize: 12, openLinksInNewTab: true, foo: 'bar' };
            const actual = build_pipeline_1.buildPipelineVisFunction.markdown(params, schemasDef, uiState);
            expect(actual).toMatchSnapshot();
        });
        describe('handles table function', () => {
            it('without splits or buckets', () => {
                const params = { foo: 'bar' };
                const schemas = {
                    ...schemasDef,
                    metric: [
                        { ...schemaConfig, accessor: 0 },
                        { ...schemaConfig, accessor: 1 },
                    ],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.table(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with splits', () => {
                const params = { foo: 'bar' };
                const schemas = {
                    ...schemasDef,
                    split_row: [1, 2],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.table(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with splits and buckets', () => {
                const params = { foo: 'bar' };
                const schemas = {
                    ...schemasDef,
                    metric: [
                        { ...schemaConfig, accessor: 0 },
                        { ...schemaConfig, accessor: 1 },
                    ],
                    split_row: [2, 4],
                    bucket: [3],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.table(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with showPartialRows=true and showMetricsAtAllLevels=true', () => {
                const params = {
                    showMetricsAtAllLevels: true,
                    showPartialRows: true,
                };
                const schemas = {
                    ...schemasDef,
                    metric: [
                        { ...schemaConfig, accessor: 1 },
                        { ...schemaConfig, accessor: 2 },
                        { ...schemaConfig, accessor: 4 },
                        { ...schemaConfig, accessor: 5 },
                    ],
                    bucket: [0, 3],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.table(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with showPartialRows=true and showMetricsAtAllLevels=false', () => {
                const params = {
                    showMetricsAtAllLevels: false,
                    showPartialRows: true,
                };
                const schemas = {
                    ...schemasDef,
                    metric: [
                        { ...schemaConfig, accessor: 1 },
                        { ...schemaConfig, accessor: 2 },
                        { ...schemaConfig, accessor: 4 },
                        { ...schemaConfig, accessor: 5 },
                    ],
                    bucket: [0, 3],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.table(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
        });
        describe('handles metric function', () => {
            it('without buckets', () => {
                const params = { metric: {} };
                const schemas = {
                    ...schemasDef,
                    metric: [
                        { ...schemaConfig, accessor: 0 },
                        { ...schemaConfig, accessor: 1 },
                    ],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.metric(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with buckets', () => {
                const params = { metric: {} };
                const schemas = {
                    ...schemasDef,
                    metric: [
                        { ...schemaConfig, accessor: 0 },
                        { ...schemaConfig, accessor: 1 },
                    ],
                    group: [{ accessor: 2 }],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.metric(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with percentage mode should have percentage format', () => {
                const params = { metric: { percentageMode: true } };
                const schemas = { ...schemasDef };
                const actual = build_pipeline_1.buildPipelineVisFunction.metric(params, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
        });
        describe('handles tagcloud function', () => {
            it('without buckets', () => {
                const actual = build_pipeline_1.buildPipelineVisFunction.tagcloud({}, schemasDef, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with buckets', () => {
                const schemas = {
                    ...schemasDef,
                    segment: [{ accessor: 1 }],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.tagcloud({}, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with boolean param showLabel', () => {
                const params = { showLabel: false };
                const actual = build_pipeline_1.buildPipelineVisFunction.tagcloud(params, schemasDef, uiState);
                expect(actual).toMatchSnapshot();
            });
        });
        describe('handles region_map function', () => {
            it('without buckets', () => {
                const params = { metric: {} };
                const actual = build_pipeline_1.buildPipelineVisFunction.region_map(params, schemasDef, uiState);
                expect(actual).toMatchSnapshot();
            });
            it('with buckets', () => {
                const schemas = {
                    ...schemasDef,
                    segment: [1, 2],
                };
                const actual = build_pipeline_1.buildPipelineVisFunction.region_map({}, schemas, uiState);
                expect(actual).toMatchSnapshot();
            });
        });
        it('handles tile_map function', () => {
            const params = { metric: {} };
            const schemas = {
                ...schemasDef,
                segment: [1, 2],
                geo_centroid: [3, 4],
            };
            const actual = build_pipeline_1.buildPipelineVisFunction.tile_map(params, schemas, uiState);
            expect(actual).toMatchSnapshot();
        });
        it('handles pie function', () => {
            const schemas = {
                ...schemasDef,
                segment: [1, 2],
            };
            const actual = build_pipeline_1.buildPipelineVisFunction.pie({}, schemas, uiState);
            expect(actual).toMatchSnapshot();
        });
    });
    describe('buildPipeline', () => {
        const dataStart = mocks_1.dataPluginMock.createStartContract();
        it('calls toExpression on vis_type if it exists', async () => {
            const vis = {
                getState: () => { },
                isHierarchical: () => false,
                data: {
                    aggs: {
                        getResponseAggs: () => [],
                    },
                    searchSource: {
                        getField: jest.fn(),
                        getParent: jest.fn(),
                    },
                },
                // @ts-ignore
                type: {
                    toExpression: () => 'testing custom expressions',
                },
            };
            const expression = await build_pipeline_1.buildPipeline(vis, {
                timefilter: dataStart.query.timefilter.timefilter,
            });
            expect(expression).toMatchSnapshot();
        });
    });
    describe('buildVislibDimensions', () => {
        const dataStart = mocks_1.dataPluginMock.createStartContract();
        let aggs;
        let vis;
        let params;
        beforeEach(() => {
            aggs = [
                {
                    id: '0',
                    enabled: true,
                    type: {
                        type: 'metrics',
                        name: 'count',
                    },
                    schema: 'metric',
                    params: {},
                },
            ];
            params = {
                searchSource: null,
                timefilter: dataStart.query.timefilter.timefilter,
                timeRange: null,
            };
        });
        describe('test y dimension format for histogram chart', () => {
            beforeEach(() => {
                vis = {
                    // @ts-ignore
                    type: {
                        name: 'histogram',
                    },
                    params: {
                        seriesParams: [
                            {
                                data: { id: '0' },
                                valueAxis: 'axis-y',
                            },
                        ],
                        valueAxes: [
                            {
                                id: 'axis-y',
                                scale: {
                                    mode: 'normal',
                                },
                            },
                        ],
                    },
                    data: {
                        aggs: {
                            getResponseAggs: () => {
                                return aggs;
                            },
                        },
                    },
                    isHierarchical: () => {
                        return false;
                    },
                };
            });
            it('with one numeric metric in regular moder', async () => {
                const dimensions = await build_pipeline_1.buildVislibDimensions(vis, params);
                const expected = { id: 'number' };
                const actual = dimensions.y[0].format;
                expect(actual).toEqual(expected);
            });
            it('with one numeric metric in percentage mode', async () => {
                vis.params.valueAxes[0].scale.mode = 'percentage';
                const dimensions = await build_pipeline_1.buildVislibDimensions(vis, params);
                const expected = { id: 'percent' };
                const actual = dimensions.y[0].format;
                expect(actual).toEqual(expected);
            });
            it('with two numeric metrics, mixed normal and percent mode should have corresponding formatters', async () => {
                const aggConfig = aggs[0];
                aggs = [{ ...aggConfig }, { ...aggConfig, id: '5' }];
                vis.params = {
                    seriesParams: [
                        {
                            data: { id: '0' },
                            valueAxis: 'axis-y-1',
                        },
                        {
                            data: { id: '5' },
                            valueAxis: 'axis-y-2',
                        },
                    ],
                    valueAxes: [
                        {
                            id: 'axis-y-1',
                            scale: {
                                mode: 'normal',
                            },
                        },
                        {
                            id: 'axis-y-2',
                            scale: {
                                mode: 'percentage',
                            },
                        },
                    ],
                };
                const dimensions = await build_pipeline_1.buildVislibDimensions(vis, params);
                const expectedY1 = { id: 'number' };
                const expectedY2 = { id: 'percent' };
                expect(dimensions.y[0].format).toEqual(expectedY1);
                expect(dimensions.y[1].format).toEqual(expectedY2);
            });
        });
        describe('test y dimension format for gauge chart', () => {
            beforeEach(() => {
                vis = {
                    // @ts-ignore
                    type: {
                        name: 'gauge',
                    },
                    params: { gauge: {} },
                    data: {
                        aggs: {
                            getResponseAggs: () => {
                                return aggs;
                            },
                        },
                    },
                    isHierarchical: () => {
                        return false;
                    },
                };
            });
            it('with percentageMode = false', async () => {
                vis.params.gauge.percentageMode = false;
                const dimensions = await build_pipeline_1.buildVislibDimensions(vis, params);
                const expected = { id: 'number' };
                const actual = dimensions.y[0].format;
                expect(actual).toEqual(expected);
            });
            it('with percentageMode = true', async () => {
                vis.params.gauge.percentageMode = true;
                const dimensions = await build_pipeline_1.buildVislibDimensions(vis, params);
                const expected = { id: 'percent' };
                const actual = dimensions.y[0].format;
                expect(actual).toEqual(expected);
            });
        });
    });
});
