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
const http_service_mock_1 = require("../../http/http_service.mock");
const recently_accessed_service_1 = require("./recently_accessed_service");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// Maybe this should be moved to our global jest polyfills?
class LocalStorageMock {
    constructor() {
        this.store = new Map();
    }
    clear() {
        this.store.clear();
    }
    getItem(key) {
        return this.store.get(key) || null;
    }
    setItem(key, value) {
        this.store.set(key, value.toString());
    }
    removeItem(key) {
        this.store.delete(key);
    }
    key(index) {
        return [...this.store.keys()][index] || null;
    }
    get length() {
        return this.store.size;
    }
}
describe('RecentlyAccessed#start()', () => {
    let originalLocalStorage;
    beforeAll(() => {
        originalLocalStorage = window.localStorage;
        // @ts-ignore
        window.localStorage = new LocalStorageMock();
    });
    beforeEach(() => localStorage.clear());
    // @ts-ignore
    afterAll(() => (window.localStorage = originalLocalStorage));
    const getStart = async () => {
        const http = http_service_mock_1.httpServiceMock.createStartContract();
        const recentlyAccessed = await new recently_accessed_service_1.RecentlyAccessedService().start({ http });
        return { http, recentlyAccessed };
    };
    it('allows adding and getting items', async () => {
        const { recentlyAccessed } = await getStart();
        recentlyAccessed.add('/app/item1', 'Item 1', 'item1');
        recentlyAccessed.add('/app/item2', 'Item 2', 'item2');
        expect(recentlyAccessed.get()).toEqual([
            { link: '/app/item2', label: 'Item 2', id: 'item2' },
            { link: '/app/item1', label: 'Item 1', id: 'item1' },
        ]);
    });
    it('persists data to localStorage', async () => {
        const { recentlyAccessed: ra1 } = await getStart();
        ra1.add('/app/item1', 'Item 1', 'item1');
        ra1.add('/app/item2', 'Item 2', 'item2');
        const { recentlyAccessed: ra2 } = await getStart();
        expect(ra2.get()).toEqual([
            { link: '/app/item2', label: 'Item 2', id: 'item2' },
            { link: '/app/item1', label: 'Item 1', id: 'item1' },
        ]);
    });
    it('de-duplicates the list', async () => {
        const { recentlyAccessed } = await getStart();
        recentlyAccessed.add('/app/item1', 'Item 1', 'item1');
        recentlyAccessed.add('/app/item2', 'Item 2', 'item2');
        recentlyAccessed.add('/app/item1', 'Item 1', 'item1');
        expect(recentlyAccessed.get()).toEqual([
            { link: '/app/item1', label: 'Item 1', id: 'item1' },
            { link: '/app/item2', label: 'Item 2', id: 'item2' },
        ]);
    });
    it('exposes an observable', async () => {
        const { recentlyAccessed } = await getStart();
        const stop$ = new rxjs_1.Subject();
        const observedValues$ = recentlyAccessed
            .get$()
            .pipe(operators_1.bufferCount(3), operators_1.takeUntil(stop$))
            .toPromise();
        recentlyAccessed.add('/app/item1', 'Item 1', 'item1');
        recentlyAccessed.add('/app/item2', 'Item 2', 'item2');
        stop$.next();
        expect(await observedValues$).toMatchInlineSnapshot(`
Array [
  Array [],
  Array [
    Object {
      "id": "item1",
      "label": "Item 1",
      "link": "/app/item1",
    },
  ],
  Array [
    Object {
      "id": "item2",
      "label": "Item 2",
      "link": "/app/item2",
    },
    Object {
      "id": "item1",
      "label": "Item 1",
      "link": "/app/item1",
    },
  ],
]
`);
    });
});
