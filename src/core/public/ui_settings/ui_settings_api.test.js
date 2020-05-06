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
// @ts-ignore
const client_1 = tslib_1.__importDefault(require("fetch-mock/es5/client"));
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const http_test_setup_1 = require("../../../test_utils/public/http_test_setup");
const ui_settings_api_1 = require("./ui_settings_api");
function setup() {
    const { http } = http_test_setup_1.setup(injectedMetadata => {
        injectedMetadata.getBasePath.mockReturnValue('/foo/bar');
    });
    const uiSettingsApi = new ui_settings_api_1.UiSettingsApi(http);
    return {
        http,
        uiSettingsApi,
    };
}
async function settlePromise(promise) {
    try {
        return {
            isResolved: true,
            result: await promise,
        };
    }
    catch (error) {
        return {
            isRejected: true,
            error,
        };
    }
}
afterEach(() => {
    client_1.default.restore();
});
describe('#batchSet', () => {
    it('sends a single change immediately', async () => {
        client_1.default.mock('*', {
            body: { settings: {} },
        });
        const { uiSettingsApi } = setup();
        await uiSettingsApi.batchSet('foo', 'bar');
        expect(client_1.default.calls()).toMatchSnapshot('single change');
    });
    it('buffers changes while first request is in progress, sends buffered changes after first request completes', async () => {
        client_1.default.mock('*', {
            body: { settings: {} },
        });
        const { uiSettingsApi } = setup();
        uiSettingsApi.batchSet('foo', 'bar');
        const finalPromise = uiSettingsApi.batchSet('box', 'bar');
        expect(uiSettingsApi.hasPendingChanges()).toBe(true);
        await finalPromise;
        expect(client_1.default.calls()).toMatchSnapshot('final, includes both requests');
    });
    it('Overwrites previously buffered values with new values for the same key', async () => {
        client_1.default.mock('*', {
            body: { settings: {} },
        });
        const { uiSettingsApi } = setup();
        uiSettingsApi.batchSet('foo', 'a');
        uiSettingsApi.batchSet('foo', 'b');
        uiSettingsApi.batchSet('foo', 'c');
        await uiSettingsApi.batchSet('foo', 'd');
        expect(client_1.default.calls()).toMatchSnapshot('two requests, foo=d in final');
    });
    it('Buffers are always clear of previously buffered changes', async () => {
        client_1.default.mock('*', {
            body: { settings: {} },
        });
        const { uiSettingsApi } = setup();
        uiSettingsApi.batchSet('foo', 'bar');
        uiSettingsApi.batchSet('bar', 'foo');
        await uiSettingsApi.batchSet('bar', 'box');
        expect(client_1.default.calls()).toMatchSnapshot('two requests, second only sends bar, not foo');
    });
    it('rejects on 404 response', async () => {
        client_1.default.mock('*', {
            status: 404,
            body: 'not found',
        });
        const { uiSettingsApi } = setup();
        await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowErrorMatchingSnapshot();
    });
    it('rejects on 301', async () => {
        client_1.default.mock('*', {
            status: 301,
            body: 'redirect',
        });
        const { uiSettingsApi } = setup();
        await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowErrorMatchingSnapshot();
    });
    it('rejects on 500', async () => {
        client_1.default.mock('*', {
            status: 500,
            body: 'redirect',
        });
        const { uiSettingsApi } = setup();
        await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowErrorMatchingSnapshot();
    });
    it('rejects all promises for batched requests that fail', async () => {
        client_1.default.once('*', {
            body: { settings: {} },
        });
        client_1.default.once('*', {
            status: 400,
            body: { message: 'invalid' },
        }, {
            overwriteRoutes: false,
        });
        const { uiSettingsApi } = setup();
        // trigger the initial sync request, which enabled buffering
        uiSettingsApi.batchSet('foo', 'bar');
        // buffer some requests so they will be sent together
        await expect(Promise.all([
            settlePromise(uiSettingsApi.batchSet('foo', 'a')),
            settlePromise(uiSettingsApi.batchSet('bar', 'b')),
            settlePromise(uiSettingsApi.batchSet('baz', 'c')),
        ])).resolves.toMatchSnapshot('promise rejections');
        // ensure only two requests were sent
        expect(client_1.default.calls()).toHaveLength(2);
    });
});
describe('#getLoadingCount$()', () => {
    it('emits the current number of active requests', async () => {
        client_1.default.once('*', {
            body: { settings: {} },
        });
        const { uiSettingsApi } = setup();
        const done$ = new Rx.Subject();
        const promise = uiSettingsApi
            .getLoadingCount$()
            .pipe(operators_1.takeUntil(done$), operators_1.toArray())
            .toPromise();
        await uiSettingsApi.batchSet('foo', 'bar');
        done$.next();
        await expect(promise).resolves.toEqual([0, 1, 0]);
    });
    it('decrements loading count when requests fail', async () => {
        client_1.default.once('*', {
            body: { settings: {} },
        });
        client_1.default.once('*', {
            status: 400,
            body: 'invalid',
        }, {
            overwriteRoutes: false,
        });
        const { uiSettingsApi } = setup();
        const done$ = new Rx.Subject();
        const promise = uiSettingsApi
            .getLoadingCount$()
            .pipe(operators_1.takeUntil(done$), operators_1.toArray())
            .toPromise();
        await uiSettingsApi.batchSet('foo', 'bar');
        await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowError();
        done$.next();
        await expect(promise).resolves.toEqual([0, 1, 0, 1, 0]);
    });
});
describe('#stop', () => {
    it('completes any loading count observables', async () => {
        client_1.default.once('*', {
            body: { settings: {} },
        });
        const { uiSettingsApi } = setup();
        const promise = Promise.all([
            uiSettingsApi
                .getLoadingCount$()
                .pipe(operators_1.toArray())
                .toPromise(),
            uiSettingsApi
                .getLoadingCount$()
                .pipe(operators_1.toArray())
                .toPromise(),
        ]);
        const batchSetPromise = uiSettingsApi.batchSet('foo', 'bar');
        uiSettingsApi.stop();
        // both observables should emit the same values, and complete before the request is done loading
        await expect(promise).resolves.toEqual([
            [0, 1],
            [0, 1],
        ]);
        await batchSetPromise;
    });
});
