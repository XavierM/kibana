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
const get_stub_filter_1 = require("../filter_manager/test_helpers/get_stub_filter");
const common_1 = require("../../../common");
const mocks_1 = require("../../../../../core/public/mocks");
const public_1 = require("../../../../kibana_utils/public");
const query_service_1 = require("../query_service");
const stub_browser_storage_1 = require("../../../../../test_utils/public/stub_browser_storage");
const connect_to_query_state_1 = require("./connect_to_query_state");
const connectToQueryGlobalState = (query, state) => connect_to_query_state_1.connectToQueryState(query, state, {
    refreshInterval: true,
    time: true,
    filters: common_1.FilterStateStore.GLOBAL_STATE,
});
const connectToQueryAppState = (query, state) => connect_to_query_state_1.connectToQueryState(query, state, {
    filters: common_1.FilterStateStore.APP_STATE,
});
const setupMock = mocks_1.coreMock.createSetup();
const startMock = mocks_1.coreMock.createStart();
setupMock.uiSettings.get.mockImplementation((key) => {
    switch (key) {
        case 'filters:pinnedByDefault':
            return true;
        case 'timepicker:timeDefaults':
            return { from: 'now-15m', to: 'now' };
        case 'timepicker:refreshIntervalDefaults':
            return { pause: false, value: 0 };
        default:
            throw new Error(`sync_query test: not mocked uiSetting: ${key}`);
    }
});
describe('connect_to_global_state', () => {
    let queryServiceStart;
    let filterManager;
    let timeFilter;
    let globalState;
    let globalStateSub;
    let globalStateChangeTriggered = jest.fn();
    let filterManagerChangeSub;
    let filterManagerChangeTriggered = jest.fn();
    let gF1;
    let gF2;
    let aF1;
    let aF2;
    beforeEach(() => {
        const queryService = new query_service_1.QueryService();
        queryService.setup({
            uiSettings: setupMock.uiSettings,
            storage: new public_1.Storage(new stub_browser_storage_1.StubBrowserStorage()),
        });
        queryServiceStart = queryService.start(startMock.savedObjects);
        filterManager = queryServiceStart.filterManager;
        timeFilter = queryServiceStart.timefilter.timefilter;
        globalState = public_1.createStateContainer({});
        globalStateChangeTriggered = jest.fn();
        globalStateSub = globalState.state$.subscribe(globalStateChangeTriggered);
        filterManagerChangeTriggered = jest.fn();
        filterManagerChangeSub = filterManager.getUpdates$().subscribe(filterManagerChangeTriggered);
        gF1 = get_stub_filter_1.getFilter(common_1.FilterStateStore.GLOBAL_STATE, true, true, 'key1', 'value1');
        gF2 = get_stub_filter_1.getFilter(common_1.FilterStateStore.GLOBAL_STATE, false, false, 'key2', 'value2');
        aF1 = get_stub_filter_1.getFilter(common_1.FilterStateStore.APP_STATE, true, true, 'key3', 'value3');
        aF2 = get_stub_filter_1.getFilter(common_1.FilterStateStore.APP_STATE, false, false, 'key4', 'value4');
    });
    afterEach(() => {
        globalStateSub.unsubscribe();
        filterManagerChangeSub.unsubscribe();
    });
    test('state is initialized with state from query service', () => {
        const stop = connectToQueryGlobalState(queryServiceStart, globalState);
        expect(globalState.get()).toEqual({
            filters: filterManager.getGlobalFilters(),
            refreshInterval: timeFilter.getRefreshInterval(),
            time: timeFilter.getTime(),
        });
        stop();
    });
    test('when time range changes, state container contains updated time range', () => {
        const stop = connectToQueryGlobalState(queryServiceStart, globalState);
        timeFilter.setTime({ from: 'now-30m', to: 'now' });
        expect(globalState.get().time).toEqual({
            from: 'now-30m',
            to: 'now',
        });
        stop();
    });
    test('when refresh interval changes, state container contains updated refresh interval', () => {
        const stop = connectToQueryGlobalState(queryServiceStart, globalState);
        timeFilter.setRefreshInterval({ pause: true, value: 100 });
        expect(globalState.get().refreshInterval).toEqual({
            pause: true,
            value: 100,
        });
        stop();
    });
    test('state changes should propagate to services', () => {
        const stop = connectToQueryGlobalState(queryServiceStart, globalState);
        globalStateChangeTriggered.mockClear();
        globalState.set({
            ...globalState.get(),
            filters: [gF1, gF2],
            refreshInterval: { pause: true, value: 100 },
            time: { from: 'now-30m', to: 'now' },
        });
        expect(globalStateChangeTriggered).toBeCalledTimes(1);
        expect(filterManager.getGlobalFilters()).toHaveLength(2);
        expect(timeFilter.getRefreshInterval()).toEqual({ pause: true, value: 100 });
        expect(timeFilter.getTime()).toEqual({ from: 'now-30m', to: 'now' });
        stop();
    });
    describe('sync from filterManager to global state', () => {
        test('should sync global filters to global state when new global filters set to filterManager', () => {
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            filterManager.setFilters([gF1, aF1]);
            expect(globalState.get().filters).toHaveLength(1);
            stop();
        });
        test('should not sync app filters to global state ', () => {
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            filterManager.setFilters([aF1, aF2]);
            expect(globalState.get().filters).toHaveLength(0);
            stop();
        });
        test("should not trigger changes when global filters didn't change", () => {
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            globalStateChangeTriggered.mockClear();
            filterManager.setFilters([gF1, aF1]);
            filterManager.setFilters([gF1, aF2]);
            expect(globalStateChangeTriggered).toBeCalledTimes(1);
            expect(globalState.get().filters).toHaveLength(1);
            stop();
        });
        test('should trigger changes when global filters change', () => {
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            globalStateChangeTriggered.mockClear();
            filterManager.setFilters([gF1, aF1]);
            filterManager.setFilters([gF2, aF1]);
            expect(globalStateChangeTriggered).toBeCalledTimes(2);
            expect(globalState.get().filters).toHaveLength(1);
            stop();
        });
        test('resetting filters should sync to global state', () => {
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            filterManager.setFilters([gF1, aF1]);
            expect(globalState.get().filters).toHaveLength(1);
            filterManager.removeAll();
            expect(globalState.get().filters).toHaveLength(0);
            stop();
        });
        test("shouldn't sync filters when syncing is stopped", () => {
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            filterManager.setFilters([gF1, aF1]);
            expect(globalState.get().filters).toHaveLength(1);
            stop();
            filterManager.removeAll();
            expect(globalState.get().filters).toHaveLength(1);
        });
        test('should pick up initial state from filterManager', () => {
            globalState.set({ filters: [gF1] });
            filterManager.setFilters([aF1]);
            globalStateChangeTriggered.mockClear();
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            expect(globalStateChangeTriggered).toBeCalledTimes(1);
            expect(globalState.get().filters).toHaveLength(0);
            stop();
        });
    });
    describe('sync from global state to filterManager', () => {
        test('changes to global state should be synced to global filters', () => {
            filterManager.setFilters([aF1]);
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            globalStateChangeTriggered.mockClear();
            globalState.set({ ...globalState.get(), filters: [gF1] });
            expect(filterManager.getFilters()).toHaveLength(2);
            expect(filterManager.getAppFilters()).toHaveLength(1);
            expect(filterManager.getGlobalFilters()).toHaveLength(1);
            expect(globalStateChangeTriggered).toBeCalledTimes(1);
            stop();
        });
        test('app filters should remain untouched', () => {
            filterManager.setFilters([gF1, gF2, aF1, aF2]);
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            globalStateChangeTriggered.mockClear();
            globalState.set({ ...globalState.get(), filters: [] });
            expect(filterManager.getFilters()).toHaveLength(2);
            expect(filterManager.getAppFilters()).toHaveLength(2);
            expect(filterManager.getGlobalFilters()).toHaveLength(0);
            expect(globalStateChangeTriggered).toBeCalledTimes(1);
            stop();
        });
        test("if filters are not changed, filterManager shouldn't trigger update", () => {
            filterManager.setFilters([gF1, gF2, aF1, aF2]);
            filterManagerChangeTriggered.mockClear();
            globalState.set({ ...globalState.get(), filters: [gF1, gF2] });
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            globalState.set({ ...globalState.get(), filters: [gF1, gF2] });
            expect(filterManagerChangeTriggered).toBeCalledTimes(0);
            stop();
        });
        test('stop() should stop syncing', () => {
            filterManager.setFilters([gF1, gF2, aF1, aF2]);
            const stop = connectToQueryGlobalState(queryServiceStart, globalState);
            globalState.set({ ...globalState.get(), filters: [] });
            expect(filterManager.getFilters()).toHaveLength(2);
            stop();
            globalState.set({ ...globalState.get(), filters: [gF1] });
            expect(filterManager.getFilters()).toHaveLength(2);
        });
    });
});
describe('connect_to_app_state', () => {
    let queryServiceStart;
    let filterManager;
    let appState;
    let appStateSub;
    let appStateChangeTriggered = jest.fn();
    let filterManagerChangeSub;
    let filterManagerChangeTriggered = jest.fn();
    let gF1;
    let gF2;
    let aF1;
    let aF2;
    beforeEach(() => {
        const queryService = new query_service_1.QueryService();
        queryService.setup({
            uiSettings: setupMock.uiSettings,
            storage: new public_1.Storage(new stub_browser_storage_1.StubBrowserStorage()),
        });
        queryServiceStart = queryService.start(startMock.savedObjects);
        filterManager = queryServiceStart.filterManager;
        appState = public_1.createStateContainer({});
        appStateChangeTriggered = jest.fn();
        appStateSub = appState.state$.subscribe(appStateChangeTriggered);
        filterManagerChangeTriggered = jest.fn();
        filterManagerChangeSub = filterManager.getUpdates$().subscribe(filterManagerChangeTriggered);
        gF1 = get_stub_filter_1.getFilter(common_1.FilterStateStore.GLOBAL_STATE, true, true, 'key1', 'value1');
        gF2 = get_stub_filter_1.getFilter(common_1.FilterStateStore.GLOBAL_STATE, false, false, 'key2', 'value2');
        aF1 = get_stub_filter_1.getFilter(common_1.FilterStateStore.APP_STATE, true, true, 'key3', 'value3');
        aF2 = get_stub_filter_1.getFilter(common_1.FilterStateStore.APP_STATE, false, false, 'key4', 'value4');
    });
    afterEach(() => {
        appStateSub.unsubscribe();
        filterManagerChangeSub.unsubscribe();
    });
    describe('sync from filterManager to app state', () => {
        test('should sync app filters to app state when new app filters set to filterManager', () => {
            const stop = connectToQueryAppState(queryServiceStart, appState);
            filterManager.setFilters([gF1, aF1]);
            expect(appState.get().filters).toHaveLength(1);
            stop();
        });
        test('should not sync global filters to app state ', () => {
            const stop = connectToQueryAppState(queryServiceStart, appState);
            filterManager.setFilters([gF1, gF2]);
            expect(appState.get().filters).toHaveLength(0);
            stop();
        });
        test("should not trigger changes when app filters didn't change", () => {
            const stop = connectToQueryAppState(queryServiceStart, appState);
            appStateChangeTriggered.mockClear();
            filterManager.setFilters([gF1, aF1]);
            filterManager.setFilters([gF2, aF1]);
            expect(appStateChangeTriggered).toBeCalledTimes(1);
            expect(appState.get().filters).toHaveLength(1);
            stop();
        });
        test('should trigger changes when app filters change', () => {
            const stop = connectToQueryAppState(queryServiceStart, appState);
            appStateChangeTriggered.mockClear();
            filterManager.setFilters([gF1, aF1]);
            filterManager.setFilters([gF1, aF2]);
            expect(appStateChangeTriggered).toBeCalledTimes(2);
            expect(appState.get().filters).toHaveLength(1);
            stop();
        });
        test('resetting filters should sync to app state', () => {
            const stop = connectToQueryAppState(queryServiceStart, appState);
            filterManager.setFilters([gF1, aF1]);
            expect(appState.get().filters).toHaveLength(1);
            filterManager.removeAll();
            expect(appState.get().filters).toHaveLength(0);
            stop();
        });
        test("shouldn't sync filters when syncing is stopped", () => {
            const stop = connectToQueryAppState(queryServiceStart, appState);
            filterManager.setFilters([gF1, aF1]);
            expect(appState.get().filters).toHaveLength(1);
            stop();
            filterManager.removeAll();
            expect(appState.get().filters).toHaveLength(1);
        });
        test('should pick up initial state from filterManager', () => {
            appState.set({ filters: [aF1] });
            filterManager.setFilters([gF1]);
            appStateChangeTriggered.mockClear();
            const stop = connectToQueryAppState(queryServiceStart, appState);
            expect(appStateChangeTriggered).toBeCalledTimes(1);
            expect(appState.get().filters).toHaveLength(0);
            stop();
        });
    });
    describe('sync from app state to filterManager', () => {
        test('changes to app state should be synced to app filters', () => {
            filterManager.setFilters([gF1]);
            const stop = connectToQueryAppState(queryServiceStart, appState);
            appStateChangeTriggered.mockClear();
            appState.set({ filters: [aF1] });
            expect(filterManager.getFilters()).toHaveLength(2);
            expect(filterManager.getAppFilters()).toHaveLength(1);
            expect(filterManager.getGlobalFilters()).toHaveLength(1);
            expect(appStateChangeTriggered).toBeCalledTimes(1);
            stop();
        });
        test('global filters should remain untouched', () => {
            filterManager.setFilters([gF1, gF2, aF1, aF2]);
            const stop = connectToQueryAppState(queryServiceStart, appState);
            appStateChangeTriggered.mockClear();
            appState.set({ filters: [] });
            expect(filterManager.getFilters()).toHaveLength(2);
            expect(filterManager.getGlobalFilters()).toHaveLength(2);
            expect(appStateChangeTriggered).toBeCalledTimes(1);
            stop();
        });
        test("if filters are not changed, filterManager shouldn't trigger update", () => {
            filterManager.setFilters([gF1, gF2, aF1, aF2]);
            filterManagerChangeTriggered.mockClear();
            appState.set({ filters: [aF1, aF2] });
            const stop = connectToQueryAppState(queryServiceStart, appState);
            appState.set({ filters: [aF1, aF2] });
            expect(filterManagerChangeTriggered).toBeCalledTimes(0);
            stop();
        });
        test('stop() should stop syncing', () => {
            filterManager.setFilters([gF1, gF2, aF1, aF2]);
            const stop = connectToQueryAppState(queryServiceStart, appState);
            appState.set({ filters: [] });
            expect(filterManager.getFilters()).toHaveLength(2);
            stop();
            appState.set({ filters: [aF1] });
            expect(filterManager.getFilters()).toHaveLength(2);
        });
    });
});
describe('filters with different state', () => {
    let queryServiceStart;
    let filterManager;
    let state;
    let stateSub;
    let stateChangeTriggered = jest.fn();
    let filterManagerChangeSub;
    let filterManagerChangeTriggered = jest.fn();
    let filter;
    beforeEach(() => {
        const queryService = new query_service_1.QueryService();
        queryService.setup({
            uiSettings: setupMock.uiSettings,
            storage: new public_1.Storage(new stub_browser_storage_1.StubBrowserStorage()),
        });
        queryServiceStart = queryService.start(startMock.savedObjects);
        filterManager = queryServiceStart.filterManager;
        state = public_1.createStateContainer({});
        stateChangeTriggered = jest.fn();
        stateSub = state.state$.subscribe(stateChangeTriggered);
        filterManagerChangeTriggered = jest.fn();
        filterManagerChangeSub = filterManager.getUpdates$().subscribe(filterManagerChangeTriggered);
        filter = get_stub_filter_1.getFilter(common_1.FilterStateStore.GLOBAL_STATE, true, true, 'key1', 'value1');
    });
    // applies filter state changes, changes only internal $state.store value
    function runChanges() {
        filter = { ...filter, $state: { store: common_1.FilterStateStore.GLOBAL_STATE } };
        state.set({
            filters: [filter],
        });
        filter = { ...filter, $state: { store: common_1.FilterStateStore.APP_STATE } };
        state.set({
            filters: [filter],
        });
        filter = { ...filter };
        delete filter.$state;
        state.set({
            filters: [filter],
        });
    }
    test('when syncing all filters, changes to filter.state$ should be taken into account', () => {
        const stop = connect_to_query_state_1.connectToQueryState(queryServiceStart, state, {
            filters: true,
        });
        runChanges();
        expect(filterManagerChangeTriggered).toBeCalledTimes(3);
        stop();
    });
    test('when syncing app state filters, changes to filter.state$ should be ignored', () => {
        const stop = connect_to_query_state_1.connectToQueryState(queryServiceStart, state, {
            filters: common_1.FilterStateStore.APP_STATE,
        });
        runChanges();
        expect(filterManagerChangeTriggered).toBeCalledTimes(1);
        stop();
    });
    test('when syncing global state filters, changes to filter.state$ should be ignored', () => {
        const stop = connect_to_query_state_1.connectToQueryState(queryServiceStart, state, {
            filters: common_1.FilterStateStore.GLOBAL_STATE,
        });
        runChanges();
        expect(filterManagerChangeTriggered).toBeCalledTimes(1);
        stop();
    });
    afterEach(() => {
        stateSub.unsubscribe();
        filterManagerChangeSub.unsubscribe();
    });
});
