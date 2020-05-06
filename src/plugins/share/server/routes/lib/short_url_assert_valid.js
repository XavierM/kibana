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
const url_1 = require("url");
const lodash_1 = require("lodash");
const boom_1 = tslib_1.__importDefault(require("boom"));
function shortUrlAssertValid(url) {
    const { protocol, hostname, pathname } = url_1.parse(url);
    if (protocol) {
        throw boom_1.default.notAcceptable(`Short url targets cannot have a protocol, found "${protocol}"`);
    }
    if (hostname) {
        throw boom_1.default.notAcceptable(`Short url targets cannot have a hostname, found "${hostname}"`);
    }
    const pathnameParts = lodash_1.trim(pathname, '/').split('/');
    if (pathnameParts.length !== 2) {
        throw boom_1.default.notAcceptable(`Short url target path must be in the format "/app/{{appId}}", found "${pathname}"`);
    }
}
exports.shortUrlAssertValid = shortUrlAssertValid;
