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
const log_legacy_import_1 = require("../log_legacy_import");
const logging_service_mock_1 = require("../../../logging/logging_service.mock");
const test_utils_1 = require("./test_utils");
describe('POST /api/saved_objects/_log_legacy_import', () => {
    let server;
    let httpSetup;
    let logger;
    beforeEach(async () => {
        ({ server, httpSetup } = await test_utils_1.setupServer());
        logger = logging_service_mock_1.loggingServiceMock.createLogger();
        const router = httpSetup.createRouter('/api/saved_objects/');
        log_legacy_import_1.registerLogLegacyImportRoute(router, logger);
        await server.start();
    });
    afterEach(async () => {
        await server.stop();
    });
    it('logs a warning when called', async () => {
        const result = await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/_log_legacy_import')
            .expect(200);
        expect(result.body).toEqual({ success: true });
        expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toMatchInlineSnapshot(`
      Array [
        Array [
          "Importing saved objects from a .json file has been deprecated",
        ],
      ]
    `);
    });
});
