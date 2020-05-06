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
const create_1 = require("../create");
const test_utils_1 = require("./test_utils");
describe('POST /api/saved_objects/{type}', () => {
    let server;
    let httpSetup;
    let handlerContext;
    let savedObjectsClient;
    const clientResponse = {
        id: 'logstash-*',
        type: 'index-pattern',
        title: 'logstash-*',
        version: 'foo',
        references: [],
        attributes: {},
    };
    beforeEach(async () => {
        ({ server, httpSetup, handlerContext } = await test_utils_1.setupServer());
        savedObjectsClient = handlerContext.savedObjects.client;
        savedObjectsClient.create.mockImplementation(() => Promise.resolve(clientResponse));
        const router = httpSetup.createRouter('/api/saved_objects/');
        create_1.registerCreateRoute(router);
        await server.start();
    });
    afterEach(async () => {
        await server.stop();
    });
    it('formats successful response', async () => {
        const result = await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/index-pattern')
            .send({
            attributes: {
                title: 'Testing',
            },
        })
            .expect(200);
        expect(result.body).toEqual(clientResponse);
    });
    it('requires attributes', async () => {
        const result = await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/index-pattern')
            .send({})
            .expect(400);
        // expect(response.validation.keys).toContain('attributes');
        expect(result.body.message).toMatchInlineSnapshot(`"[request body.attributes]: expected value of type [object] but got [undefined]"`);
    });
    it('calls upon savedObjectClient.create', async () => {
        await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/index-pattern')
            .send({
            attributes: {
                title: 'Testing',
            },
        })
            .expect(200);
        expect(savedObjectsClient.create).toHaveBeenCalledTimes(1);
        expect(savedObjectsClient.create).toHaveBeenCalledWith('index-pattern', { title: 'Testing' }, { overwrite: false, id: undefined, migrationVersion: undefined });
    });
    it('can specify an id', async () => {
        await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/index-pattern/logstash-*')
            .send({
            attributes: {
                title: 'Testing',
            },
        })
            .expect(200);
        expect(savedObjectsClient.create).toHaveBeenCalledTimes(1);
        const args = savedObjectsClient.create.mock.calls[0];
        expect(args).toEqual([
            'index-pattern',
            { title: 'Testing' },
            { overwrite: false, id: 'logstash-*' },
        ]);
    });
});
