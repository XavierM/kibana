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
const tslib_1 = require("tslib");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const bulk_get_1 = require("../bulk_get");
const test_utils_1 = require("./test_utils");
describe('POST /api/saved_objects/_bulk_get', () => {
    let server;
    let httpSetup;
    let handlerContext;
    let savedObjectsClient;
    beforeEach(async () => {
        ({ server, httpSetup, handlerContext } = await test_utils_1.setupServer());
        savedObjectsClient = handlerContext.savedObjects.client;
        savedObjectsClient.bulkGet.mockResolvedValue({
            saved_objects: [],
        });
        const router = httpSetup.createRouter('/api/saved_objects/');
        bulk_get_1.registerBulkGetRoute(router);
        await server.start();
    });
    afterEach(async () => {
        await server.stop();
    });
    it('formats successful response', async () => {
        const clientResponse = {
            saved_objects: [
                {
                    id: 'abc123',
                    type: 'index-pattern',
                    title: 'logstash-*',
                    version: 'foo',
                    references: [],
                    attributes: {},
                },
            ],
        };
        savedObjectsClient.bulkGet.mockImplementation(() => Promise.resolve(clientResponse));
        const result = await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/_bulk_get')
            .send([
            {
                id: 'abc123',
                type: 'index-pattern',
            },
        ])
            .expect(200);
        expect(result.body).toEqual(clientResponse);
    });
    it('calls upon savedObjectClient.bulkGet', async () => {
        const docs = [
            {
                id: 'abc123',
                type: 'index-pattern',
            },
        ];
        await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/_bulk_get')
            .send(docs)
            .expect(200);
        expect(savedObjectsClient.bulkGet).toHaveBeenCalledTimes(1);
        expect(savedObjectsClient.bulkGet).toHaveBeenCalledWith(docs);
    });
});
