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
const agg_params_1 = require("./agg_params");
const base_1 = require("./param_types/base");
const field_1 = require("./param_types/field");
const optioned_1 = require("./param_types/optioned");
const mocks_1 = require("../../field_formats/mocks");
const mocks_2 = require("../../../../../../src/core/public/mocks");
describe('AggParams class', () => {
    const aggTypesDependencies = {
        getInternalStartServices: () => ({
            fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
            notifications: mocks_2.notificationServiceMock.createStartContract(),
        }),
    };
    describe('constructor args', () => {
        it('accepts an array of param defs', () => {
            const params = [{ name: 'one' }, { name: 'two' }];
            const aggParams = agg_params_1.initParams(params, aggTypesDependencies);
            expect(aggParams).toHaveLength(params.length);
            expect(Array.isArray(aggParams)).toBeTruthy();
        });
    });
    describe('AggParam creation', () => {
        it('Uses the FieldParamType class for params with the name "field"', () => {
            const params = [{ name: 'field', type: 'field' }];
            const aggParams = agg_params_1.initParams(params, aggTypesDependencies);
            expect(aggParams).toHaveLength(params.length);
            expect(aggParams[0] instanceof field_1.FieldParamType).toBeTruthy();
        });
        it('Uses the OptionedParamType class for params of type "optioned"', () => {
            const params = [
                {
                    name: 'order',
                    type: 'optioned',
                },
            ];
            const aggParams = agg_params_1.initParams(params, aggTypesDependencies);
            expect(aggParams).toHaveLength(params.length);
            expect(aggParams[0] instanceof optioned_1.OptionedParamType).toBeTruthy();
        });
        it('Always converts the params to a BaseParamType', function () {
            const params = [
                {
                    name: 'height',
                    displayName: 'height',
                },
                {
                    name: 'weight',
                    displayName: 'weight',
                },
                {
                    name: 'waist',
                    displayName: 'waist',
                },
            ];
            const aggParams = agg_params_1.initParams(params, aggTypesDependencies);
            expect(aggParams).toHaveLength(params.length);
            aggParams.forEach(aggParam => expect(aggParam instanceof base_1.BaseParamType).toBeTruthy());
        });
    });
});
