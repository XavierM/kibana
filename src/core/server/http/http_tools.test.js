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
jest.mock('fs', () => ({
    // Hapi Inert patches native methods
    ...jest.requireActual('fs'),
    readFileSync: jest.fn(),
}));
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const joi_1 = tslib_1.__importDefault(require("joi"));
const http_tools_1 = require("./http_tools");
const http_server_1 = require("./http_server");
const http_config_1 = require("./http_config");
const router_1 = require("./router");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const config_schema_1 = require("@kbn/config-schema");
const emptyOutput = {
    statusCode: 400,
    headers: {},
    payload: {
        statusCode: 400,
        error: '',
        validation: {
            source: '',
            keys: [],
        },
    },
};
afterEach(() => jest.clearAllMocks());
describe('defaultValidationErrorHandler', () => {
    it('formats value validation errors correctly', () => {
        expect.assertions(1);
        const schema = joi_1.default.array().items(joi_1.default.object({
            type: joi_1.default.string().required(),
        }).required());
        const error = schema.validate([{}], { abortEarly: false }).error;
        // Emulate what Hapi v17 does by default
        error.output = { ...emptyOutput };
        error.output.payload.validation.keys = ['0.type', ''];
        try {
            http_tools_1.defaultValidationErrorHandler({}, {}, error);
        }
        catch (err) {
            // Verify the empty string gets corrected to 'value'
            expect(err.output.payload.validation.keys).toEqual(['0.type', 'value']);
        }
    });
});
describe('timeouts', () => {
    const logger = logging_service_mock_1.loggingServiceMock.create();
    const server = new http_server_1.HttpServer(logger, 'foo');
    const enhanceWithContext = (fn) => fn.bind(null, {});
    test('closes sockets on timeout', async () => {
        const router = new router_1.Router('', logger.get(), enhanceWithContext);
        router.get({ path: '/a', validate: false }, async (context, req, res) => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return res.ok({});
        });
        router.get({ path: '/b', validate: false }, (context, req, res) => res.ok({}));
        const { registerRouter, server: innerServer } = await server.setup({
            socketTimeout: 1000,
            host: '127.0.0.1',
            maxPayload: new config_schema_1.ByteSizeValue(1024),
            ssl: {},
            compression: { enabled: true },
        });
        registerRouter(router);
        await server.start();
        expect(supertest_1.default(innerServer.listener).get('/a')).rejects.toThrow('socket hang up');
        await supertest_1.default(innerServer.listener)
            .get('/b')
            .expect(200);
    });
    afterAll(async () => {
        await server.stop();
    });
});
describe('getServerOptions', () => {
    beforeEach(() => jest.requireMock('fs').readFileSync.mockImplementation((path) => `content-${path}`));
    it('properly configures TLS with default options', () => {
        const httpConfig = new http_config_1.HttpConfig(http_config_1.config.schema.validate({
            ssl: {
                enabled: true,
                key: 'some-key-path',
                certificate: 'some-certificate-path',
            },
        }), {});
        expect(http_tools_1.getServerOptions(httpConfig).tls).toMatchInlineSnapshot(`
      Object {
        "ca": undefined,
        "cert": "content-some-certificate-path",
        "ciphers": "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
        "honorCipherOrder": true,
        "key": "content-some-key-path",
        "passphrase": undefined,
        "rejectUnauthorized": false,
        "requestCert": false,
        "secureOptions": 67108864,
      }
    `);
    });
    it('properly configures TLS with client authentication', () => {
        const httpConfig = new http_config_1.HttpConfig(http_config_1.config.schema.validate({
            ssl: {
                enabled: true,
                key: 'some-key-path',
                certificate: 'some-certificate-path',
                certificateAuthorities: ['ca-1', 'ca-2'],
                clientAuthentication: 'required',
            },
        }), {});
        expect(http_tools_1.getServerOptions(httpConfig).tls).toMatchInlineSnapshot(`
      Object {
        "ca": Array [
          "content-ca-1",
          "content-ca-2",
        ],
        "cert": "content-some-certificate-path",
        "ciphers": "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
        "honorCipherOrder": true,
        "key": "content-some-key-path",
        "passphrase": undefined,
        "rejectUnauthorized": true,
        "requestCert": true,
        "secureOptions": 67108864,
      }
    `);
    });
});
