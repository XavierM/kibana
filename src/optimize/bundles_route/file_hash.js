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
const fs_1 = tslib_1.__importDefault(require("fs"));
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
/**
 *  Get the hash of a file via a file descriptor
 */
async function getFileHash(cache, path, stat, fd) {
    const key = `${path}:${stat.ino}:${stat.size}:${stat.mtime.getTime()}`;
    const cached = cache.get(key);
    if (cached) {
        return await cached;
    }
    const hash = crypto_1.createHash('sha1');
    const read = fs_1.default.createReadStream(null, {
        fd,
        start: 0,
        autoClose: false,
    });
    const promise = Rx.merge(Rx.fromEvent(read, 'data'), Rx.fromEvent(read, 'error').pipe(operators_1.map(error => {
        throw error;
    })))
        .pipe(operators_1.takeUntil(Rx.fromEvent(read, 'end')))
        .forEach(chunk => hash.update(chunk))
        .then(() => hash.digest('hex'))
        .catch(error => {
        // don't cache failed attempts
        cache.del(key);
        throw error;
    });
    cache.set(key, promise);
    return await promise;
}
exports.getFileHash = getFileHash;
