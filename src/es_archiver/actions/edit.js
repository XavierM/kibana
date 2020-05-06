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
const path_1 = require("path");
const fs_1 = tslib_1.__importDefault(require("fs"));
const zlib_1 = require("zlib");
const util_1 = require("util");
const globby_1 = tslib_1.__importDefault(require("globby"));
const utils_1 = require("../../legacy/utils");
const unlinkAsync = util_1.promisify(fs_1.default.unlink);
async function editAction({ prefix, dataDir, log, handler, }) {
    const archives = (await globby_1.default('**/*.gz', {
        cwd: prefix ? path_1.resolve(dataDir, prefix) : dataDir,
        absolute: true,
    })).map(path => ({
        path,
        rawPath: path.slice(0, -3),
    }));
    await Promise.all(archives.map(async (archive) => {
        await utils_1.createPromiseFromStreams([
            fs_1.default.createReadStream(archive.path),
            zlib_1.createGunzip(),
            fs_1.default.createWriteStream(archive.rawPath),
        ]);
        await unlinkAsync(archive.path);
        log.info(`Extracted %s to %s`, path_1.relative(process.cwd(), archive.path), path_1.relative(process.cwd(), archive.rawPath));
    }));
    await handler();
    await Promise.all(archives.map(async (archive) => {
        await utils_1.createPromiseFromStreams([
            fs_1.default.createReadStream(archive.rawPath),
            zlib_1.createGzip({ level: zlib_1.Z_BEST_COMPRESSION }),
            fs_1.default.createWriteStream(archive.path),
        ]);
        await unlinkAsync(archive.rawPath);
        log.info(`Archived %s to %s`, path_1.relative(process.cwd(), archive.rawPath), path_1.relative(process.cwd(), archive.path));
    }));
}
exports.editAction = editAction;
