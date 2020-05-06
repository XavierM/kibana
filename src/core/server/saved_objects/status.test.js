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
const status_1 = require("../status");
const status_2 = require("./status");
const operators_1 = require("rxjs/operators");
describe('calculateStatus$', () => {
    const expectUnavailableDueToEs = (status$) => expect(status$.pipe(operators_1.take(1)).toPromise()).resolves.toEqual({
        level: status_1.ServiceStatusLevels.unavailable,
        summary: `SavedObjects service is not available without a healthy Elasticearch connection`,
    });
    const expectUnavailableDueToMigrations = (status$) => expect(status$.pipe(operators_1.take(1)).toPromise()).resolves.toEqual({
        level: status_1.ServiceStatusLevels.unavailable,
        summary: `SavedObjects service is waiting to start migrations`,
    });
    describe('when elasticsearch is unavailable', () => {
        const esStatus$ = rxjs_1.of({
            level: status_1.ServiceStatusLevels.unavailable,
            summary: 'xxx',
        });
        it('is unavailable before migrations have ran', async () => {
            await expectUnavailableDueToEs(status_2.calculateStatus$(rxjs_1.of(), esStatus$));
        });
        it('is unavailable after migrations have ran', async () => {
            await expectUnavailableDueToEs(status_2.calculateStatus$(rxjs_1.of({ status: 'completed', result: [] }), esStatus$));
        });
    });
    describe('when elasticsearch is critical', () => {
        const esStatus$ = rxjs_1.of({
            level: status_1.ServiceStatusLevels.critical,
            summary: 'xxx',
        });
        it('is unavailable before migrations have ran', async () => {
            await expectUnavailableDueToEs(status_2.calculateStatus$(rxjs_1.of(), esStatus$));
        });
        it('is unavailable after migrations have ran', async () => {
            await expectUnavailableDueToEs(status_2.calculateStatus$(rxjs_1.of({ status: 'completed', result: [{ status: 'migrated' }] }), esStatus$));
        });
    });
    describe('when elasticsearch is available', () => {
        const esStatus$ = rxjs_1.of({
            level: status_1.ServiceStatusLevels.available,
            summary: 'Available',
        });
        it('is unavailable before migrations have ran', async () => {
            await expectUnavailableDueToMigrations(status_2.calculateStatus$(rxjs_1.of(), esStatus$));
        });
        it('is unavailable while migrations are running', async () => {
            await expect(status_2.calculateStatus$(rxjs_1.of({ status: 'running' }), esStatus$)
                .pipe(operators_1.take(2))
                .toPromise()).resolves.toEqual({
                level: status_1.ServiceStatusLevels.unavailable,
                summary: `SavedObjects service is running migrations`,
            });
        });
        it('is available after migrations have ran', async () => {
            await expect(status_2.calculateStatus$(rxjs_1.of({ status: 'completed', result: [{ status: 'skipped' }, { status: 'patched' }] }), esStatus$)
                .pipe(operators_1.take(2))
                .toPromise()).resolves.toEqual({
                level: status_1.ServiceStatusLevels.available,
                summary: `SavedObjects service has completed migrations and is available`,
                meta: {
                    migratedIndices: {
                        migrated: 0,
                        patched: 1,
                        skipped: 1,
                    },
                },
            });
        });
    });
    describe('when elasticsearch is degraded', () => {
        const esStatus$ = rxjs_1.of({ level: status_1.ServiceStatusLevels.degraded, summary: 'xxx' });
        it('is unavailable before migrations have ran', async () => {
            await expectUnavailableDueToMigrations(status_2.calculateStatus$(rxjs_1.of(), esStatus$));
        });
        it('is degraded after migrations have ran', async () => {
            await expect(status_2.calculateStatus$(rxjs_1.of([{ status: 'skipped' }]), esStatus$)
                .pipe(operators_1.take(2))
                .toPromise()).resolves.toEqual({
                level: status_1.ServiceStatusLevels.degraded,
                summary: 'SavedObjects service is degraded due to Elasticsearch: [xxx]',
            });
        });
    });
});
