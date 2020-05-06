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
exports.SYNC_SEARCH_STRATEGY = 'SYNC_SEARCH_STRATEGY';
exports.syncSearchStrategyProvider = (context) => {
    const loadingCount$ = new rxjs_1.BehaviorSubject(0);
    context.core.http.addLoadingCountSource(loadingCount$);
    const search = (request, options = {}) => {
        loadingCount$.next(loadingCount$.getValue() + 1);
        return rxjs_1.from(context.core.http.fetch({
            path: `/internal/search/${request.serverStrategy}`,
            method: 'POST',
            body: JSON.stringify(request),
            signal: options.signal,
        })).pipe(operators_1.finalize(() => loadingCount$.next(loadingCount$.getValue() - 1)));
    };
    return { search };
};
