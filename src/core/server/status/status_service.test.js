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
const rxjs_1 = require("rxjs");
const types_1 = require("./types");
const status_service_1 = require("./status_service");
const operators_1 = require("rxjs/operators");
const core_context_mock_1 = require("../core_context.mock");
const test_utils_1 = require("./test_utils");
expect.addSnapshotSerializer(test_utils_1.ServiceStatusLevelSnapshotSerializer);
describe('StatusService', () => {
    const available = {
        level: types_1.ServiceStatusLevels.available,
        summary: 'Available',
    };
    const degraded = {
        level: types_1.ServiceStatusLevels.degraded,
        summary: 'This is degraded!',
    };
    describe('setup', () => {
        describe('core$', () => {
            it('rolls up core status observables into single observable', async () => {
                const setup = new status_service_1.StatusService(core_context_mock_1.mockCoreContext.create()).setup({
                    elasticsearch: {
                        status$: rxjs_1.of(available),
                    },
                    savedObjects: {
                        status$: rxjs_1.of(degraded),
                    },
                });
                expect(await setup.core$.pipe(operators_1.first()).toPromise()).toEqual({
                    elasticsearch: available,
                    savedObjects: degraded,
                });
            });
            it('replays last event', async () => {
                const setup = new status_service_1.StatusService(core_context_mock_1.mockCoreContext.create()).setup({
                    elasticsearch: {
                        status$: rxjs_1.of(available),
                    },
                    savedObjects: {
                        status$: rxjs_1.of(degraded),
                    },
                });
                const subResult1 = await setup.core$.pipe(operators_1.first()).toPromise();
                const subResult2 = await setup.core$.pipe(operators_1.first()).toPromise();
                const subResult3 = await setup.core$.pipe(operators_1.first()).toPromise();
                expect(subResult1).toEqual({
                    elasticsearch: available,
                    savedObjects: degraded,
                });
                expect(subResult2).toEqual({
                    elasticsearch: available,
                    savedObjects: degraded,
                });
                expect(subResult3).toEqual({
                    elasticsearch: available,
                    savedObjects: degraded,
                });
            });
            it('does not emit duplicate events', () => {
                const elasticsearch$ = new rxjs_1.BehaviorSubject(available);
                const savedObjects$ = new rxjs_1.BehaviorSubject(degraded);
                const setup = new status_service_1.StatusService(core_context_mock_1.mockCoreContext.create()).setup({
                    elasticsearch: {
                        status$: elasticsearch$,
                    },
                    savedObjects: {
                        status$: savedObjects$,
                    },
                });
                const statusUpdates = [];
                const subscription = setup.core$.subscribe(status => statusUpdates.push(status));
                elasticsearch$.next(available);
                elasticsearch$.next(available);
                elasticsearch$.next({
                    level: types_1.ServiceStatusLevels.available,
                    summary: `Wow another summary`,
                });
                savedObjects$.next(degraded);
                savedObjects$.next(available);
                savedObjects$.next(available);
                subscription.unsubscribe();
                expect(statusUpdates).toMatchInlineSnapshot(`
          Array [
            Object {
              "elasticsearch": Object {
                "level": available,
                "summary": "Available",
              },
              "savedObjects": Object {
                "level": degraded,
                "summary": "This is degraded!",
              },
            },
            Object {
              "elasticsearch": Object {
                "level": available,
                "summary": "Wow another summary",
              },
              "savedObjects": Object {
                "level": degraded,
                "summary": "This is degraded!",
              },
            },
            Object {
              "elasticsearch": Object {
                "level": available,
                "summary": "Wow another summary",
              },
              "savedObjects": Object {
                "level": available,
                "summary": "Available",
              },
            },
          ]
        `);
            });
        });
        describe('overall$', () => {
            it('exposes an overall summary', async () => {
                const setup = new status_service_1.StatusService(core_context_mock_1.mockCoreContext.create()).setup({
                    elasticsearch: {
                        status$: rxjs_1.of(degraded),
                    },
                    savedObjects: {
                        status$: rxjs_1.of(degraded),
                    },
                });
                expect(await setup.overall$.pipe(operators_1.first()).toPromise()).toMatchObject({
                    level: types_1.ServiceStatusLevels.degraded,
                    summary: '[2] services are degraded',
                });
            });
            it('replays last event', async () => {
                const setup = new status_service_1.StatusService(core_context_mock_1.mockCoreContext.create()).setup({
                    elasticsearch: {
                        status$: rxjs_1.of(degraded),
                    },
                    savedObjects: {
                        status$: rxjs_1.of(degraded),
                    },
                });
                const subResult1 = await setup.overall$.pipe(operators_1.first()).toPromise();
                const subResult2 = await setup.overall$.pipe(operators_1.first()).toPromise();
                const subResult3 = await setup.overall$.pipe(operators_1.first()).toPromise();
                expect(subResult1).toMatchObject({
                    level: types_1.ServiceStatusLevels.degraded,
                    summary: '[2] services are degraded',
                });
                expect(subResult2).toMatchObject({
                    level: types_1.ServiceStatusLevels.degraded,
                    summary: '[2] services are degraded',
                });
                expect(subResult3).toMatchObject({
                    level: types_1.ServiceStatusLevels.degraded,
                    summary: '[2] services are degraded',
                });
            });
            it('does not emit duplicate events', () => {
                const elasticsearch$ = new rxjs_1.BehaviorSubject(available);
                const savedObjects$ = new rxjs_1.BehaviorSubject(degraded);
                const setup = new status_service_1.StatusService(core_context_mock_1.mockCoreContext.create()).setup({
                    elasticsearch: {
                        status$: elasticsearch$,
                    },
                    savedObjects: {
                        status$: savedObjects$,
                    },
                });
                const statusUpdates = [];
                const subscription = setup.overall$.subscribe(status => statusUpdates.push(status));
                elasticsearch$.next(available);
                elasticsearch$.next(available);
                elasticsearch$.next({
                    level: types_1.ServiceStatusLevels.available,
                    summary: `Wow another summary`,
                });
                savedObjects$.next(degraded);
                savedObjects$.next(available);
                savedObjects$.next(available);
                subscription.unsubscribe();
                expect(statusUpdates).toMatchInlineSnapshot(`
          Array [
            Object {
              "level": degraded,
              "summary": "[savedObjects]: This is degraded!",
            },
            Object {
              "level": available,
              "summary": "All services are available",
            },
          ]
        `);
            });
        });
    });
});
