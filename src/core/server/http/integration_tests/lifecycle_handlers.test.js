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
const path_1 = require("path");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const rxjs_1 = require("rxjs");
const config_schema_1 = require("@kbn/config-schema");
const test_utils_1 = require("../test_utils");
const config_service_mock_1 = require("../../config/config_service.mock");
const context_service_mock_1 = require("../../context/context_service.mock");
const pkgPath = path_1.resolve(__dirname, '../../../../../package.json');
const actualVersion = require(pkgPath).version;
const versionHeader = 'kbn-version';
const xsrfHeader = 'kbn-xsrf';
const nameHeader = 'kbn-name';
const whitelistedTestPath = '/xsrf/test/route/whitelisted';
const xsrfDisabledTestPath = '/xsrf/test/route/disabled';
const kibanaName = 'my-kibana-name';
const setupDeps = {
    context: context_service_mock_1.contextServiceMock.createSetupContract(),
};
describe('core lifecycle handlers', () => {
    let server;
    let innerServer;
    let router;
    beforeEach(async () => {
        const configService = config_service_mock_1.configServiceMock.create();
        configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({
            hosts: ['localhost'],
            maxPayload: new config_schema_1.ByteSizeValue(1024),
            autoListen: true,
            ssl: {
                enabled: false,
            },
            compression: { enabled: true },
            name: kibanaName,
            customResponseHeaders: {
                'some-header': 'some-value',
            },
            xsrf: { disableProtection: false, whitelist: [whitelistedTestPath] },
        }));
        server = test_utils_1.createHttpServer({ configService });
        const serverSetup = await server.setup(setupDeps);
        router = serverSetup.createRouter('/');
        innerServer = serverSetup.server;
    }, 30000);
    afterEach(async () => {
        await server.stop();
    });
    describe('versionCheck post-auth handler', () => {
        const testRoute = '/version_check/test/route';
        beforeEach(async () => {
            router.get({ path: testRoute, validate: false }, (context, req, res) => {
                return res.ok({ body: 'ok' });
            });
            await server.start();
        });
        it('accepts requests with the correct version passed in the version header', async () => {
            await supertest_1.default(innerServer.listener)
                .get(testRoute)
                .set(versionHeader, actualVersion)
                .expect(200, 'ok');
        });
        it('accepts requests that do not include a version header', async () => {
            await supertest_1.default(innerServer.listener)
                .get(testRoute)
                .expect(200, 'ok');
        });
        it('rejects requests with an incorrect version passed in the version header', async () => {
            await supertest_1.default(innerServer.listener)
                .get(testRoute)
                .set(versionHeader, 'invalid-version')
                .expect(400, /Browser client is out of date/);
        });
    });
    describe('customHeaders pre-response handler', () => {
        const testRoute = '/custom_headers/test/route';
        const testErrorRoute = '/custom_headers/test/error_route';
        beforeEach(async () => {
            router.get({ path: testRoute, validate: false }, (context, req, res) => {
                return res.ok({ body: 'ok' });
            });
            router.get({ path: testErrorRoute, validate: false }, (context, req, res) => {
                return res.badRequest({ body: 'bad request' });
            });
            await server.start();
        });
        it('adds the kbn-name header', async () => {
            const result = await supertest_1.default(innerServer.listener)
                .get(testRoute)
                .expect(200, 'ok');
            const headers = result.header;
            expect(headers).toEqual(expect.objectContaining({
                [nameHeader]: kibanaName,
            }));
        });
        it('adds the kbn-name header in case of error', async () => {
            const result = await supertest_1.default(innerServer.listener)
                .get(testErrorRoute)
                .expect(400);
            const headers = result.header;
            expect(headers).toEqual(expect.objectContaining({
                [nameHeader]: kibanaName,
            }));
        });
        it('adds the custom headers', async () => {
            const result = await supertest_1.default(innerServer.listener)
                .get(testRoute)
                .expect(200, 'ok');
            const headers = result.header;
            expect(headers).toEqual(expect.objectContaining({ 'some-header': 'some-value' }));
        });
        it('adds the custom headers in case of error', async () => {
            const result = await supertest_1.default(innerServer.listener)
                .get(testErrorRoute)
                .expect(400);
            const headers = result.header;
            expect(headers).toEqual(expect.objectContaining({ 'some-header': 'some-value' }));
        });
    });
    describe('xsrf post-auth handler', () => {
        const testPath = '/xsrf/test/route';
        const destructiveMethods = ['POST', 'PUT', 'DELETE'];
        const nonDestructiveMethods = ['GET', 'HEAD'];
        const getSupertest = (method, path) => {
            return supertest_1.default(innerServer.listener)[method.toLowerCase()](path);
        };
        beforeEach(async () => {
            router.get({ path: testPath, validate: false }, (context, req, res) => {
                return res.ok({ body: 'ok' });
            });
            destructiveMethods.forEach(method => {
                router[method.toLowerCase()]({ path: testPath, validate: false }, (context, req, res) => {
                    return res.ok({ body: 'ok' });
                });
                router[method.toLowerCase()]({ path: whitelistedTestPath, validate: false }, (context, req, res) => {
                    return res.ok({ body: 'ok' });
                });
                router[method.toLowerCase()]({ path: xsrfDisabledTestPath, validate: false, options: { xsrfRequired: false } }, (context, req, res) => {
                    return res.ok({ body: 'ok' });
                });
            });
            await server.start();
        });
        nonDestructiveMethods.forEach(method => {
            describe(`When using non-destructive ${method} method`, () => {
                it('accepts requests without a token', async () => {
                    await getSupertest(method.toLowerCase(), testPath).expect(200, method === 'HEAD' ? undefined : 'ok');
                });
                it('accepts requests with the xsrf header', async () => {
                    await getSupertest(method.toLowerCase(), testPath)
                        .set(xsrfHeader, 'anything')
                        .expect(200, method === 'HEAD' ? undefined : 'ok');
                });
            });
        });
        destructiveMethods.forEach(method => {
            describe(`When using destructive ${method} method`, () => {
                it('accepts requests with the xsrf header', async () => {
                    await getSupertest(method.toLowerCase(), testPath)
                        .set(xsrfHeader, 'anything')
                        .expect(200, 'ok');
                });
                it('accepts requests with the version header', async () => {
                    await getSupertest(method.toLowerCase(), testPath)
                        .set(versionHeader, actualVersion)
                        .expect(200, 'ok');
                });
                it('rejects requests without either an xsrf or version header', async () => {
                    await getSupertest(method.toLowerCase(), testPath).expect(400, {
                        statusCode: 400,
                        error: 'Bad Request',
                        message: 'Request must contain a kbn-xsrf header.',
                    });
                });
                it('accepts whitelisted requests without either an xsrf or version header', async () => {
                    await getSupertest(method.toLowerCase(), whitelistedTestPath).expect(200, 'ok');
                });
                it('accepts requests on a route with disabled xsrf protection', async () => {
                    await getSupertest(method.toLowerCase(), xsrfDisabledTestPath).expect(200, 'ok');
                });
            });
        });
    });
});
