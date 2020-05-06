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
const find_all_1 = require("./find_all");
describe('telemetry_application_usage', () => {
    test('when savedObjectClient is initialised, return something', async () => {
        const savedObjectClient = mocks_1.savedObjectsRepositoryMock.create();
        savedObjectClient.find.mockImplementation(async () => ({
            saved_objects: [],
            total: 0,
        }));
        expect(await find_all_1.findAll(savedObjectClient, { type: 'test-type' })).toStrictEqual([]);
    });
    test('paging in findAll works', async () => {
        const savedObjectClient = mocks_1.savedObjectsRepositoryMock.create();
        let total = 201;
        const doc = { id: 'test-id', attributes: { test: 1 } };
        savedObjectClient.find.mockImplementation(async (opts) => {
            if ((opts.page || 1) > 2) {
                return { saved_objects: [], total };
            }
            const savedObjects = new Array(opts.perPage).fill(doc);
            total = savedObjects.length * 2 + 1;
            return { saved_objects: savedObjects, total };
        });
        expect(await find_all_1.findAll(savedObjectClient, { type: 'test-type' })).toStrictEqual(new Array(total - 1).fill(doc));
    });
});
