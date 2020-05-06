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
const history_1 = require("history");
const get_stub_filter_1 = require("../filter_manager/test_helpers/get_stub_filter");
const common_1 = require("../../../common");
const mocks_1 = require("../../../../../core/public/mocks");
const public_1 = require("../../../../kibana_utils/public");
const query_service_1 = require("../query_service");
const stub_browser_storage_1 = require("test_utils/stub_browser_storage");
const sync_state_with_url_1 = require("./sync_state_with_url");
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
describe('sync_query_state_with_url', () => {
    let queryServiceStart;
    let filterManager;
    let timefilter;
    let kbnUrlStateStorage;
    let history;
    let filterManagerChangeSub;
    let filterManagerChangeTriggered = jest.fn();
    let gF;
    let aF;
    const pathWithFilter = "/#?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!t,index:'logstash-*',key:query,negate:!t,type:custom,value:'%7B%22match%22:%7B%22key1%22:%22value1%22%7D%7D'),query:(match:(key1:value1)))),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))";
    beforeEach(() => {
        const queryService = new query_service_1.QueryService();
        queryService.setup({
            uiSettings: setupMock.uiSettings,
            storage: new public_1.Storage(new stub_browser_storage_1.StubBrowserStorage()),
        });
        queryServiceStart = queryService.start(startMock.savedObjects);
        filterManager = queryServiceStart.filterManager;
        timefilter = queryServiceStart.timefilter.timefilter;
        filterManagerChangeTriggered = jest.fn();
        filterManagerChangeSub = filterManager.getUpdates$().subscribe(filterManagerChangeTriggered);
        window.location.href = '/';
        history = history_1.createBrowserHistory();
        kbnUrlStateStorage = public_1.createKbnUrlStateStorage({ useHash: false, history });
        gF = get_stub_filter_1.getFilter(common_1.FilterStateStore.GLOBAL_STATE, true, true, 'key1', 'value1');
        aF = get_stub_filter_1.getFilter(common_1.FilterStateStore.APP_STATE, true, true, 'key3', 'value3');
    });
    afterEach(() => {
        filterManagerChangeSub.unsubscribe();
    });
    test('url is actually changed when data in services changes', () => {
        const { stop } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        filterManager.setFilters([gF, aF]);
        kbnUrlStateStorage.flush(); // sync force location change
        expect(history.location.hash).toMatchInlineSnapshot(`"#?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!t,index:'logstash-*',key:query,negate:!t,type:custom,value:'%7B%22match%22:%7B%22key1%22:%22value1%22%7D%7D'),query:(match:(key1:value1)))),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))"`);
        stop();
    });
    test('when filters change, global filters synced to urlStorage', () => {
        const { stop } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        filterManager.setFilters([gF, aF]);
        expect(kbnUrlStateStorage.get('_g')?.filters).toHaveLength(1);
        stop();
    });
    test('when time range changes, time synced to urlStorage', () => {
        const { stop } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        timefilter.setTime({ from: 'now-30m', to: 'now' });
        expect(kbnUrlStateStorage.get('_g')?.time).toEqual({
            from: 'now-30m',
            to: 'now',
        });
        stop();
    });
    test('when refresh interval changes, refresh interval is synced to urlStorage', () => {
        const { stop } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        timefilter.setRefreshInterval({ pause: true, value: 100 });
        expect(kbnUrlStateStorage.get('_g')?.refreshInterval).toEqual({
            pause: true,
            value: 100,
        });
        stop();
    });
    test('when url is changed, filters synced back to filterManager', () => {
        const { stop } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        kbnUrlStateStorage.cancel(); // stop initial syncing pending update
        history.push(pathWithFilter);
        expect(filterManager.getGlobalFilters()).toHaveLength(1);
        stop();
    });
    test('initial url should be synced with services', () => {
        history.push(pathWithFilter);
        const { stop, hasInheritedQueryFromUrl } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        expect(hasInheritedQueryFromUrl).toBe(true);
        expect(filterManager.getGlobalFilters()).toHaveLength(1);
        stop();
    });
    test("url changes shouldn't trigger services updates if data didn't change", () => {
        const { stop } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        filterManagerChangeTriggered.mockClear();
        history.push(pathWithFilter);
        history.push(pathWithFilter);
        history.push(pathWithFilter);
        expect(filterManagerChangeTriggered).not.toBeCalled();
        stop();
    });
    test("if data didn't change, kbnUrlStateStorage.set shouldn't be called", () => {
        const { stop } = sync_state_with_url_1.syncQueryStateWithUrl(queryServiceStart, kbnUrlStateStorage);
        filterManager.setFilters([gF, aF]);
        const spy = jest.spyOn(kbnUrlStateStorage, 'set');
        filterManager.setFilters([gF]); // global filters didn't change
        expect(spy).not.toBeCalled();
        stop();
    });
});
