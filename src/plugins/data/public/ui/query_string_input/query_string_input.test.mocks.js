"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const stubs_1 = require("../../stubs");
exports.mockPersistedLog = {
    add: jest.fn(),
    get: jest.fn(() => ['response:200']),
};
exports.mockPersistedLogFactory = jest.fn(() => {
    return exports.mockPersistedLog;
});
exports.mockFetchIndexPatterns = jest
    .fn()
    .mockReturnValue(Promise.resolve([stubs_1.stubIndexPatternWithFields]));
jest.mock('../../query/persisted_log', () => ({
    PersistedLog: exports.mockPersistedLogFactory,
}));
jest.mock('./fetch_index_patterns', () => ({
    fetchIndexPatterns: exports.mockFetchIndexPatterns,
}));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
// Using doMock to avoid hoisting so that I can override only the debounce method in lodash
jest.doMock('lodash', () => ({
    ...lodash_1.default,
    debounce: (func) => func,
}));
