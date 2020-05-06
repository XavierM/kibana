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
const public_1 = require("src/plugins/data/public");
const agg_params_helper_1 = require("./agg_params_helper");
const controls_1 = require("./controls");
jest.mock('../utils', () => ({
    groupAndSortBy: jest.fn(() => ['indexedFields']),
}));
const mockFilter = {
    filter(fields) {
        return fields;
    },
};
describe('DefaultEditorAggParams helpers', () => {
    describe('getAggParamsToRender', () => {
        let agg;
        let editorConfig;
        const schemas = [
            {
                name: 'metric',
            },
            {
                name: 'metric2',
                hideCustomLabel: true,
            },
        ];
        const state = {};
        const metricAggs = [];
        const emptyParams = {
            basic: [],
            advanced: [],
        };
        it('should not create any param if they do not have editorComponents', () => {
            agg = {
                type: {
                    params: [{ name: 'interval' }],
                },
                schema: 'metric',
            };
            const params = agg_params_helper_1.getAggParamsToRender({ agg, editorConfig, metricAggs, state, schemas }, mockFilter);
            expect(params).toEqual(emptyParams);
        });
        it('should not create any param if there is no agg type', () => {
            agg = { schema: 'metric' };
            const params = agg_params_helper_1.getAggParamsToRender({ agg, editorConfig, metricAggs, state, schemas }, mockFilter);
            expect(params).toEqual(emptyParams);
        });
        it('should not create a param if it is hidden', () => {
            agg = {
                type: {
                    params: [{ name: 'interval' }],
                },
            };
            editorConfig = {
                interval: {
                    hidden: true,
                },
            };
            const params = agg_params_helper_1.getAggParamsToRender({ agg, editorConfig, metricAggs, state, schemas }, mockFilter);
            expect(params).toEqual(emptyParams);
        });
        it('should skip customLabel param if it is hidden', () => {
            agg = {
                type: {
                    params: [{ name: 'customLabel' }],
                },
                schema: 'metric2',
            };
            const params = agg_params_helper_1.getAggParamsToRender({ agg, editorConfig, metricAggs, state, schemas }, mockFilter);
            expect(params).toEqual(emptyParams);
        });
        it('should create a basic params field and orderBy', () => {
            const filterFieldTypes = ['number', 'boolean', 'date'];
            agg = {
                type: {
                    type: public_1.AggGroupNames.Buckets,
                    name: public_1.BUCKET_TYPES.TERMS,
                    params: [
                        {
                            name: 'field',
                            type: 'field',
                            filterFieldTypes,
                            getAvailableFields: jest.fn((aggConfig) => aggConfig
                                .getIndexPattern()
                                .fields.filter(({ type }) => filterFieldTypes.includes(type))),
                        },
                        {
                            name: 'orderBy',
                        },
                    ],
                },
                schema: 'metric',
                getIndexPattern: jest.fn(() => ({
                    fields: [
                        { name: '@timestamp', type: 'date' },
                        { name: 'geo_desc', type: 'string' },
                    ],
                })),
                params: {
                    orderBy: 'orderBy',
                    field: 'field',
                },
            };
            const params = agg_params_helper_1.getAggParamsToRender({ agg, editorConfig, metricAggs, state, schemas }, mockFilter);
            expect(params).toEqual({
                basic: [
                    {
                        agg,
                        aggParam: agg.type.params[0],
                        editorConfig,
                        indexedFields: ['indexedFields'],
                        paramEditor: controls_1.FieldParamEditor,
                        metricAggs,
                        state,
                        schemas,
                        value: agg.params.field,
                    },
                    {
                        agg,
                        aggParam: agg.type.params[1],
                        editorConfig,
                        indexedFields: [],
                        paramEditor: controls_1.OrderByParamEditor,
                        metricAggs,
                        state,
                        schemas,
                        value: agg.params.orderBy,
                    },
                ],
                advanced: [],
            });
            expect(agg.getIndexPattern).toBeCalledTimes(1);
        });
    });
    describe('getAggTypeOptions', () => {
        it('should return agg type options grouped by subtype', () => {
            const indexPattern = {};
            const aggs = agg_params_helper_1.getAggTypeOptions({ metrics: [] }, {}, indexPattern, 'metrics', []);
            expect(aggs).toEqual(['indexedFields']);
        });
    });
    describe('isInvalidParamsTouched', () => {
        let aggType;
        const aggTypeState = {
            touched: false,
            valid: true,
        };
        const aggParams = {
            orderBy: {
                touched: true,
                valid: true,
            },
            orderAgg: {
                touched: true,
                valid: true,
            },
        };
        it('should return aggTypeState touched if there is no aggType', () => {
            const isTouched = agg_params_helper_1.isInvalidParamsTouched(aggType, aggTypeState, aggParams);
            expect(isTouched).toBe(aggTypeState.touched);
        });
        it('should return false if there is no invalid params', () => {
            aggType = 'type';
            const isTouched = agg_params_helper_1.isInvalidParamsTouched(aggType, aggTypeState, aggParams);
            expect(isTouched).toBeFalsy();
        });
        it('should return true if there is an invalid param, but not every still touched', () => {
            aggType = 'type';
            aggParams.orderAgg.valid = false;
            const isTouched = agg_params_helper_1.isInvalidParamsTouched(aggType, aggTypeState, aggParams);
            expect(isTouched).toBeTruthy();
        });
    });
});
