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
const agg_group_helper_1 = require("./agg_group_helper");
describe('DefaultEditorGroup helpers', () => {
    let group;
    let schemas;
    beforeEach(() => {
        group = [
            {
                id: '1',
                params: {
                    field: {
                        type: 'number',
                    },
                },
                schema: 'metric',
            },
            {
                id: '2',
                params: {
                    field: {
                        type: 'string',
                    },
                },
                schema: 'metric2',
            },
        ];
        schemas = [
            {
                name: 'metric',
                title: 'Metric',
                group: 'metrics',
                min: 0,
                max: 3,
                aggFilter: [],
                editor: false,
                params: [],
                defaults: null,
                mustBeFirst: true,
            },
            {
                name: 'metric2',
                title: 'Metric',
                group: 'metrics',
                min: 2,
                max: 3,
                aggFilter: [],
                editor: false,
                params: [],
                defaults: null,
            },
        ];
    });
    describe('isAggRemovable', () => {
        it('should return true when the number of aggs with the same schema is above the min', () => {
            const isRemovable = agg_group_helper_1.isAggRemovable(group[0], group, schemas);
            expect(isRemovable).toBeTruthy();
        });
        it('should return false when the number of aggs with the same schema is not above the min', () => {
            const isRemovable = agg_group_helper_1.isAggRemovable(group[1], group, schemas);
            expect(isRemovable).toBeFalsy();
        });
    });
    describe('getEnabledMetricAggsCount', () => {
        it('should return 1 when there is the only enabled agg', () => {
            group[0].enabled = true;
            const enabledAggs = agg_group_helper_1.getEnabledMetricAggsCount(group);
            expect(enabledAggs).toBe(1);
        });
        it('should return 2 when there are multiple enabled aggs', () => {
            group[0].enabled = true;
            group[1].enabled = true;
            group[1].schema = 'metric';
            const enabledAggs = agg_group_helper_1.getEnabledMetricAggsCount(group);
            expect(enabledAggs).toBe(2);
        });
    });
    describe('calcAggIsTooLow', () => {
        it('should return false when agg.schema.mustBeFirst has falsy value', () => {
            const isRemovable = agg_group_helper_1.calcAggIsTooLow(group[1], 0, group, schemas);
            expect(isRemovable).toBeFalsy();
        });
        it('should return false when there is no different schema', () => {
            group[1].schema = group[0].schema;
            const isRemovable = agg_group_helper_1.calcAggIsTooLow(group[0], 0, group, schemas);
            expect(isRemovable).toBeFalsy();
        });
        it('should return false when different schema is not less than agg index', () => {
            const isRemovable = agg_group_helper_1.calcAggIsTooLow(group[0], 0, group, schemas);
            expect(isRemovable).toBeFalsy();
        });
        it('should return true when agg index is greater than different schema index', () => {
            const isRemovable = agg_group_helper_1.calcAggIsTooLow(group[0], 2, group, schemas);
            expect(isRemovable).toBeTruthy();
        });
    });
    describe('isInvalidAggsTouched', () => {
        let aggsState;
        beforeEach(() => {
            aggsState = {
                1: {
                    valid: true,
                    touched: false,
                },
                2: {
                    valid: true,
                    touched: false,
                },
                3: {
                    valid: true,
                    touched: false,
                },
            };
        });
        it('should return false when there are no invalid aggs', () => {
            const isAllInvalidAggsTouched = agg_group_helper_1.isInvalidAggsTouched(aggsState);
            expect(isAllInvalidAggsTouched).toBeFalsy();
        });
        it('should return false when not all invalid aggs are touched', () => {
            aggsState[1].valid = false;
            const isAllInvalidAggsTouched = agg_group_helper_1.isInvalidAggsTouched(aggsState);
            expect(isAllInvalidAggsTouched).toBeFalsy();
        });
        it('should return true when all invalid aggs are touched', () => {
            aggsState[1].valid = false;
            aggsState[1].touched = true;
            const isAllInvalidAggsTouched = agg_group_helper_1.isInvalidAggsTouched(aggsState);
            expect(isAllInvalidAggsTouched).toBeTruthy();
        });
    });
});
