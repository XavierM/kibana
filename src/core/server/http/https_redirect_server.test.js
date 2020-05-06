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
    readFileSync: jest.fn(),
}));
const chance_1 = tslib_1.__importDefault(require("chance"));
const http_1 = require("http");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const config_schema_1 = require("@kbn/config-schema");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const https_redirect_server_1 = require("./https_redirect_server");
const chance = new chance_1.default();
let server;
let config;
function getServerListener(httpServer) {
    return httpServer.server.listener;
}
beforeEach(() => {
    config = {
        host: '127.0.0.1',
        maxPayload: new config_schema_1.ByteSizeValue(1024),
        port: chance.integer({ min: 10000, max: 15000 }),
        ssl: {
            enabled: true,
            redirectHttpFromPort: chance.integer({ min: 20000, max: 30000 }),
        },
    };
    server = new https_redirect_server_1.HttpsRedirectServer(logging_service_mock_1.loggingServiceMock.create().get());
});
afterEach(async () => {
    await server.stop();
});
test('throws if SSL is not enabled', async () => {
    await expect(server.start({
        ...config,
        ssl: {
            enabled: false,
            redirectHttpFromPort: chance.integer({ min: 20000, max: 30000 }),
        },
    })).rejects.toMatchSnapshot();
});
test('throws if [redirectHttpFromPort] is not specified', async () => {
    await expect(server.start({
        ...config,
        ssl: { enabled: true },
    })).rejects.toMatchSnapshot();
});
test('throws if [redirectHttpFromPort] is in use', async () => {
    const mockListen = jest.spyOn(http_1.Server.prototype, 'listen').mockImplementation(() => {
        // eslint-disable-next-line no-throw-literal
        throw { code: 'EADDRINUSE' };
    });
    await expect(server.start({
        ...config,
        ssl: { enabled: true },
    })).rejects.toMatchSnapshot();
    mockListen.mockRestore();
});
test('forwards http requests to https', async () => {
    await server.start(config);
    await supertest_1.default(getServerListener(server))
        .get('/')
        .expect(302)
        .then(res => {
        expect(res.header.location).toEqual(`https://${config.host}:${config.port}/`);
    });
});
