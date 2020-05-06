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
const populate_state_from_saved_query_1 = require("./populate_state_from_saved_query");
const mocks_1 = require("../../../mocks");
const common_1 = require("../../../../common");
const get_stub_filter_1 = require("../../../query/filter_manager/test_helpers/get_stub_filter");
describe('populateStateFromSavedQuery', () => {
    let dataMock;
    const baseSavedQuery = {
        id: 'test',
        attributes: {
            title: 'test',
            description: 'test',
            query: {
                query: 'test',
                language: 'kuery',
            },
        },
    };
    beforeEach(() => {
        dataMock = mocks_1.dataPluginMock.createStartContract();
        dataMock.query.filterManager.setFilters = jest.fn();
        dataMock.query.filterManager.getGlobalFilters = jest.fn().mockReturnValue([]);
    });
    it('should set query', async () => {
        const setQueryState = jest.fn();
        const savedQuery = {
            ...baseSavedQuery,
        };
        populate_state_from_saved_query_1.populateStateFromSavedQuery(dataMock.query, setQueryState, savedQuery);
        expect(setQueryState).toHaveBeenCalled();
    });
    it('should set filters', async () => {
        const setQueryState = jest.fn();
        const savedQuery = {
            ...baseSavedQuery,
        };
        const f1 = get_stub_filter_1.getFilter(common_1.FilterStateStore.APP_STATE, false, false, 'age', 34);
        savedQuery.attributes.filters = [f1];
        populate_state_from_saved_query_1.populateStateFromSavedQuery(dataMock.query, setQueryState, savedQuery);
        expect(setQueryState).toHaveBeenCalled();
        expect(dataMock.query.filterManager.setFilters).toHaveBeenCalledWith([f1]);
    });
    it('should preserve global filters', async () => {
        const globalFilter = get_stub_filter_1.getFilter(common_1.FilterStateStore.GLOBAL_STATE, false, false, 'age', 34);
        dataMock.query.filterManager.getGlobalFilters = jest.fn().mockReturnValue([globalFilter]);
        const setQueryState = jest.fn();
        const savedQuery = {
            ...baseSavedQuery,
        };
        const f1 = get_stub_filter_1.getFilter(common_1.FilterStateStore.APP_STATE, false, false, 'age', 34);
        savedQuery.attributes.filters = [f1];
        populate_state_from_saved_query_1.populateStateFromSavedQuery(dataMock.query, setQueryState, savedQuery);
        expect(setQueryState).toHaveBeenCalled();
        expect(dataMock.query.filterManager.setFilters).toHaveBeenCalledWith([globalFilter, f1]);
    });
    it('should update timefilter', async () => {
        const savedQuery = {
            ...baseSavedQuery,
        };
        savedQuery.attributes.timefilter = {
            from: '2018',
            to: '2019',
            refreshInterval: {
                pause: true,
                value: 10,
            },
        };
        dataMock.query.timefilter.timefilter.setTime = jest.fn();
        dataMock.query.timefilter.timefilter.setRefreshInterval = jest.fn();
        populate_state_from_saved_query_1.populateStateFromSavedQuery(dataMock.query, jest.fn(), savedQuery);
        expect(dataMock.query.timefilter.timefilter.setTime).toHaveBeenCalledWith({
            from: savedQuery.attributes.timefilter.from,
            to: savedQuery.attributes.timefilter.to,
        });
        expect(dataMock.query.timefilter.timefilter.setRefreshInterval).toHaveBeenCalledWith(savedQuery.attributes.timefilter.refreshInterval);
    });
});
