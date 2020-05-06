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
const stub_browser_storage_1 = require("test_utils/stub_browser_storage");
const hashed_item_store_1 = require("./hashed_item_store");
/**
 * Useful for mocking state_storage from jest,
 *
 * import { mockSessionStorage } from '../state_storage/mock;
 *
 * And all tests in the test file will use HashedItemStoreSingleton
 * with underlying mockSessionStorage we have access to
 */
exports.mockStorage = new stub_browser_storage_1.StubBrowserStorage();
const mockHashedItemStore = new hashed_item_store_1.HashedItemStore(exports.mockStorage);
jest.mock('./', () => {
    return {
        HashedItemStore: require('./hashed_item_store').HashedItemStore,
        hashedItemStore: mockHashedItemStore,
    };
});
