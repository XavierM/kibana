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
const update_1 = require("../update");
const test_utils_1 = require("./test_utils");
describe('PUT /api/saved_objects/{type}/{id?}', () => {
    let server;
    let httpSetup;
    let handlerContext;
    let savedObjectsClient;
    beforeEach(async () => {
        const clientResponse = {
            id: 'logstash-*',
            title: 'logstash-*',
            type: 'logstash-type',
            attributes: {},
            timeFieldName: '@timestamp',
            notExpandable: true,
            references: [],
        };
        ({ server, httpSetup, handlerContext } = await test_utils_1.setupServer());
        savedObjectsClient = handlerContext.savedObjects.client;
        savedObjectsClient.update.mockResolvedValue(clientResponse);
        const router = httpSetup.createRouter('/api/saved_objects/');
        update_1.registerUpdateRoute(router);
        await server.start();
    });
    afterEach(async () => {
        await server.stop();
    });
    it('formats successful response', async () => {
        const clientResponse = {
            id: 'logstash-*',
            title: 'logstash-*',
            type: 'logstash-type',
            timeFieldName: '@timestamp',
            notExpandable: true,
            attributes: {},
            references: [],
        };
        savedObjectsClient.update.mockResolvedValue(clientResponse);
        const result = await supertest_1.default(httpSetup.server.listener)
            .put('/api/saved_objects/index-pattern/logstash-*')
            .send({
            attributes: {
                title: 'Testing',
            },
            references: [],
        })
            .expect(200);
        expect(result.body).toEqual(clientResponse);
    });
    it('calls upon savedObjectClient.update', async () => {
        await supertest_1.default(httpSetup.server.listener)
            .put('/api/saved_objects/index-pattern/logstash-*')
            .send({
            attributes: { title: 'Testing' },
            version: 'foo',
        })
            .expect(200);
        expect(savedObjectsClient.update).toHaveBeenCalledWith('index-pattern', 'logstash-*', { title: 'Testing' }, { version: 'foo' });
    });
});
