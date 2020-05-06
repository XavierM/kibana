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
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const filter_stream_1 = require("../../../legacy/utils/streams/filter_stream");
const utils_1 = require("../../../legacy/utils");
const constants_1 = require("./constants");
function createParseArchiveStreams({ gzip = false } = {}) {
    return [
        gzip ? zlib_1.createGunzip() : new stream_1.PassThrough(),
        utils_1.createReplaceStream('\r\n', '\n'),
        utils_1.createSplitStream(constants_1.RECORD_SEPARATOR),
        filter_stream_1.createFilterStream(l => !!l.match(/[^\s]/)),
        utils_1.createMapStream(json => JSON.parse(json.trim())),
    ];
}
exports.createParseArchiveStreams = createParseArchiveStreams;
