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
// pipe a series of streams into each other so that data and errors
// flow from the first stream to the last. Errors from the last stream
// are not listened for
const pipeline = (...streams) => streams.reduce((source, dest) => source.once('error', error => dest.emit('error', error)).pipe(dest));
async function loadAction({ name, skipExisting, client, dataDir, log, kbnClient, }) {
    const inputDir = path_1.resolve(dataDir, name);
    const stats = lib_1.createStats(name, log);
    const files = lib_1.prioritizeMappings(await lib_1.readDirectory(inputDir));
    const kibanaPluginIds = await kbnClient.plugins.getEnabledIds();
    // a single stream that emits records from all archive files, in
    // order, so that createIndexStream can track the state of indexes
    // across archives and properly skip docs from existing indexes
    const recordStream = utils_1.concatStreamProviders(files.map(filename => () => {
        log.info('[%s] Loading %j', name, filename);
        return pipeline(fs_1.createReadStream(path_1.resolve(inputDir, filename)), ...lib_1.createParseArchiveStreams({ gzip: lib_1.isGzip(filename) }));
    }), { objectMode: true });
    const progress = new lib_1.Progress();
    progress.activate(log);
    await utils_1.createPromiseFromStreams([
        recordStream,
        lib_1.createCreateIndexStream({ client, stats, skipExisting, log }),
        lib_1.createIndexDocRecordsStream(client, stats, progress),
    ]);
    progress.deactivate();
    const result = stats.toJSON();
    for (const [index, { docs }] of Object.entries(result)) {
        if (docs && docs.indexed > 0) {
            log.info('[%s] Indexed %d docs into %j', name, docs.indexed, index);
        }
    }
    await client.indices.refresh({
        index: '_all',
        allowNoIndices: true,
    });
    // If we affected the Kibana index, we need to ensure it's migrated...
    if (Object.keys(result).some(k => k.startsWith('.kibana'))) {
        await lib_1.migrateKibanaIndex({ client, kbnClient });
        if (kibanaPluginIds.includes('spaces')) {
            await lib_1.createDefaultSpace({ client, index: '.kibana' });
        }
    }
    return result;
}
exports.loadAction = loadAction;
