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
const get_1 = require("../get");
const context_1 = require("../../../context");
const test_utils_1 = require("../../../http/test_utils");
const mocks_1 = require("../../../mocks");
const coreId = Symbol('core');
describe('GET /api/saved_objects/{type}/{id}', () => {
    let server;
    let httpSetup;
    let handlerContext;
    let savedObjectsClient;
    beforeEach(async () => {
        const coreContext = test_utils_1.createCoreContext({ coreId });
        server = test_utils_1.createHttpServer(coreContext);
        const contextService = new context_1.ContextService(coreContext);
        httpSetup = await server.setup({
            context: contextService.setup({ pluginDependencies: new Map() }),
        });
        handlerContext = mocks_1.coreMock.createRequestHandlerContext();
        savedObjectsClient = handlerContext.savedObjects.client;
        httpSetup.registerRouteHandlerContext(coreId, 'core', async (ctx, req, res) => {
            return handlerContext;
        });
        const router = httpSetup.createRouter('/api/saved_objects/');
        get_1.registerGetRoute(router);
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
            attributes: {},
            timeFieldName: '@timestamp',
            notExpandable: true,
            references: [],
        };
        savedObjectsClient.get.mockResolvedValue(clientResponse);
        const result = await supertest_1.default(httpSetup.server.listener)
            .get('/api/saved_objects/index-pattern/logstash-*')
            .expect(200);
        expect(result.body).toEqual(clientResponse);
    });
    it('calls upon savedObjectClient.get', async () => {
        await supertest_1.default(httpSetup.server.listener)
            .get('/api/saved_objects/index-pattern/logstash-*')
            .expect(200);
        expect(savedObjectsClient.get).toHaveBeenCalled();
        const args = savedObjectsClient.get.mock.calls[0];
        expect(args).toEqual(['index-pattern', 'logstash-*']);
    });
});
