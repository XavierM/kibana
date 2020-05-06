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
const create_api_1 = require("./create_api");
const search_1 = require("../../common/search");
const mockDefaultSearch = jest.fn(() => Promise.resolve({ total: 100, loaded: 0 }));
const mockDefaultSearchStrategyProvider = jest.fn(() => Promise.resolve({
    search: mockDefaultSearch,
}));
const mockStrategies = {
    [search_1.DEFAULT_SEARCH_STRATEGY]: mockDefaultSearchStrategyProvider,
};
describe('createApi', () => {
    let api;
    beforeEach(() => {
        api = create_api_1.createApi({
            caller: jest.fn(),
            searchStrategies: mockStrategies,
        });
        mockDefaultSearchStrategyProvider.mockClear();
    });
    it('should default to DEFAULT_SEARCH_STRATEGY if none is provided', async () => {
        await api.search({
            params: {},
        });
        expect(mockDefaultSearchStrategyProvider).toBeCalled();
        expect(mockDefaultSearch).toBeCalled();
    });
    it('should throw if no provider is found for the given name', () => {
        expect(api.search({}, {}, 'noneByThisName')).rejects.toThrowErrorMatchingInlineSnapshot(`"No strategy found for noneByThisName"`);
    });
    it('logs the response if `debug` is set to `true`', async () => {
        const spy = jest.spyOn(console, 'log');
        await api.search({ params: {} });
        expect(spy).not.toBeCalled();
        await api.search({ debug: true, params: {} });
        expect(spy).toBeCalled();
    });
});
