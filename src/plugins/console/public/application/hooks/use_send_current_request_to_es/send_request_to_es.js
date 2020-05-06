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
const tslib_1 = require("tslib");
const utils_1 = require("../../../lib/utils");
const public_1 = require("../../../../../es_ui_shared/public");
// @ts-ignore
const es = tslib_1.__importStar(require("../../../lib/es/es"));
let CURRENT_REQ_ID = 0;
function sendRequestToES(args) {
    const requests = args.requests.slice();
    return new Promise((resolve, reject) => {
        const reqId = ++CURRENT_REQ_ID;
        const results = [];
        if (reqId !== CURRENT_REQ_ID) {
            return;
        }
        if (requests.length === 0) {
            return;
        }
        const isMultiRequest = requests.length > 1;
        const sendNextRequest = () => {
            if (reqId !== CURRENT_REQ_ID) {
                resolve(results);
                return;
            }
            if (requests.length === 0) {
                resolve(results);
                return;
            }
            const req = requests.shift();
            const esPath = req.url;
            const esMethod = req.method;
            let esData = public_1.collapseLiteralStrings(req.data.join('\n'));
            if (esData) {
                esData += '\n';
            } // append a new line for bulk requests.
            const startTime = Date.now();
            es.send(esMethod, esPath, esData).always((dataOrjqXHR, textStatus, jqXhrORerrorThrown) => {
                if (reqId !== CURRENT_REQ_ID) {
                    return;
                }
                const xhr = dataOrjqXHR.promise ? dataOrjqXHR : jqXhrORerrorThrown;
                const isSuccess = typeof xhr.status === 'number' &&
                    // Things like DELETE index where the index is not there are OK.
                    ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 404);
                if (isSuccess) {
                    let value = xhr.responseText;
                    const warnings = xhr.getResponseHeader('warning');
                    if (warnings) {
                        const deprecationMessages = utils_1.extractDeprecationMessages(warnings);
                        value = deprecationMessages.join('\n') + '\n' + value;
                    }
                    if (isMultiRequest) {
                        value = '# ' + req.method + ' ' + req.url + '\n' + value;
                    }
                    results.push({
                        response: {
                            timeMs: Date.now() - startTime,
                            statusCode: xhr.status,
                            statusText: xhr.statusText,
                            contentType: xhr.getResponseHeader('Content-Type'),
                            value,
                        },
                        request: {
                            data: esData,
                            method: esMethod,
                            path: esPath,
                        },
                    });
                    // single request terminate via sendNextRequest as well
                    sendNextRequest();
                }
                else {
                    let value;
                    let contentType;
                    if (xhr.responseText) {
                        value = xhr.responseText; // ES error should be shown
                        contentType = xhr.getResponseHeader('Content-Type');
                    }
                    else {
                        value = 'Request failed to get to the server (status code: ' + xhr.status + ')';
                        contentType = 'text/plain';
                    }
                    if (isMultiRequest) {
                        value = '# ' + req.method + ' ' + req.url + '\n' + value;
                    }
                    reject({
                        response: {
                            value,
                            contentType,
                            timeMs: Date.now() - startTime,
                            statusCode: xhr.status,
                            statusText: xhr.statusText,
                        },
                        request: {
                            data: esData,
                            method: esMethod,
                            path: esPath,
                        },
                    });
                }
            });
        };
        sendNextRequest();
    });
}
exports.sendRequestToES = sendRequestToES;
