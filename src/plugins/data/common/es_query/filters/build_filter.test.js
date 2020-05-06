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
const _1 = require(".");
const stubs_1 = require("../../../public/stubs");
describe('buildFilter', () => {
    it('should build phrase filters', () => {
        const params = 'foo';
        const alias = 'bar';
        const state = _1.FilterStateStore.APP_STATE;
        const filter = _1.buildFilter(stubs_1.stubIndexPattern, stubs_1.stubFields[0], _1.FILTERS.PHRASE, false, false, params, alias, state);
        expect(filter.meta.negate).toBe(false);
        expect(filter.meta.alias).toBe(alias);
        expect(filter.$state).toBeDefined();
        if (filter.$state) {
            expect(filter.$state.store).toBe(state);
        }
    });
    it('should build phrases filters', () => {
        const params = ['foo', 'bar'];
        const alias = 'bar';
        const state = _1.FilterStateStore.APP_STATE;
        const filter = _1.buildFilter(stubs_1.stubIndexPattern, stubs_1.stubFields[0], _1.FILTERS.PHRASES, false, false, params, alias, state);
        expect(filter.meta.type).toBe(_1.FILTERS.PHRASES);
        expect(filter.meta.negate).toBe(false);
        expect(filter.meta.alias).toBe(alias);
        expect(filter.$state).toBeDefined();
        if (filter.$state) {
            expect(filter.$state.store).toBe(state);
        }
    });
    it('should build range filters', () => {
        const params = { from: 'foo', to: 'qux' };
        const alias = 'bar';
        const state = _1.FilterStateStore.APP_STATE;
        const filter = _1.buildFilter(stubs_1.stubIndexPattern, stubs_1.stubFields[0], _1.FILTERS.RANGE, false, false, params, alias, state);
        expect(filter.meta.negate).toBe(false);
        expect(filter.meta.alias).toBe(alias);
        expect(filter.$state).toBeDefined();
        if (filter.$state) {
            expect(filter.$state.store).toBe(state);
        }
    });
    it('should build exists filters', () => {
        const params = undefined;
        const alias = 'bar';
        const state = _1.FilterStateStore.APP_STATE;
        const filter = _1.buildFilter(stubs_1.stubIndexPattern, stubs_1.stubFields[0], _1.FILTERS.EXISTS, false, false, params, alias, state);
        expect(filter.meta.negate).toBe(false);
        expect(filter.meta.alias).toBe(alias);
        expect(filter.$state).toBeDefined();
        if (filter.$state) {
            expect(filter.$state.store).toBe(state);
        }
    });
    it('should include disabled state', () => {
        const params = undefined;
        const alias = 'bar';
        const state = _1.FilterStateStore.APP_STATE;
        const filter = _1.buildFilter(stubs_1.stubIndexPattern, stubs_1.stubFields[0], _1.FILTERS.EXISTS, true, true, params, alias, state);
        expect(filter.meta.disabled).toBe(true);
        expect(filter.meta.negate).toBe(true);
    });
});
