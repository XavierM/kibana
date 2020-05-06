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
const agg_type_1 = require("./agg_type");
const mocks_1 = require("../../field_formats/mocks");
const mocks_2 = require("../../../../../../src/core/public/mocks");
describe('AggType Class', () => {
    let dependencies;
    beforeEach(() => {
        dependencies = {
            getInternalStartServices: () => ({
                fieldFormats: {
                    ...mocks_1.fieldFormatsServiceMock.createStartContract(),
                    getDefaultInstance: jest.fn(() => 'default'),
                },
                notifications: mocks_2.notificationServiceMock.createStartContract(),
            }),
        };
    });
    describe('constructor', () => {
        test("requires a valid config object as it's first param", () => {
            expect(() => {
                const aggConfig = undefined;
                new agg_type_1.AggType(aggConfig, dependencies);
            }).toThrowError();
        });
        describe('application of config properties', () => {
            test('assigns the config value to itself', () => {
                const config = {
                    name: 'name',
                    title: 'title',
                };
                const aggType = new agg_type_1.AggType(config, dependencies);
                expect(aggType.name).toBe('name');
                expect(aggType.title).toBe('title');
            });
            describe('makeLabel', () => {
                test('makes a function when the makeLabel config is not specified', () => {
                    const makeLabel = () => 'label';
                    const aggConfig = {};
                    const config = {
                        name: 'name',
                        title: 'title',
                        makeLabel,
                    };
                    const aggType = new agg_type_1.AggType(config, dependencies);
                    expect(aggType.makeLabel).toBe(makeLabel);
                    expect(aggType.makeLabel(aggConfig)).toBe('label');
                });
            });
            describe('getResponseAggs/getRequestAggs', () => {
                test('copies the value', () => {
                    const testConfig = (aggConfig) => [aggConfig];
                    const aggType = new agg_type_1.AggType({
                        name: 'name',
                        title: 'title',
                        getResponseAggs: testConfig,
                        getRequestAggs: testConfig,
                    }, dependencies);
                    expect(aggType.getResponseAggs).toBe(testConfig);
                    expect(aggType.getResponseAggs).toBe(testConfig);
                });
                test('defaults to noop', () => {
                    const aggConfig = {};
                    const aggType = new agg_type_1.AggType({
                        name: 'name',
                        title: 'title',
                    }, dependencies);
                    const responseAggs = aggType.getRequestAggs(aggConfig);
                    expect(responseAggs).toBe(undefined);
                });
            });
            describe('params', () => {
                test('defaults to AggParams object with JSON param', () => {
                    const aggType = new agg_type_1.AggType({
                        name: 'smart agg',
                        title: 'title',
                    }, dependencies);
                    expect(Array.isArray(aggType.params)).toBeTruthy();
                    expect(aggType.params.length).toBe(2);
                    expect(aggType.params[0].name).toBe('json');
                    expect(aggType.params[1].name).toBe('customLabel');
                });
                test('can disable customLabel', () => {
                    const aggType = new agg_type_1.AggType({
                        name: 'smart agg',
                        title: 'title',
                        customLabels: false,
                    }, dependencies);
                    expect(aggType.params.length).toBe(1);
                    expect(aggType.params[0].name).toBe('json');
                });
                test('passes the params arg directly to the AggParams constructor', () => {
                    const params = [{ name: 'one' }, { name: 'two' }];
                    const paramLength = params.length + 2; // json and custom label are always appended
                    const aggType = new agg_type_1.AggType({
                        name: 'bucketeer',
                        title: 'title',
                        params,
                    }, dependencies);
                    expect(Array.isArray(aggType.params)).toBeTruthy();
                    expect(aggType.params.length).toBe(paramLength);
                });
            });
        });
        describe('getFormat', function () {
            let aggConfig;
            let field;
            beforeEach(() => {
                aggConfig = {
                    getField: jest.fn(() => field),
                };
            });
            test('returns the formatter for the aggConfig', () => {
                const aggType = new agg_type_1.AggType({
                    name: 'name',
                    title: 'title',
                }, dependencies);
                field = {
                    format: 'format',
                };
                expect(aggType.getFormat(aggConfig)).toBe('format');
            });
            test('returns default formatter', () => {
                const aggType = new agg_type_1.AggType({
                    name: 'name',
                    title: 'title',
                }, dependencies);
                field = undefined;
                expect(aggType.getFormat(aggConfig)).toBe('default');
            });
        });
    });
});
