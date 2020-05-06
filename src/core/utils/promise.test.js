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
const promise_1 = require("./promise");
const delay = (ms, resolveValue) => new Promise(resolve => setTimeout(resolve, ms, resolveValue));
describe('withTimeout', () => {
    it('resolves with a promise value if resolved in given timeout', async () => {
        await expect(promise_1.withTimeout({
            promise: delay(10, 'value'),
            timeout: 200,
            errorMessage: 'error-message',
        })).resolves.toBe('value');
    });
    it('rejects with errorMessage if not resolved in given time', async () => {
        await expect(promise_1.withTimeout({
            promise: delay(200, 'value'),
            timeout: 10,
            errorMessage: 'error-message',
        })).rejects.toMatchInlineSnapshot(`[Error: error-message]`);
        await expect(promise_1.withTimeout({
            promise: new Promise(i => i),
            timeout: 10,
            errorMessage: 'error-message',
        })).rejects.toMatchInlineSnapshot(`[Error: error-message]`);
    });
    it('does not swallow promise error', async () => {
        await expect(promise_1.withTimeout({
            promise: Promise.reject(new Error('from-promise')),
            timeout: 10,
            errorMessage: 'error-message',
        })).rejects.toMatchInlineSnapshot(`[Error: from-promise]`);
    });
});
