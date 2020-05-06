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
const remove_query_param_1 = require("./remove_query_param");
const history_1 = require("history");
describe('removeQueryParam', () => {
    it('should remove query param from url', () => {
        const startLocation = {
            pathname: '/dashboard/c3a76790-3134-11ea-b024-83a7b4783735',
            search: "?_a=(description:'')&_b=3",
            state: null,
            hash: '',
        };
        const history = history_1.createMemoryHistory();
        history.push(startLocation);
        remove_query_param_1.removeQueryParam(history, '_a');
        expect(history.location).toEqual(expect.objectContaining({
            pathname: '/dashboard/c3a76790-3134-11ea-b024-83a7b4783735',
            search: '?_b=3',
            state: null,
            hash: '',
        }));
    });
    it('should not fail if nothing to remove', () => {
        const startLocation = {
            pathname: '/dashboard/c3a76790-3134-11ea-b024-83a7b4783735',
            search: "?_a=(description:'')&_b=3",
            state: null,
            hash: '',
        };
        const history = history_1.createMemoryHistory();
        history.push(startLocation);
        remove_query_param_1.removeQueryParam(history, '_c');
        expect(history.location).toEqual(expect.objectContaining(startLocation));
    });
    it('should not fail if no search', () => {
        const startLocation = {
            pathname: '/dashboard/c3a76790-3134-11ea-b024-83a7b4783735',
            search: '',
            state: null,
            hash: '',
        };
        const history = history_1.createMemoryHistory();
        history.push(startLocation);
        remove_query_param_1.removeQueryParam(history, '_c');
        expect(history.location).toEqual(expect.objectContaining(startLocation));
    });
});
