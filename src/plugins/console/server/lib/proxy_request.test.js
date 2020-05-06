"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const http_1 = tslib_1.__importDefault(require("http"));
const sinon = tslib_1.__importStar(require("sinon"));
const proxy_request_1 = require("./proxy_request");
const url_1 = require("url");
const assert_1 = require("assert");
describe(`Console's send request`, () => {
    let sandbox;
    let stub;
    let fakeRequest;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        stub = sandbox.stub(http_1.default, 'request').callsFake(() => {
            return fakeRequest;
        });
    });
    afterEach(() => {
        stub.restore();
        fakeRequest = null;
    });
    it('correctly implements timeout and abort mechanism', async () => {
        fakeRequest = {
            abort: sinon.stub(),
            on() { },
            once() { },
        };
        try {
            await proxy_request_1.proxyRequest({
                agent: null,
                headers: {},
                method: 'get',
                payload: null,
                timeout: 0,
                uri: new url_1.URL('http://noone.nowhere.none'),
            });
            assert_1.fail('Should not reach here!');
        }
        catch (e) {
            expect(e.message).toEqual('Client request timeout');
            expect(fakeRequest.abort.calledOnce).toBe(true);
        }
    });
    it('correctly sets the "host" header entry', async () => {
        fakeRequest = {
            abort: sinon.stub(),
            on() { },
            once(event, fn) {
                if (event === 'response') {
                    return fn('done');
                }
            },
        };
        // Don't set a host header this time
        const result1 = await proxy_request_1.proxyRequest({
            agent: null,
            headers: {},
            method: 'get',
            payload: null,
            timeout: 30000,
            uri: new url_1.URL('http://noone.nowhere.none'),
        });
        expect(result1).toEqual('done');
        const [httpRequestOptions1] = stub.firstCall.args;
        expect(httpRequestOptions1.headers).toEqual({
            'content-type': 'application/json',
            host: 'noone.nowhere.none',
            'transfer-encoding': 'chunked',
        });
        // Set a host header
        const result2 = await proxy_request_1.proxyRequest({
            agent: null,
            headers: { Host: 'myhost' },
            method: 'get',
            payload: null,
            timeout: 30000,
            uri: new url_1.URL('http://noone.nowhere.none'),
        });
        expect(result2).toEqual('done');
        const [httpRequestOptions2] = stub.secondCall.args;
        expect(httpRequestOptions2.headers).toEqual({
            'content-type': 'application/json',
            Host: 'myhost',
            'transfer-encoding': 'chunked',
        });
    });
});
