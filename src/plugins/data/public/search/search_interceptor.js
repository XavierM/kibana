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
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../common/utils");
const request_timeout_error_1 = require("./request_timeout_error");
const long_query_notification_1 = require("./long_query_notification");
class SearchInterceptor {
    /**
     * This class should be instantiated with a `requestTimeout` corresponding with how many ms after
     * requests are initiated that they should automatically cancel.
     * @param toasts The `core.notifications.toasts` service
     * @param application  The `core.application` service
     * @param requestTimeout Usually config value `elasticsearch.requestTimeout`
     */
    constructor(toasts, application, requestTimeout) {
        this.toasts = toasts;
        this.application = application;
        this.requestTimeout = requestTimeout;
        /**
         * `abortController` used to signal all searches to abort.
         */
        this.abortController = new AbortController();
        /**
         * The number of pending search requests.
         */
        this.pendingCount = 0;
        /**
         * Observable that emits when the number of pending requests changes.
         */
        this.pendingCount$ = new rxjs_1.BehaviorSubject(this.pendingCount);
        /**
         * The subscriptions from scheduling the automatic timeout for each request.
         */
        this.timeoutSubscriptions = new Set();
        /**
         * Returns an `Observable` over the current number of pending searches. This could mean that one
         * of the search requests is still in flight, or that it has only received partial responses.
         */
        this.getPendingCount$ = () => {
            return this.pendingCount$.asObservable();
        };
        /**
         * Searches using the given `search` method. Overrides the `AbortSignal` with one that will abort
         * either when `cancelPending` is called, when the request times out, or when the original
         * `AbortSignal` is aborted. Updates the `pendingCount` when the request is started/finalized.
         */
        this.search = (search, request, options) => {
            // Defer the following logic until `subscribe` is actually called
            return rxjs_1.defer(() => {
                this.pendingCount$.next(++this.pendingCount);
                // Schedule this request to automatically timeout after some interval
                const timeoutController = new AbortController();
                const { signal: timeoutSignal } = timeoutController;
                const timeout$ = rxjs_1.timer(this.requestTimeout);
                const subscription = timeout$.subscribe(() => timeoutController.abort());
                this.timeoutSubscriptions.add(subscription);
                // If the request timed out, throw a `RequestTimeoutError`
                const timeoutError$ = rxjs_1.fromEvent(timeoutSignal, 'abort').pipe(operators_1.mergeMapTo(rxjs_1.throwError(new request_timeout_error_1.RequestTimeoutError())));
                // Schedule the notification to allow users to cancel or wait beyond the timeout
                const notificationSubscription = rxjs_1.timer(10000).subscribe(this.showToast);
                // Get a combined `AbortSignal` that will be aborted whenever the first of the following occurs:
                // 1. The user manually aborts (via `cancelPending`)
                // 2. The request times out
                // 3. The passed-in signal aborts (e.g. when re-fetching, or whenever the app determines)
                const signals = [
                    this.abortController.signal,
                    timeoutSignal,
                    ...(options?.signal ? [options.signal] : []),
                ];
                const combinedSignal = utils_1.getCombinedSignal(signals);
                return search(request, { ...options, signal: combinedSignal }).pipe(operators_1.takeUntil(timeoutError$), operators_1.finalize(() => {
                    this.pendingCount$.next(--this.pendingCount);
                    this.timeoutSubscriptions.delete(subscription);
                    notificationSubscription.unsubscribe();
                }));
            });
        };
        this.showToast = () => {
            if (this.longRunningToast)
                return;
            this.longRunningToast = this.toasts.addInfo({
                title: 'Your query is taking awhile',
                text: long_query_notification_1.getLongQueryNotification({
                    application: this.application,
                }),
            }, {
                toastLifeTimeMs: 1000000,
            });
        };
        this.hideToast = () => {
            if (this.longRunningToast) {
                this.toasts.remove(this.longRunningToast);
                delete this.longRunningToast;
            }
        };
        // When search requests go out, a notification is scheduled allowing users to continue the
        // request past the timeout. When all search requests complete, we remove the notification.
        this.getPendingCount$()
            .pipe(operators_1.filter(count => count === 0))
            .subscribe(this.hideToast);
    }
}
exports.SearchInterceptor = SearchInterceptor;
