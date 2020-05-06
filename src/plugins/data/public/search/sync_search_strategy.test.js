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
const mocks_1 = require("../../../../core/public/mocks");
const sync_search_strategy_1 = require("./sync_search_strategy");
describe('Sync search strategy', () => {
    let mockCoreStart;
    beforeEach(() => {
        mockCoreStart = mocks_1.coreMock.createStart();
    });
    it('returns a strategy with `search` that calls the backend API', () => {
        mockCoreStart.http.fetch.mockImplementationOnce(() => Promise.resolve());
        const syncSearch = sync_search_strategy_1.syncSearchStrategyProvider({
            core: mockCoreStart,
            getSearchStrategy: jest.fn(),
        });
        const request = { serverStrategy: sync_search_strategy_1.SYNC_SEARCH_STRATEGY };
        syncSearch.search(request, {});
        expect(mockCoreStart.http.fetch.mock.calls[0][0]).toEqual({
            path: `/internal/search/${sync_search_strategy_1.SYNC_SEARCH_STRATEGY}`,
            body: JSON.stringify({
                serverStrategy: 'SYNC_SEARCH_STRATEGY',
            }),
            method: 'POST',
            signal: undefined,
        });
    });
    it('increments and decrements loading count on success', async () => {
        const expectedLoadingCountValues = [0, 1, 0];
        const receivedLoadingCountValues = [];
        mockCoreStart.http.fetch.mockResolvedValueOnce('response');
        const syncSearch = sync_search_strategy_1.syncSearchStrategyProvider({
            core: mockCoreStart,
            getSearchStrategy: jest.fn(),
        });
        const request = { serverStrategy: sync_search_strategy_1.SYNC_SEARCH_STRATEGY };
        const loadingCount$ = mockCoreStart.http.addLoadingCountSource.mock.calls[0][0];
        loadingCount$.subscribe(value => receivedLoadingCountValues.push(value));
        await syncSearch.search(request, {}).toPromise();
        expect(receivedLoadingCountValues).toEqual(expectedLoadingCountValues);
    });
    it('increments and decrements loading count on failure', async () => {
        expect.assertions(1);
        const expectedLoadingCountValues = [0, 1, 0];
        const receivedLoadingCountValues = [];
        mockCoreStart.http.fetch.mockRejectedValueOnce('error');
        const syncSearch = sync_search_strategy_1.syncSearchStrategyProvider({
            core: mockCoreStart,
            getSearchStrategy: jest.fn(),
        });
        const request = { serverStrategy: sync_search_strategy_1.SYNC_SEARCH_STRATEGY };
        const loadingCount$ = mockCoreStart.http.addLoadingCountSource.mock.calls[0][0];
        loadingCount$.subscribe(value => receivedLoadingCountValues.push(value));
        try {
            await syncSearch.search(request, {}).toPromise();
        }
        catch (e) {
            expect(receivedLoadingCountValues).toEqual(expectedLoadingCountValues);
        }
    });
});
