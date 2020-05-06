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
const fetch_soon_1 = require("./fetch_soon");
const call_client_1 = require("./call_client");
function getConfigStub(config = {}) {
    return {
        get: key => config[key],
    };
}
const mockResponses = {
    foo: {},
    bar: {},
    baz: {},
};
jest.useFakeTimers();
jest.mock('./call_client', () => ({
    callClient: jest.fn((requests) => {
        // Allow a request object to specify which mockResponse it wants to receive (_mockResponseId)
        // in addition to how long to simulate waiting before returning a response (_waitMs)
        const responses = requests.map(request => {
            const waitMs = requests.reduce((total, { _waitMs }) => total + _waitMs || 0, 0);
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(mockResponses[request._mockResponseId]);
                }, waitMs);
            });
        });
        return Promise.resolve(responses);
    }),
}));
describe('fetchSoon', () => {
    beforeEach(() => {
        call_client_1.callClient.mockClear();
    });
    test('should delay by 0ms if config is set to not batch searches', () => {
        const config = getConfigStub({
            'courier:batchSearches': false,
        });
        const request = {};
        const options = {};
        fetch_soon_1.fetchSoon(request, options, { config });
        expect(call_client_1.callClient).not.toBeCalled();
        jest.advanceTimersByTime(0);
        expect(call_client_1.callClient).toBeCalled();
    });
    test('should delay by 50ms if config is set to batch searches', () => {
        const config = getConfigStub({
            'courier:batchSearches': true,
        });
        const request = {};
        const options = {};
        fetch_soon_1.fetchSoon(request, options, { config });
        expect(call_client_1.callClient).not.toBeCalled();
        jest.advanceTimersByTime(0);
        expect(call_client_1.callClient).not.toBeCalled();
        jest.advanceTimersByTime(50);
        expect(call_client_1.callClient).toBeCalled();
    });
    test('should send a batch of requests to callClient', () => {
        const config = getConfigStub({
            'courier:batchSearches': true,
        });
        const requests = [{ foo: 1 }, { foo: 2 }];
        const options = [{ bar: 1 }, { bar: 2 }];
        requests.forEach((request, i) => {
            fetch_soon_1.fetchSoon(request, options[i], { config });
        });
        jest.advanceTimersByTime(50);
        expect(call_client_1.callClient).toBeCalledTimes(1);
        expect(call_client_1.callClient.mock.calls[0][0]).toEqual(requests);
        expect(call_client_1.callClient.mock.calls[0][1]).toEqual(options);
    });
    test('should return the response to the corresponding call for multiple batched requests', async () => {
        const config = getConfigStub({
            'courier:batchSearches': true,
        });
        const requests = [{ _mockResponseId: 'foo' }, { _mockResponseId: 'bar' }];
        const promises = requests.map(request => {
            return fetch_soon_1.fetchSoon(request, {}, { config });
        });
        jest.advanceTimersByTime(50);
        const results = await Promise.all(promises);
        expect(results).toEqual([mockResponses.foo, mockResponses.bar]);
    });
    test('should wait for the previous batch to start before starting a new batch', () => {
        const config = getConfigStub({
            'courier:batchSearches': true,
        });
        const firstBatch = [{ foo: 1 }, { foo: 2 }];
        const secondBatch = [{ bar: 1 }, { bar: 2 }];
        firstBatch.forEach(request => {
            fetch_soon_1.fetchSoon(request, {}, { config });
        });
        jest.advanceTimersByTime(50);
        secondBatch.forEach(request => {
            fetch_soon_1.fetchSoon(request, {}, { config });
        });
        expect(call_client_1.callClient).toBeCalledTimes(1);
        expect(call_client_1.callClient.mock.calls[0][0]).toEqual(firstBatch);
        jest.advanceTimersByTime(50);
        expect(call_client_1.callClient).toBeCalledTimes(2);
        expect(call_client_1.callClient.mock.calls[1][0]).toEqual(secondBatch);
    });
});
