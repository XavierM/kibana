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
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const query_string_1 = require("query-string");
const esVersion = [];
function getVersion() {
    return esVersion;
}
exports.getVersion = getVersion;
function getContentType(body) {
    if (!body)
        return;
    return 'application/json';
}
exports.getContentType = getContentType;
function send(method, path, data) {
    const wrappedDfd = jquery_1.default.Deferred(); // eslint-disable-line new-cap
    const options = {
        url: '../api/console/proxy?' + query_string_1.stringify({ path, method }, { sort: false }),
        data,
        contentType: getContentType(data),
        cache: false,
        crossDomain: true,
        type: 'POST',
        dataType: 'text',
    };
    jquery_1.default.ajax(options).then((responseData, textStatus, jqXHR) => {
        wrappedDfd.resolveWith({}, [responseData, textStatus, jqXHR]);
    }, ((jqXHR, textStatus, errorThrown) => {
        if (jqXHR.status === 0) {
            jqXHR.responseText =
                "\n\nFailed to connect to Console's backend.\nPlease check the Kibana server is up and running";
        }
        wrappedDfd.rejectWith({}, [jqXHR, textStatus, errorThrown]);
    }));
    return wrappedDfd;
}
exports.send = send;
function constructESUrl(baseUri, path) {
    baseUri = baseUri.replace(/\/+$/, '');
    path = path.replace(/^\/+/, '');
    return baseUri + '/' + path;
}
exports.constructESUrl = constructESUrl;
