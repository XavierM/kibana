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
const mocks_1 = require("../../../../core/server/mocks");
const search_service_1 = require("./search_service");
const mockSearchApi = { search: jest.fn() };
jest.mock('./create_api', () => ({
    createApi: () => mockSearchApi,
}));
describe('Search service', () => {
    let plugin;
    let mockCoreSetup;
    beforeEach(() => {
        plugin = new search_service_1.SearchService(mocks_1.coreMock.createPluginInitializerContext({}));
        mockCoreSetup = mocks_1.coreMock.createSetup();
        mockSearchApi.search.mockClear();
    });
    describe('setup()', () => {
        it('exposes proper contract', async () => {
            const setup = plugin.setup(mockCoreSetup);
            expect(setup).toHaveProperty('registerSearchStrategyContext');
            expect(setup).toHaveProperty('registerSearchStrategyProvider');
        });
    });
});
