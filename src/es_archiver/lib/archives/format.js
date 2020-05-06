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
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const json_stable_stringify_1 = tslib_1.__importDefault(require("json-stable-stringify"));
const utils_1 = require("../../../legacy/utils");
const constants_1 = require("./constants");
function createFormatArchiveStreams({ gzip = false } = {}) {
    return [
        utils_1.createMapStream(record => json_stable_stringify_1.default(record, { space: '  ' })),
        utils_1.createIntersperseStream(constants_1.RECORD_SEPARATOR),
        gzip ? zlib_1.createGzip({ level: zlib_1.Z_BEST_COMPRESSION }) : new stream_1.PassThrough(),
    ];
}
exports.createFormatArchiveStreams = createFormatArchiveStreams;
