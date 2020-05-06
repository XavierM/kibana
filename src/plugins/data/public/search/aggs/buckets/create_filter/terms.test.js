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
const terms_1 = require("../terms");
const terms_2 = require("./terms");
const agg_configs_1 = require("../../agg_configs");
const test_helpers_1 = require("../../test_helpers");
const bucket_agg_types_1 = require("../bucket_agg_types");
const mocks_1 = require("../../../../field_formats/mocks");
const mocks_2 = require("../../../../../../../core/public/mocks");
describe('AggConfig Filters', () => {
    describe('terms', () => {
        let aggTypesDependencies;
        beforeEach(() => {
            aggTypesDependencies = {
                getInternalStartServices: () => ({
                    fieldFormats: mocks_1.fieldFormatsServiceMock.createStartContract(),
                    notifications: mocks_2.notificationServiceMock.createStartContract(),
                }),
            };
        });
        const getAggConfigs = (aggs) => {
            const indexPattern = {
                id: '1234',
                title: 'logstash-*',
                fields: {
                    getByName: () => field,
                    filter: () => [field],
                },
            };
            const field = {
                name: 'field',
                indexPattern,
            };
            return new agg_configs_1.AggConfigs(indexPattern, aggs, {
                typesRegistry: test_helpers_1.mockAggTypesRegistry([terms_1.getTermsBucketAgg(aggTypesDependencies)]),
                fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
            });
        };
        test('should return a match_phrase filter for terms', () => {
            const aggConfigs = getAggConfigs([
                { type: bucket_agg_types_1.BUCKET_TYPES.TERMS, schema: 'segment', params: { field: 'field' } },
            ]);
            const filter = terms_2.createFilterTerms(aggConfigs.aggs[0], 'apache', {});
            expect(filter).toHaveProperty('query');
            expect(filter.query).toHaveProperty('match_phrase');
            expect(filter.query.match_phrase).toHaveProperty('field');
            expect(filter.query.match_phrase.field).toBe('apache');
            expect(filter).toHaveProperty('meta');
            expect(filter.meta).toHaveProperty('index', '1234');
        });
        test('should set query to true or false for boolean filter', () => {
            const aggConfigs = getAggConfigs([
                { type: bucket_agg_types_1.BUCKET_TYPES.TERMS, schema: 'segment', params: { field: 'field' } },
            ]);
            const filterFalse = terms_2.createFilterTerms(aggConfigs.aggs[0], '', {});
            expect(filterFalse).toHaveProperty('query');
            expect(filterFalse.query).toHaveProperty('match_phrase');
            expect(filterFalse.query.match_phrase).toHaveProperty('field');
            expect(filterFalse.query.match_phrase.field).toBeFalsy();
            const filterTrue = terms_2.createFilterTerms(aggConfigs.aggs[0], '1', {});
            expect(filterTrue).toHaveProperty('query');
            expect(filterTrue.query).toHaveProperty('match_phrase');
            expect(filterTrue.query.match_phrase).toHaveProperty('field');
            expect(filterTrue.query.match_phrase.field).toBeTruthy();
        });
        test('should generate correct __missing__ filter', () => {
            const aggConfigs = getAggConfigs([
                { type: bucket_agg_types_1.BUCKET_TYPES.TERMS, schema: 'segment', params: { field: 'field' } },
            ]);
            const filter = terms_2.createFilterTerms(aggConfigs.aggs[0], '__missing__', {});
            expect(filter).toHaveProperty('exists');
            expect(filter.exists).toHaveProperty('field', 'field');
            expect(filter).toHaveProperty('meta');
            expect(filter.meta).toHaveProperty('index', '1234');
            expect(filter.meta).toHaveProperty('negate', true);
        });
        test('should generate correct __other__ filter', () => {
            const aggConfigs = getAggConfigs([
                { type: bucket_agg_types_1.BUCKET_TYPES.TERMS, schema: 'segment', params: { field: 'field' } },
            ]);
            const [filter] = terms_2.createFilterTerms(aggConfigs.aggs[0], '__other__', {
                terms: ['apache'],
            });
            expect(filter).toHaveProperty('query');
            expect(filter.query).toHaveProperty('bool');
            expect(filter.query.bool).toHaveProperty('should');
            expect(filter.query.bool.should[0]).toHaveProperty('match_phrase');
            expect(filter.query.bool.should[0].match_phrase).toHaveProperty('field', 'apache');
            expect(filter).toHaveProperty('meta');
            expect(filter.meta).toHaveProperty('index', '1234');
            expect(filter.meta).toHaveProperty('negate', true);
        });
    });
});
