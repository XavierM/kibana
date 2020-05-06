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
const immer_1 = require("immer");
const function_1 = require("fp-ts/lib/function");
const initialResultValue = {
    data: null,
    type: 'unknown',
};
exports.initialValue = immer_1.produce({
    requestInFlight: false,
    lastResult: initialResultValue,
}, function_1.identity);
exports.reducer = (state, action) => immer_1.produce(state, draft => {
    if (action.type === 'sendRequest') {
        draft.requestInFlight = true;
        draft.lastResult = initialResultValue;
        return;
    }
    if (action.type === 'requestSuccess') {
        draft.requestInFlight = false;
        draft.lastResult = action.payload;
        return;
    }
    if (action.type === 'requestFail') {
        draft.requestInFlight = false;
        draft.lastResult = { ...initialResultValue, error: action.payload };
        return;
    }
});
