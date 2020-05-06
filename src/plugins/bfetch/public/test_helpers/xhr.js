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
/* eslint-disable max-classes-per-file */
exports.mockXMLHttpRequest = () => {
    class MockXMLHttpRequest {
        constructor() {
            this.DONE = 0;
            this.HEADERS_RECEIVED = 0;
            this.LOADING = 0;
            this.OPENED = 0;
            this.UNSENT = 0;
            this.abort = jest.fn();
            this.addEventListener = jest.fn();
            this.dispatchEvent = jest.fn();
            this.getAllResponseHeaders = jest.fn();
            this.getResponseHeader = jest.fn();
            this.onabort = jest.fn();
            this.onerror = jest.fn();
            this.onload = jest.fn();
            this.onloadend = jest.fn();
            this.onloadstart = jest.fn();
            this.onprogress = jest.fn();
            this.onreadystatechange = jest.fn();
            this.ontimeout = jest.fn();
            this.open = jest.fn();
            this.overrideMimeType = jest.fn();
            this.readyState = 0;
            this.removeEventListener = jest.fn();
            this.response = null;
            this.responseText = '';
            this.responseType = null;
            this.responseURL = '';
            this.responseXML = null;
            this.send = jest.fn();
            this.setRequestHeader = jest.fn();
            this.status = 0;
            this.statusText = '';
            this.timeout = 0;
            this.upload = null;
            this.withCredentials = false;
        }
    }
    const xhr = new MockXMLHttpRequest();
    return {
        xhr,
        XMLHttpRequest: class {
            constructor() {
                return xhr;
            }
        },
    };
};
