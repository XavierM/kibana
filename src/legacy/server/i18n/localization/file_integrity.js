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
const crypto_1 = require("crypto");
const fs = tslib_1.__importStar(require("fs"));
const lodash_1 = require("lodash");
const stream = tslib_1.__importStar(require("stream"));
const util = tslib_1.__importStar(require("util"));
const pipeline = util.promisify(stream.pipeline);
async function getIntegrityHashes(filepaths) {
    const hashes = await Promise.all(filepaths.map(getIntegrityHash));
    return lodash_1.zipObject(filepaths, hashes);
}
exports.getIntegrityHashes = getIntegrityHashes;
async function getIntegrityHash(filepath) {
    try {
        const output = crypto_1.createHash('md5');
        await pipeline(fs.createReadStream(filepath), output);
        const data = output.read();
        if (data instanceof Buffer) {
            return data.toString('hex');
        }
        return data;
    }
    catch (err) {
        return null;
    }
}
exports.getIntegrityHash = getIntegrityHash;
