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
async function saveAction({ name, indices, client, dataDir, log, raw, }) {
    const outputDir = path_1.resolve(dataDir, name);
    const stats = lib_1.createStats(name, log);
    log.info('[%s] Creating archive of %j', name, indices);
    fs_1.mkdirSync(outputDir, { recursive: true });
    const progress = new lib_1.Progress();
    progress.activate(log);
    await Promise.all([
        // export and save the matching indices to mappings.json
        utils_1.createPromiseFromStreams([
            utils_1.createListStream(indices),
            lib_1.createGenerateIndexRecordsStream(client, stats),
            ...lib_1.createFormatArchiveStreams(),
            fs_1.createWriteStream(path_1.resolve(outputDir, 'mappings.json')),
        ]),
        // export all documents from matching indexes into data.json.gz
        utils_1.createPromiseFromStreams([
            utils_1.createListStream(indices),
            lib_1.createGenerateDocRecordsStream(client, stats, progress),
            ...lib_1.createFormatArchiveStreams({ gzip: !raw }),
            fs_1.createWriteStream(path_1.resolve(outputDir, `data.json${raw ? '' : '.gz'}`)),
        ]),
    ]);
    progress.deactivate();
    stats.forEachIndex((index, { docs }) => {
        log.info('[%s] Archived %d docs from %j', name, docs.archived, index);
    });
    return stats.toJSON();
}
exports.saveAction = saveAction;
