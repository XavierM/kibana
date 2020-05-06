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
const lodash_1 = require("lodash");
// @ts-ignore not really worth typing
const kfetch_error_1 = require("./kfetch_error");
const interceptors = [];
exports.resetInterceptors = () => (interceptors.length = 0);
exports.addInterceptor = (interceptor) => interceptors.push(interceptor);
function createKfetch(http) {
    return function kfetch(options, { prependBasePath = true } = {}) {
        return responseInterceptors(requestInterceptors(withDefaultOptions(options))
            .then(({ pathname, ...restOptions }) => http.fetch(pathname, { ...restOptions, prependBasePath }))
            .catch(err => {
            throw new kfetch_error_1.KFetchError(err.response || { statusText: err.message }, err.body);
        }));
    };
}
exports.createKfetch = createKfetch;
// Request/response interceptors are called in opposite orders.
// Request hooks start from the newest interceptor and end with the oldest.
function requestInterceptors(config) {
    return interceptors.reduceRight((acc, interceptor) => {
        return acc.then(interceptor.request, interceptor.requestError);
    }, Promise.resolve(config));
}
// Response hooks start from the oldest interceptor and end with the newest.
function responseInterceptors(responsePromise) {
    return interceptors.reduce((acc, interceptor) => {
        return acc.then(interceptor.response, interceptor.responseError);
    }, responsePromise);
}
function withDefaultOptions(options) {
    const withDefaults = lodash_1.merge({
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    }, options);
    if (options &&
        options.headers &&
        'Content-Type' in options.headers &&
        options.headers['Content-Type'] === undefined) {
        // TS thinks headers could be undefined here, but that isn't possible because
        // of the merge above.
        // @ts-ignore
        withDefaults.headers['Content-Type'] = undefined;
    }
    return withDefaults;
}
exports.withDefaultOptions = withDefaultOptions;
