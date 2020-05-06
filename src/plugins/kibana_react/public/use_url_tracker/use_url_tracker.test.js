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
const react_hooks_1 = require("@testing-library/react-hooks");
const use_url_tracker_1 = require("./use_url_tracker");
const stub_browser_storage_1 = require("test_utils/stub_browser_storage");
const history_1 = require("history");
describe('useUrlTracker', () => {
    const key = 'key';
    let storage = new stub_browser_storage_1.StubBrowserStorage();
    let history = history_1.createMemoryHistory();
    beforeEach(() => {
        storage = new stub_browser_storage_1.StubBrowserStorage();
        history = history_1.createMemoryHistory();
    });
    it('should track history changes and save them to storage', () => {
        expect(storage.getItem(key)).toBeNull();
        const { unmount } = react_hooks_1.renderHook(() => {
            use_url_tracker_1.useUrlTracker(key, history, () => false, storage);
        });
        expect(storage.getItem(key)).toBe('/');
        history.push('/change');
        expect(storage.getItem(key)).toBe('/change');
        unmount();
        history.push('/other-change');
        expect(storage.getItem(key)).toBe('/change');
    });
    it('by default should restore initial url', () => {
        storage.setItem(key, '/change');
        react_hooks_1.renderHook(() => {
            use_url_tracker_1.useUrlTracker(key, history, undefined, storage);
        });
        expect(history.location.pathname).toBe('/change');
    });
    it('should restore initial url if shouldRestoreUrl cb returns true', () => {
        storage.setItem(key, '/change');
        react_hooks_1.renderHook(() => {
            use_url_tracker_1.useUrlTracker(key, history, () => true, storage);
        });
        expect(history.location.pathname).toBe('/change');
    });
    it('should not restore initial url if shouldRestoreUrl cb returns false', () => {
        storage.setItem(key, '/change');
        react_hooks_1.renderHook(() => {
            use_url_tracker_1.useUrlTracker(key, history, () => false, storage);
        });
        expect(history.location.pathname).toBe('/');
    });
});
