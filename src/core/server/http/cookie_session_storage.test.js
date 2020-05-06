"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const request_1 = tslib_1.__importDefault(require("request"));
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const config_schema_1 = require("@kbn/config-schema");
const rxjs_1 = require("rxjs");
const http_service_1 = require("./http_service");
const router_1 = require("./router");
const config_1 = require("../config");
const env_1 = require("../config/__mocks__/env");
const config_service_mock_1 = require("../config/config_service.mock");
const context_service_mock_1 = require("../context/context_service.mock");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const http_server_mocks_1 = require("./http_server.mocks");
const cookie_session_storage_1 = require("./cookie_session_storage");
let server;
let logger;
let env;
let coreContext;
const configService = config_service_mock_1.configServiceMock.create();
const contextSetup = context_service_mock_1.contextServiceMock.createSetupContract();
const setupDeps = {
    context: contextSetup,
};
configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({
    hosts: ['http://1.2.3.4'],
    maxPayload: new config_schema_1.ByteSizeValue(1024),
    autoListen: true,
    healthCheck: {
        delay: 2000,
    },
    ssl: {
        verificationMode: 'none',
    },
    compression: { enabled: true },
    xsrf: {
        disableProtection: true,
        whitelist: [],
    },
}));
beforeEach(() => {
    logger = logging_service_mock_1.loggingServiceMock.create();
    env = config_1.Env.createDefault(env_1.getEnvOptions());
    coreContext = { coreId: Symbol(), env, logger, configService: configService };
    server = new http_service_1.HttpService(coreContext);
});
afterEach(async () => {
    await server.stop();
});
function retrieveSessionCookie(cookies) {
    const sessionCookie = request_1.default.cookie(cookies);
    if (!sessionCookie) {
        throw new Error('session cookie expected to be defined');
    }
    return sessionCookie;
}
const userData = { id: '42' };
const sessionDurationMs = 1000;
const path = '/';
const sessVal = () => ({ value: userData, expires: Date.now() + sessionDurationMs, path });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const cookieOptions = {
    name: 'sid',
    encryptionKey: 'something_at_least_32_characters',
    validate: (session) => {
        if (Array.isArray(session)) {
            session = session[0];
        }
        const isValid = session.path === path && session.expires > Date.now();
        return { isValid, path: session.path };
    },
    isSecure: false,
    path,
};
describe('Cookie based SessionStorage', () => {
    describe('#set()', () => {
        it('Should write to session storage & set cookies', async () => {
            const { server: innerServer, createRouter } = await server.setup(setupDeps);
            const router = createRouter('');
            router.get({ path, validate: false }, (context, req, res) => {
                const sessionStorage = factory.asScoped(req);
                sessionStorage.set(sessVal());
                return res.ok({});
            });
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), innerServer, cookieOptions);
            await server.start();
            const response = await supertest_1.default(innerServer.listener)
                .get('/')
                .expect(200);
            const cookies = response.get('set-cookie');
            expect(cookies).toBeDefined();
            expect(cookies).toHaveLength(1);
            const sessionCookie = retrieveSessionCookie(cookies[0]);
            expect(sessionCookie).toBeDefined();
            expect(sessionCookie.key).toBe('sid');
            expect(sessionCookie.value).toBeDefined();
            expect(sessionCookie.path).toBe('/');
            expect(sessionCookie.httpOnly).toBe(true);
        });
    });
    describe('#get()', () => {
        it('reads from session storage', async () => {
            const { server: innerServer, createRouter } = await server.setup(setupDeps);
            const router = createRouter('');
            router.get({ path: '/', validate: false }, async (context, req, res) => {
                const sessionStorage = factory.asScoped(req);
                const sessionValue = await sessionStorage.get();
                if (!sessionValue) {
                    sessionStorage.set(sessVal());
                    return res.ok();
                }
                return res.ok({ body: { value: sessionValue.value } });
            });
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), innerServer, cookieOptions);
            await server.start();
            const response = await supertest_1.default(innerServer.listener)
                .get('/')
                .expect(200);
            const cookies = response.get('set-cookie');
            expect(cookies).toBeDefined();
            expect(cookies).toHaveLength(1);
            const sessionCookie = retrieveSessionCookie(cookies[0]);
            await supertest_1.default(innerServer.listener)
                .get('/')
                .set('Cookie', `${sessionCookie.key}=${sessionCookie.value}`)
                .expect(200, { value: userData });
        });
        it('returns null for empty session', async () => {
            const { server: innerServer, createRouter } = await server.setup(setupDeps);
            const router = createRouter('');
            router.get({ path: '/', validate: false }, async (context, req, res) => {
                const sessionStorage = factory.asScoped(req);
                const sessionValue = await sessionStorage.get();
                return res.ok({ body: { value: sessionValue } });
            });
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), innerServer, cookieOptions);
            await server.start();
            const response = await supertest_1.default(innerServer.listener)
                .get('/')
                .expect(200, { value: null });
            const cookies = response.get('set-cookie');
            expect(cookies).not.toBeDefined();
        });
        it('returns null for invalid session (expired) & clean cookies', async () => {
            const { server: innerServer, createRouter } = await server.setup(setupDeps);
            const router = createRouter('');
            let setOnce = false;
            router.get({ path: '/', validate: false }, async (context, req, res) => {
                const sessionStorage = factory.asScoped(req);
                if (!setOnce) {
                    setOnce = true;
                    sessionStorage.set(sessVal());
                    return res.ok({ body: { value: userData } });
                }
                const sessionValue = await sessionStorage.get();
                return res.ok({ body: { value: sessionValue } });
            });
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), innerServer, cookieOptions);
            await server.start();
            const response = await supertest_1.default(innerServer.listener)
                .get('/')
                .expect(200, { value: userData });
            const cookies = response.get('set-cookie');
            expect(cookies).toBeDefined();
            await delay(sessionDurationMs);
            const sessionCookie = retrieveSessionCookie(cookies[0]);
            const response2 = await supertest_1.default(innerServer.listener)
                .get('/')
                .set('Cookie', `${sessionCookie.key}=${sessionCookie.value}`)
                .expect(200, { value: null });
            const cookies2 = response2.get('set-cookie');
            expect(cookies2).toEqual([
                'sid=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/',
            ]);
        });
        it('returns null for invalid session (incorrect path) & clean cookies accurately', async () => {
            const { server: innerServer, createRouter } = await server.setup(setupDeps);
            const router = createRouter('');
            let setOnce = false;
            router.get({ path: '/', validate: false }, async (context, req, res) => {
                const sessionStorage = factory.asScoped(req);
                if (!setOnce) {
                    setOnce = true;
                    sessionStorage.set({ ...sessVal(), path: '/foo' });
                    return res.ok({ body: { value: userData } });
                }
                const sessionValue = await sessionStorage.get();
                return res.ok({ body: { value: sessionValue } });
            });
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), innerServer, cookieOptions);
            await server.start();
            const response = await supertest_1.default(innerServer.listener)
                .get('/')
                .expect(200, { value: userData });
            const cookies = response.get('set-cookie');
            expect(cookies).toBeDefined();
            const sessionCookie = retrieveSessionCookie(cookies[0]);
            const response2 = await supertest_1.default(innerServer.listener)
                .get('/')
                .set('Cookie', `${sessionCookie.key}=${sessionCookie.value}`)
                .expect(200, { value: null });
            const cookies2 = response2.get('set-cookie');
            expect(cookies2).toEqual([
                'sid=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/foo',
            ]);
        });
        // use mocks to simplify test setup
        it('returns null if multiple session cookies are detected.', async () => {
            const mockServer = {
                register: jest.fn(),
                auth: {
                    strategy: jest.fn(),
                    test: jest.fn(() => ['foo', 'bar']),
                },
            };
            const mockRequest = http_server_mocks_1.httpServerMock.createRawRequest();
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), mockServer, cookieOptions);
            expect(mockServer.register).toBeCalledTimes(1);
            expect(mockServer.auth.strategy).toBeCalledTimes(1);
            const session = await factory.asScoped(router_1.KibanaRequest.from(mockRequest)).get();
            expect(session).toBe(null);
            expect(mockServer.auth.test).toBeCalledTimes(1);
            expect(mockServer.auth.test).toHaveBeenCalledWith('security-cookie', mockRequest);
            expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toEqual([
                ['Found 2 auth sessions when we were only expecting 1.'],
            ]);
        });
        it('returns session if single session cookie is in an array.', async () => {
            const mockServer = {
                register: jest.fn(),
                auth: {
                    strategy: jest.fn(),
                    test: jest.fn(() => ['foo']),
                },
            };
            const mockRequest = http_server_mocks_1.httpServerMock.createRawRequest();
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), mockServer, cookieOptions);
            expect(mockServer.register).toBeCalledTimes(1);
            expect(mockServer.auth.strategy).toBeCalledTimes(1);
            const session = await factory.asScoped(router_1.KibanaRequest.from(mockRequest)).get();
            expect(session).toBe('foo');
            expect(mockServer.auth.test).toBeCalledTimes(1);
            expect(mockServer.auth.test).toHaveBeenCalledWith('security-cookie', mockRequest);
        });
        it('logs the reason of validation function failure.', async () => {
            const mockServer = {
                register: jest.fn(),
                auth: {
                    strategy: jest.fn(),
                    test: () => {
                        throw new Error('Invalid cookie.');
                    },
                },
            };
            const mockRequest = http_server_mocks_1.httpServerMock.createRawRequest();
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), mockServer, cookieOptions);
            expect(mockServer.register).toBeCalledTimes(1);
            expect(mockServer.auth.strategy).toBeCalledTimes(1);
            const session = await factory.asScoped(router_1.KibanaRequest.from(mockRequest)).get();
            expect(session).toBe(null);
            expect(logging_service_mock_1.loggingServiceMock.collect(logger).debug).toEqual([['Error: Invalid cookie.']]);
        });
    });
    describe('#clear()', () => {
        it('clears session storage & remove cookies', async () => {
            const { server: innerServer, createRouter } = await server.setup(setupDeps);
            const router = createRouter('');
            router.get({ path: '/', validate: false }, async (context, req, res) => {
                const sessionStorage = factory.asScoped(req);
                if (await sessionStorage.get()) {
                    sessionStorage.clear();
                    return res.ok({});
                }
                sessionStorage.set(sessVal());
                return res.ok({});
            });
            const factory = await cookie_session_storage_1.createCookieSessionStorageFactory(logger.get(), innerServer, cookieOptions);
            await server.start();
            const response = await supertest_1.default(innerServer.listener)
                .get('/')
                .expect(200);
            const cookies = response.get('set-cookie');
            const sessionCookie = retrieveSessionCookie(cookies[0]);
            const response2 = await supertest_1.default(innerServer.listener)
                .get('/')
                .set('Cookie', `${sessionCookie.key}=${sessionCookie.value}`)
                .expect(200);
            const cookies2 = response2.get('set-cookie');
            expect(cookies2).toEqual([
                'sid=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/',
            ]);
        });
    });
});
