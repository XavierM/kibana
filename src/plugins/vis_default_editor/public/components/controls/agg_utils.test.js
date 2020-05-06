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
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const utils_1 = require("./utils");
let testComp;
const TestHook = ({ callback }) => {
    callback();
    return null;
};
const testHook = (callback) => {
    testComp = enzyme_1.mount(react_1.default.createElement(TestHook, { callback: callback }));
};
const metricAggs = [
    {
        id: '2',
        type: { name: 'count' },
        makeLabel() {
            return 'count';
        },
    },
    {
        id: '3',
        type: { name: 'avg' },
        makeLabel() {
            return 'avg';
        },
    },
];
const incompatibleAggs = [
    {
        id: '2',
        type: { name: 'top_hits' },
        makeLabel() {
            return 'top_hits';
        },
    },
    {
        id: '3',
        type: { name: 'percentiles' },
        makeLabel() {
            return 'percentiles';
        },
    },
];
const aggFilter = ['!top_hits', '!percentiles'];
describe('Aggregations utils', () => {
    describe('useFallbackMetric', () => {
        let setValue;
        beforeEach(() => {
            setValue = jest.fn();
        });
        describe('should not call setValue', () => {
            test('if there are no metricAggs', () => {
                testHook(() => {
                    utils_1.useFallbackMetric(setValue, aggFilter);
                });
                expect(setValue).not.toBeCalled();
            });
            test('if there is no value', () => {
                testHook(() => {
                    utils_1.useFallbackMetric(setValue, aggFilter, metricAggs);
                });
                expect(setValue).not.toBeCalled();
            });
            test('if value is "custom" metric', () => {
                testHook(() => {
                    utils_1.useFallbackMetric(setValue, aggFilter, metricAggs, 'custom');
                });
                expect(setValue).not.toBeCalled();
            });
            test('if value is selected metric is still available', () => {
                testHook(() => {
                    utils_1.useFallbackMetric(setValue, aggFilter, metricAggs, '2');
                });
                expect(setValue).not.toBeCalled();
            });
        });
        describe('should set up a new value if selected metric was removed', () => {
            test('called with undefined', () => {
                testHook(() => {
                    utils_1.useFallbackMetric(setValue, aggFilter, metricAggs, '7');
                });
                expect(setValue).toBeCalledWith(undefined);
            });
            test('called with fallback value', () => {
                testHook(() => {
                    utils_1.useFallbackMetric(setValue, aggFilter, metricAggs, '7', '_key');
                });
                expect(setValue).toBeCalledWith('_key');
            });
        });
    });
    describe('useAvailableOptions', () => {
        test('should create an array with the only custom metric', () => {
            let options;
            testHook(() => {
                options = utils_1.useAvailableOptions(aggFilter);
            });
            expect(options).toEqual([utils_1.CUSTOM_METRIC]);
        });
        test('should include default options', () => {
            const DEFAULT_OPTIONS = [{ text: '', value: '', hidden: true }];
            let options;
            testHook(() => {
                options = utils_1.useAvailableOptions(aggFilter, [], DEFAULT_OPTIONS);
            });
            expect(options).toEqual([utils_1.CUSTOM_METRIC, ...DEFAULT_OPTIONS]);
        });
        test('should create an array with enabled metrics in appropriate format', () => {
            let options;
            testHook(() => {
                options = utils_1.useAvailableOptions(aggFilter, metricAggs);
            });
            expect(options).toEqual([
                { text: expect.any(String), value: '2', disabled: false },
                { text: expect.any(String), value: '3', disabled: false },
                utils_1.CUSTOM_METRIC,
            ]);
        });
        test('should create an array with disabled metrics in appropriate format', () => {
            let options;
            testHook(() => {
                options = utils_1.useAvailableOptions(aggFilter, incompatibleAggs);
            });
            expect(options).toEqual([
                { text: expect.any(String), value: '2', disabled: true },
                { text: expect.any(String), value: '3', disabled: true },
                utils_1.CUSTOM_METRIC,
            ]);
        });
    });
    describe('useValidation', () => {
        let setValidity;
        beforeEach(() => {
            setValidity = jest.fn();
        });
        test('should call setValidity', () => {
            testHook(() => {
                utils_1.useValidation(setValidity, false);
            });
            expect(setValidity).toBeCalledWith(false);
        });
        test('should call setValidity with true on component unmount', () => {
            testHook(() => {
                utils_1.useValidation(setValidity, false);
            });
            testComp.unmount();
            expect(setValidity).lastCalledWith(true);
            expect(setValidity).toBeCalledTimes(2);
        });
    });
    describe('safeMakeLabel', () => {
        test('should make agg label', () => {
            const label = utils_1.safeMakeLabel(metricAggs[0]);
            expect(label).toBe('count');
        });
        test('should not fail and return a safety string if makeLabel func is not exist', () => {
            const label = utils_1.safeMakeLabel({});
            expect(label).toEqual(expect.any(String));
        });
    });
});
