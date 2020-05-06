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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const test_utils_1 = require("../../http/test_utils");
const context_service_mock_1 = require("../../context/context_service.mock");
const server_1 = require("../collectors/server");
const requestWaitDelay = 25;
describe('ServerMetricsCollector', () => {
    let server;
    let collector;
    let hapiServer;
    let router;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const sendGet = (path) => supertest_1.default(hapiServer.listener).get(path);
    beforeEach(async () => {
        server = test_utils_1.createHttpServer();
        const contextSetup = context_service_mock_1.contextServiceMock.createSetupContract();
        const httpSetup = await server.setup({ context: contextSetup });
        hapiServer = httpSetup.server;
        router = httpSetup.createRouter('/');
        collector = new server_1.ServerMetricsCollector(hapiServer);
    });
    afterEach(async () => {
        await server.stop();
    });
    it('collect requests infos', async () => {
        router.get({ path: '/', validate: false }, async (ctx, req, res) => {
            return res.ok({ body: '' });
        });
        await server.start();
        let metrics = await collector.collect();
        expect(metrics.requests).toEqual({
            total: 0,
            disconnects: 0,
            statusCodes: {},
        });
        await sendGet('/');
        await sendGet('/');
        await sendGet('/not-found');
        metrics = await collector.collect();
        expect(metrics.requests).toEqual({
            total: 3,
            disconnects: 0,
            statusCodes: {
                '200': 2,
                '404': 1,
            },
        });
    });
    it('collect disconnects requests infos', async () => {
        const never = new Promise(resolve => undefined);
        const hitSubject = new rxjs_1.BehaviorSubject(0);
        router.get({ path: '/', validate: false }, async (ctx, req, res) => {
            return res.ok({ body: '' });
        });
        router.get({ path: '/disconnect', validate: false }, async (ctx, req, res) => {
            hitSubject.next(hitSubject.value + 1);
            await never;
            return res.ok({ body: '' });
        });
        await server.start();
        await sendGet('/');
        const discoReq1 = sendGet('/disconnect').end();
        const discoReq2 = sendGet('/disconnect').end();
        await hitSubject
            .pipe(operators_1.filter(count => count >= 2), operators_1.take(1))
            .toPromise();
        let metrics = await collector.collect();
        expect(metrics.requests).toEqual(expect.objectContaining({
            total: 3,
            disconnects: 0,
        }));
        discoReq1.abort();
        await delay(requestWaitDelay);
        metrics = await collector.collect();
        expect(metrics.requests).toEqual(expect.objectContaining({
            total: 3,
            disconnects: 1,
        }));
        discoReq2.abort();
        await delay(requestWaitDelay);
        metrics = await collector.collect();
        expect(metrics.requests).toEqual(expect.objectContaining({
            total: 3,
            disconnects: 2,
        }));
    });
    it('collect response times', async () => {
        router.get({ path: '/no-delay', validate: false }, async (ctx, req, res) => {
            return res.ok({ body: '' });
        });
        router.get({ path: '/500-ms', validate: false }, async (ctx, req, res) => {
            await delay(500);
            return res.ok({ body: '' });
        });
        router.get({ path: '/250-ms', validate: false }, async (ctx, req, res) => {
            await delay(250);
            return res.ok({ body: '' });
        });
        await server.start();
        await Promise.all([sendGet('/no-delay'), sendGet('/250-ms')]);
        let metrics = await collector.collect();
        expect(metrics.response_times.avg_in_millis).toBeGreaterThanOrEqual(125);
        expect(metrics.response_times.max_in_millis).toBeGreaterThanOrEqual(250);
        await Promise.all([sendGet('/500-ms'), sendGet('/500-ms')]);
        metrics = await collector.collect();
        expect(metrics.response_times.avg_in_millis).toBeGreaterThanOrEqual(250);
        expect(metrics.response_times.max_in_millis).toBeGreaterThanOrEqual(500);
    });
    it('collect connection count', async () => {
        const waitSubject = new rxjs_1.Subject();
        const hitSubject = new rxjs_1.BehaviorSubject(0);
        router.get({ path: '/', validate: false }, async (ctx, req, res) => {
            hitSubject.next(hitSubject.value + 1);
            await waitSubject.pipe(operators_1.take(1)).toPromise();
            return res.ok({ body: '' });
        });
        await server.start();
        const waitForHits = (hits) => hitSubject
            .pipe(operators_1.filter(count => count >= hits), operators_1.take(1))
            .toPromise();
        let metrics = await collector.collect();
        expect(metrics.concurrent_connections).toEqual(0);
        sendGet('/').end(() => null);
        await waitForHits(1);
        metrics = await collector.collect();
        expect(metrics.concurrent_connections).toEqual(1);
        sendGet('/').end(() => null);
        await waitForHits(2);
        metrics = await collector.collect();
        expect(metrics.concurrent_connections).toEqual(2);
        waitSubject.next('go');
        await delay(requestWaitDelay);
        metrics = await collector.collect();
        expect(metrics.concurrent_connections).toEqual(0);
    });
    describe('#reset', () => {
        it('reset the requests state', async () => {
            router.get({ path: '/', validate: false }, async (ctx, req, res) => {
                return res.ok({ body: '' });
            });
            await server.start();
            await sendGet('/');
            await sendGet('/');
            await sendGet('/not-found');
            let metrics = await collector.collect();
            expect(metrics.requests).toEqual({
                total: 3,
                disconnects: 0,
                statusCodes: {
                    '200': 2,
                    '404': 1,
                },
            });
            collector.reset();
            metrics = await collector.collect();
            expect(metrics.requests).toEqual({
                total: 0,
                disconnects: 0,
                statusCodes: {},
            });
            await sendGet('/');
            await sendGet('/not-found');
            metrics = await collector.collect();
            expect(metrics.requests).toEqual({
                total: 2,
                disconnects: 0,
                statusCodes: {
                    '200': 1,
                    '404': 1,
                },
            });
        });
        it('resets the response times', async () => {
            router.get({ path: '/no-delay', validate: false }, async (ctx, req, res) => {
                return res.ok({ body: '' });
            });
            router.get({ path: '/500-ms', validate: false }, async (ctx, req, res) => {
                await delay(500);
                return res.ok({ body: '' });
            });
            await server.start();
            await Promise.all([sendGet('/no-delay'), sendGet('/500-ms')]);
            let metrics = await collector.collect();
            expect(metrics.response_times.avg_in_millis).toBeGreaterThanOrEqual(250);
            expect(metrics.response_times.max_in_millis).toBeGreaterThanOrEqual(500);
            collector.reset();
            metrics = await collector.collect();
            expect(metrics.response_times.avg_in_millis).toBe(0);
            expect(metrics.response_times.max_in_millis).toBeGreaterThanOrEqual(0);
            await Promise.all([sendGet('/500-ms'), sendGet('/500-ms')]);
            metrics = await collector.collect();
            expect(metrics.response_times.avg_in_millis).toBeGreaterThanOrEqual(500);
            expect(metrics.response_times.max_in_millis).toBeGreaterThanOrEqual(500);
        });
    });
});
