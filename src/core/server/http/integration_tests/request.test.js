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
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const context_service_mock_1 = require("../../context/context_service.mock");
const logging_service_mock_1 = require("../../logging/logging_service.mock");
const test_utils_1 = require("../test_utils");
let server;
let logger;
const contextSetup = context_service_mock_1.contextServiceMock.createSetupContract();
const setupDeps = {
    context: contextSetup,
};
beforeEach(() => {
    logger = logging_service_mock_1.loggingServiceMock.create();
    server = test_utils_1.createHttpServer({ logger });
});
afterEach(async () => {
    await server.stop();
});
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
describe('KibanaRequest', () => {
    describe('auth', () => {
        describe('isAuthenticated', () => {
            it('returns false if no auth interceptor was registered', async () => {
                const { server: innerServer, createRouter } = await server.setup(setupDeps);
                const router = createRouter('/');
                router.get({ path: '/', validate: false, options: { authRequired: true } }, (context, req, res) => res.ok({ body: { isAuthenticated: req.auth.isAuthenticated } }));
                await server.start();
                await supertest_1.default(innerServer.listener)
                    .get('/')
                    .expect(200, {
                    isAuthenticated: false,
                });
            });
            it('returns false if not authenticated on a route with authRequired: "optional"', async () => {
                const { server: innerServer, createRouter, registerAuth } = await server.setup(setupDeps);
                const router = createRouter('/');
                registerAuth((req, res, toolkit) => toolkit.notHandled());
                router.get({ path: '/', validate: false, options: { authRequired: 'optional' } }, (context, req, res) => res.ok({ body: { isAuthenticated: req.auth.isAuthenticated } }));
                await server.start();
                await supertest_1.default(innerServer.listener)
                    .get('/')
                    .expect(200, {
                    isAuthenticated: false,
                });
            });
            it('returns false if redirected on a route with authRequired: "optional"', async () => {
                const { server: innerServer, createRouter, registerAuth } = await server.setup(setupDeps);
                const router = createRouter('/');
                registerAuth((req, res, toolkit) => toolkit.redirected({ location: '/any' }));
                router.get({ path: '/', validate: false, options: { authRequired: 'optional' } }, (context, req, res) => res.ok({ body: { isAuthenticated: req.auth.isAuthenticated } }));
                await server.start();
                await supertest_1.default(innerServer.listener)
                    .get('/')
                    .expect(200, {
                    isAuthenticated: false,
                });
            });
            it('returns true if authenticated on a route with authRequired: "optional"', async () => {
                const { server: innerServer, createRouter, registerAuth } = await server.setup(setupDeps);
                const router = createRouter('/');
                registerAuth((req, res, toolkit) => toolkit.authenticated());
                router.get({ path: '/', validate: false, options: { authRequired: 'optional' } }, (context, req, res) => res.ok({ body: { isAuthenticated: req.auth.isAuthenticated } }));
                await server.start();
                await supertest_1.default(innerServer.listener)
                    .get('/')
                    .expect(200, {
                    isAuthenticated: true,
                });
            });
            it('returns true if authenticated', async () => {
                const { server: innerServer, createRouter, registerAuth } = await server.setup(setupDeps);
                const router = createRouter('/');
                registerAuth((req, res, toolkit) => toolkit.authenticated());
                router.get({ path: '/', validate: false, options: { authRequired: true } }, (context, req, res) => res.ok({ body: { isAuthenticated: req.auth.isAuthenticated } }));
                await server.start();
                await supertest_1.default(innerServer.listener)
                    .get('/')
                    .expect(200, {
                    isAuthenticated: true,
                });
            });
        });
    });
    describe('events', () => {
        describe('aborted$', () => {
            it('emits once and completes when request aborted', async (done) => {
                expect.assertions(1);
                const { server: innerServer, createRouter } = await server.setup(setupDeps);
                const router = createRouter('/');
                const nextSpy = jest.fn();
                router.get({ path: '/', validate: false }, async (context, request, res) => {
                    request.events.aborted$.subscribe({
                        next: nextSpy,
                        complete: () => {
                            expect(nextSpy).toHaveBeenCalledTimes(1);
                            done();
                        },
                    });
                    // prevents the server to respond
                    await delay(30000);
                    return res.ok({ body: 'ok' });
                });
                await server.start();
                const incomingRequest = supertest_1.default(innerServer.listener)
                    .get('/')
                    // end required to send request
                    .end();
                setTimeout(() => incomingRequest.abort(), 50);
            });
            it('completes & does not emit when request handled', async () => {
                const { server: innerServer, createRouter } = await server.setup(setupDeps);
                const router = createRouter('/');
                const nextSpy = jest.fn();
                const completeSpy = jest.fn();
                router.get({ path: '/', validate: false }, async (context, request, res) => {
                    request.events.aborted$.subscribe({
                        next: nextSpy,
                        complete: completeSpy,
                    });
                    return res.ok({ body: 'ok' });
                });
                await server.start();
                await supertest_1.default(innerServer.listener).get('/');
                expect(nextSpy).toHaveBeenCalledTimes(0);
                expect(completeSpy).toHaveBeenCalledTimes(1);
            });
            it('completes & does not emit when request rejected', async () => {
                const { server: innerServer, createRouter } = await server.setup(setupDeps);
                const router = createRouter('/');
                const nextSpy = jest.fn();
                const completeSpy = jest.fn();
                router.get({ path: '/', validate: false }, async (context, request, res) => {
                    request.events.aborted$.subscribe({
                        next: nextSpy,
                        complete: completeSpy,
                    });
                    return res.badRequest();
                });
                await server.start();
                await supertest_1.default(innerServer.listener).get('/');
                expect(nextSpy).toHaveBeenCalledTimes(0);
                expect(completeSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
