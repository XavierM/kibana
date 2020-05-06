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
const mocks_1 = require("../../../../core/public/mocks");
const request_timeout_error_1 = require("./request_timeout_error");
const search_interceptor_1 = require("./search_interceptor");
jest.useFakeTimers();
const mockSearch = jest.fn();
let searchInterceptor;
let mockCoreStart;
describe('SearchInterceptor', () => {
    beforeEach(() => {
        mockCoreStart = mocks_1.coreMock.createStart();
        mockSearch.mockClear();
        searchInterceptor = new search_interceptor_1.SearchInterceptor(mockCoreStart.notifications.toasts, mockCoreStart.application, 1000);
    });
    describe('search', () => {
        test('should invoke `search` with the request', () => {
            const mockResponse = new rxjs_1.Subject();
            mockSearch.mockReturnValue(mockResponse.asObservable());
            const mockRequest = {};
            const response = searchInterceptor.search(mockSearch, mockRequest);
            mockResponse.complete();
            response.subscribe();
            expect(mockSearch.mock.calls[0][0]).toBe(mockRequest);
        });
        test('should mirror the observable to completion if the request does not time out', () => {
            const mockResponse = new rxjs_1.Subject();
            mockSearch.mockReturnValue(mockResponse.asObservable());
            const response = searchInterceptor.search(mockSearch, {});
            setTimeout(() => mockResponse.next('hi'), 250);
            setTimeout(() => mockResponse.complete(), 500);
            const next = jest.fn();
            const complete = jest.fn();
            response.subscribe({ next, complete });
            jest.advanceTimersByTime(1000);
            expect(next).toHaveBeenCalledWith('hi');
            expect(complete).toHaveBeenCalled();
        });
        test('should mirror the observable to error if the request does not time out', () => {
            const mockResponse = new rxjs_1.Subject();
            mockSearch.mockReturnValue(mockResponse.asObservable());
            const response = searchInterceptor.search(mockSearch, {});
            setTimeout(() => mockResponse.next('hi'), 250);
            setTimeout(() => mockResponse.error('error'), 500);
            const next = jest.fn();
            const error = jest.fn();
            response.subscribe({ next, error });
            jest.advanceTimersByTime(1000);
            expect(next).toHaveBeenCalledWith('hi');
            expect(error).toHaveBeenCalledWith('error');
        });
        test('should return a `RequestTimeoutError` if the request times out', () => {
            mockSearch.mockReturnValue(new rxjs_1.Observable());
            const response = searchInterceptor.search(mockSearch, {});
            const error = jest.fn();
            response.subscribe({ error });
            jest.advanceTimersByTime(1000);
            expect(error).toHaveBeenCalled();
            expect(error.mock.calls[0][0] instanceof request_timeout_error_1.RequestTimeoutError).toBe(true);
        });
    });
    describe('getPendingCount$', () => {
        test('should observe the number of pending requests', () => {
            let i = 0;
            const mockResponses = [new rxjs_1.Subject(), new rxjs_1.Subject()];
            mockSearch.mockImplementation(() => mockResponses[i++]);
            const pendingCount$ = searchInterceptor.getPendingCount$();
            const next = jest.fn();
            pendingCount$.subscribe(next);
            const error = jest.fn();
            searchInterceptor.search(mockSearch, {}).subscribe({ error });
            searchInterceptor.search(mockSearch, {}).subscribe({ error });
            setTimeout(() => mockResponses[0].complete(), 250);
            setTimeout(() => mockResponses[1].error('error'), 500);
            jest.advanceTimersByTime(500);
            expect(next).toHaveBeenCalled();
            expect(next.mock.calls).toEqual([[0], [1], [2], [1], [0]]);
        });
    });
});
