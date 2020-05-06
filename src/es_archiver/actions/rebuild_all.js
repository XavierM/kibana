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
const path_1 = require("path");
const fs_1 = require("fs");
const bluebird_1 = require("bluebird");
const utils_1 = require("../../legacy/utils");
const lib_1 = require("../lib");
async function isDirectory(path) {
    const stats = await bluebird_1.fromNode(cb => fs_1.stat(path, cb));
    return stats.isDirectory();
}
async function rebuildAllAction({ dataDir, log, rootDir = dataDir, }) {
    const childNames = lib_1.prioritizeMappings(await lib_1.readDirectory(dataDir));
    for (const childName of childNames) {
        const childPath = path_1.resolve(dataDir, childName);
        if (await isDirectory(childPath)) {
            await rebuildAllAction({
                dataDir: childPath,
                log,
                rootDir,
            });
            continue;
        }
        const archiveName = path_1.dirname(path_1.relative(rootDir, childPath));
        log.info(`${archiveName} Rebuilding ${childName}`);
        const gzip = lib_1.isGzip(childPath);
        const tempFile = childPath + (gzip ? '.rebuilding.gz' : '.rebuilding');
        await utils_1.createPromiseFromStreams([
            fs_1.createReadStream(childPath),
            ...lib_1.createParseArchiveStreams({ gzip }),
            ...lib_1.createFormatArchiveStreams({ gzip }),
            fs_1.createWriteStream(tempFile),
        ]);
        await bluebird_1.fromNode(cb => fs_1.rename(tempFile, childPath, cb));
        log.info(`${archiveName} Rebuilt ${childName}`);
    }
}
exports.rebuildAllAction = rebuildAllAction;
