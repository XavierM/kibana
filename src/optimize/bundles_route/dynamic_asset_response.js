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
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = require("path");
const util_1 = require("util");
const boom_1 = tslib_1.__importDefault(require("boom"));
const file_hash_1 = require("./file_hash");
// @ts-ignore
const public_path_placeholder_1 = require("../public_path_placeholder");
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const asyncOpen = util_1.promisify(fs_1.default.open);
const asyncClose = util_1.promisify(fs_1.default.close);
const asyncFstat = util_1.promisify(fs_1.default.fstat);
/**
 *  Create a Hapi response for the requested path. This is designed
 *  to replicate a subset of the features provided by Hapi's Inert
 *  plugin including:
 *   - ensure path is not traversing out of the bundle directory
 *   - manage use file descriptors for file access to efficiently
 *     interact with the file multiple times in each request
 *   - generate and cache etag for the file
 *   - write correct headers to response for client-side caching
 *     and invalidation
 *   - stream file to response
 *
 *  It differs from Inert in some important ways:
 *   - the PUBLIC_PATH_PLACEHOLDER is replaced with the correct
 *     public path as the response is streamed
 *   - cached hash/etag is based on the file on disk, but modified
 *     by the public path so that individual public paths have
 *     different etags, but can share a cache
 */
async function createDynamicAssetResponse({ request, h, bundlesPath, publicPath, fileHashCache, replacePublicPath, isDist, }) {
    let fd;
    try {
        const path = path_1.resolve(bundlesPath, request.params.path);
        // prevent path traversal, only process paths that resolve within bundlesPath
        if (!path.startsWith(bundlesPath)) {
            throw boom_1.default.forbidden(undefined, 'EACCES');
        }
        // we use and manage a file descriptor mostly because
        // that's what Inert does, and since we are accessing
        // the file 2 or 3 times per request it seems logical
        fd = await asyncOpen(path, 'r');
        const stat = await asyncFstat(fd);
        const hash = isDist ? undefined : await file_hash_1.getFileHash(fileHashCache, path, stat, fd);
        const read = fs_1.default.createReadStream(null, {
            fd,
            start: 0,
            autoClose: true,
        });
        fd = undefined; // read stream is now responsible for fd
        const content = replacePublicPath ? public_path_placeholder_1.replacePlaceholder(read, publicPath) : read;
        const response = h
            .response(content)
            .takeover()
            .code(200)
            .type(request.server.mime.path(path).type);
        if (isDist) {
            response.header('cache-control', `max-age=${365 * DAY}`);
        }
        else {
            response.etag(`${hash}-${publicPath}`);
            response.header('cache-control', 'must-revalidate');
        }
        return response;
    }
    catch (error) {
        if (fd) {
            try {
                await asyncClose(fd);
            }
            catch (_) {
                // ignore errors from close, we already have one to report
                // and it's very likely they are the same
            }
        }
        if (error.code === 'ENOENT') {
            throw boom_1.default.notFound();
        }
        throw boom_1.default.boomify(error);
    }
}
exports.createDynamicAssetResponse = createDynamicAssetResponse;
