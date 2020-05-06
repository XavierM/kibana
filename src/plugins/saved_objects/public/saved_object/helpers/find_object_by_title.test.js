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
const find_object_by_title_1 = require("./find_object_by_title");
const public_1 = require("../../../../../core/public");
describe('findObjectByTitle', () => {
    const savedObjectsClient = {};
    beforeEach(() => {
        savedObjectsClient.find = jest.fn();
    });
    it('returns undefined if title is not provided', async () => {
        const match = await find_object_by_title_1.findObjectByTitle(savedObjectsClient, 'index-pattern', '');
        expect(match).toBeUndefined();
    });
    it('matches any case', async () => {
        const indexPattern = new public_1.SimpleSavedObject(savedObjectsClient, {
            attributes: { title: 'foo' },
        });
        savedObjectsClient.find = jest.fn().mockImplementation(() => Promise.resolve({
            savedObjects: [indexPattern],
        }));
        const match = await find_object_by_title_1.findObjectByTitle(savedObjectsClient, 'index-pattern', 'FOO');
        expect(match).toEqual(indexPattern);
    });
});
