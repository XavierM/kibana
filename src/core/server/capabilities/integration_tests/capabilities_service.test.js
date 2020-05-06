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
const context_service_mock_1 = require("../../context/context_service.mock");
const logging_service_mock_1 = require("../../logging/logging_service.mock");
const config_1 = require("../../config");
const env_1 = require("../../config/__mocks__/env");
const __1 = require("..");
const test_utils_1 = require("../../http/test_utils");
const coreId = Symbol('core');
const env = config_1.Env.createDefault(env_1.getEnvOptions());
describe('CapabilitiesService', () => {
    let server;
    let httpSetup;
    let service;
    let serviceSetup;
    beforeEach(async () => {
        server = test_utils_1.createHttpServer();
        httpSetup = await server.setup({
            context: context_service_mock_1.contextServiceMock.createSetupContract(),
        });
        service = new __1.CapabilitiesService({
            coreId,
            env,
            logger: logging_service_mock_1.loggingServiceMock.create(),
            configService: {},
        });
        serviceSetup = await service.setup({ http: httpSetup });
        await server.start();
    });
    afterEach(async () => {
        await server.stop();
    });
    describe('/api/core/capabilities route', () => {
        it('is exposed', async () => {
            const result = await supertest_1.default(httpSetup.server.listener)
                .post('/api/core/capabilities')
                .send({ applications: [] })
                .expect(200);
            expect(result.body).toMatchInlineSnapshot(`
              Object {
                "catalogue": Object {},
                "management": Object {},
                "navLinks": Object {},
              }
          `);
        });
        it('uses the service capabilities providers', async () => {
            serviceSetup.registerProvider(() => ({
                catalogue: {
                    something: true,
                },
            }));
            const result = await supertest_1.default(httpSetup.server.listener)
                .post('/api/core/capabilities')
                .send({ applications: [] })
                .expect(200);
            expect(result.body).toMatchInlineSnapshot(`
        Object {
          "catalogue": Object {
            "something": true,
          },
          "management": Object {},
          "navLinks": Object {},
        }
      `);
        });
    });
});
