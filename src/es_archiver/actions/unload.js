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
const utils_1 = require("../../legacy/utils");
const lib_1 = require("../lib");
async function unloadAction({ name, client, dataDir, log, kbnClient, }) {
    const inputDir = path_1.resolve(dataDir, name);
    const stats = lib_1.createStats(name, log);
    const kibanaPluginIds = await kbnClient.plugins.getEnabledIds();
    const files = lib_1.prioritizeMappings(await lib_1.readDirectory(inputDir));
    for (const filename of files) {
        log.info('[%s] Unloading indices from %j', name, filename);
        await utils_1.createPromiseFromStreams([
            fs_1.createReadStream(path_1.resolve(inputDir, filename)),
            ...lib_1.createParseArchiveStreams({ gzip: lib_1.isGzip(filename) }),
            lib_1.createFilterRecordsStream('index'),
            lib_1.createDeleteIndexStream(client, stats, log, kibanaPluginIds),
        ]);
    }
    return stats.toJSON();
}
exports.unloadAction = unloadAction;
