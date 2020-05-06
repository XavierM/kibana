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
const only_disabled_1 = require("./only_disabled");
describe('filter manager utilities', () => {
    describe('onlyDisabledFiltersChanged()', () => {
        test('should return true if all filters are disabled', () => {
            const filters = [
                { meta: { disabled: true } },
                { meta: { disabled: true } },
                { meta: { disabled: true } },
            ];
            const newFilters = [{ meta: { disabled: true } }];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(true);
        });
        test('should return false if there are no old filters', () => {
            const newFilters = [{ meta: { disabled: false } }];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, undefined)).toBe(false);
        });
        test('should return false if there are no new filters', () => {
            const filters = [{ meta: { disabled: false } }];
            expect(only_disabled_1.onlyDisabledFiltersChanged(undefined, filters)).toBe(false);
        });
        test('should return false if all filters are not disabled', () => {
            const filters = [
                { meta: { disabled: false } },
                { meta: { disabled: false } },
                { meta: { disabled: false } },
            ];
            const newFilters = [{ meta: { disabled: false } }];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(false);
        });
        test('should return false if only old filters are disabled', () => {
            const filters = [
                { meta: { disabled: true } },
                { meta: { disabled: true } },
                { meta: { disabled: true } },
            ];
            const newFilters = [{ meta: { disabled: false } }];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(false);
        });
        test('should return false if new filters are not disabled', () => {
            const filters = [
                { meta: { disabled: false } },
                { meta: { disabled: false } },
                { meta: { disabled: false } },
            ];
            const newFilters = [{ meta: { disabled: true } }];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(false);
        });
        test('should return true when all removed filters were disabled', () => {
            const filters = [
                { meta: { disabled: true } },
                { meta: { disabled: true } },
                { meta: { disabled: true } },
            ];
            const newFilters = [];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(true);
        });
        test('should return false when all removed filters were not disabled', () => {
            const filters = [
                { meta: { disabled: false } },
                { meta: { disabled: false } },
                { meta: { disabled: false } },
            ];
            const newFilters = [];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(false);
        });
        test('should return true if all changed filters are disabled', () => {
            const filters = [
                { meta: { disabled: true, negate: false } },
                { meta: { disabled: true, negate: false } },
            ];
            const newFilters = [
                { meta: { disabled: true, negate: true } },
                { meta: { disabled: true, negate: true } },
            ];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(true);
        });
        test('should return false if all filters remove were not disabled', () => {
            const filters = [
                { meta: { disabled: false } },
                { meta: { disabled: false } },
                { meta: { disabled: true } },
            ];
            const newFilters = [{ meta: { disabled: false } }];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(false);
        });
        test('should return false when all removed filters are not disabled', () => {
            const filters = [
                { meta: { disabled: true } },
                { meta: { disabled: false } },
                { meta: { disabled: true } },
            ];
            const newFilters = [];
            expect(only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters)).toBe(false);
        });
        test('should not throw with null filters', () => {
            const filters = [null, { meta: { disabled: true } }];
            const newFilters = [];
            expect(() => {
                only_disabled_1.onlyDisabledFiltersChanged(newFilters, filters);
            }).not.toThrowError();
        });
    });
});
