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
const injected_vars_test_mocks_1 = require("./injected_vars.test.mocks");
const injected_vars_1 = require("./injected_vars");
function initChrome() {
    const chrome = {};
    injected_vars_1.initChromeInjectedVarsApi(chrome);
    return chrome;
}
beforeEach(() => {
    jest.resetAllMocks();
});
describe('#getInjected()', () => {
    it('proxies to newPlatformInjectedMetadata service', () => {
        const chrome = initChrome();
        chrome.getInjected();
        chrome.getInjected('foo');
        chrome.getInjected('foo', 'bar');
        expect(injected_vars_test_mocks_1.newPlatformInjectedMetadata.getInjectedVars.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [],
]
`);
        expect(injected_vars_test_mocks_1.newPlatformInjectedMetadata.getInjectedVar.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "foo",
    undefined,
  ],
  Array [
    "foo",
    "bar",
  ],
]
`);
    });
    it('returns mutable values, but does not persist changes internally', () => {
        const chrome = initChrome();
        injected_vars_test_mocks_1.newPlatformInjectedMetadata.getInjectedVars.mockReturnValue(Object.freeze({
            foo: Object.freeze({
                bar: Object.freeze({
                    baz: 1,
                }),
            }),
        }));
        const vars = chrome.getInjected();
        expect(() => {
            vars.newProperty = true;
        }).not.toThrowError();
        expect(chrome.getInjected()).not.toHaveProperty('newProperty');
    });
});
