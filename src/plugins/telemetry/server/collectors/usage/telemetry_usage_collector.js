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
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const path_1 = require("path");
const operators_1 = require("rxjs/operators");
// look for telemetry.yml in the same places we expect kibana.yml
const ensure_deep_object_1 = require("./ensure_deep_object");
/**
 * The maximum file size before we ignore it (note: this limit is arbitrary).
 */
exports.MAX_FILE_SIZE = 10 * 1024; // 10 KB
/**
 * Determine if the supplied `path` is readable.
 *
 * @param path The possible path where a config file may exist.
 * @returns `true` if the file should be used.
 */
function isFileReadable(path) {
    try {
        fs_1.accessSync(path, fs_1.constants.R_OK);
        // ignore files above the limit
        const stats = fs_1.statSync(path);
        return stats.size <= exports.MAX_FILE_SIZE;
    }
    catch (e) {
        return false;
    }
}
exports.isFileReadable = isFileReadable;
/**
 * Load the `telemetry.yml` file, if it exists, and return its contents as
 * a JSON object.
 *
 * @param configPath The config file path.
 * @returns The unmodified JSON object if the file exists and is a valid YAML file.
 */
async function readTelemetryFile(path) {
    try {
        if (isFileReadable(path)) {
            const yaml = fs_1.readFileSync(path);
            const data = js_yaml_1.safeLoad(yaml.toString());
            // don't bother returning empty objects
            if (Object.keys(data).length) {
                // ensure { "a.b": "value" } becomes { "a": { "b": "value" } }
                return ensure_deep_object_1.ensureDeepObject(data);
            }
        }
    }
    catch (e) {
        // ignored
    }
    return undefined;
}
exports.readTelemetryFile = readTelemetryFile;
function createTelemetryUsageCollector(usageCollection, getConfigPathFn) {
    return usageCollection.makeUsageCollector({
        type: 'static_telemetry',
        isReady: () => true,
        fetch: async () => {
            const configPath = await getConfigPathFn();
            const telemetryPath = path_1.join(path_1.dirname(configPath), 'telemetry.yml');
            return await readTelemetryFile(telemetryPath);
        },
    });
}
exports.createTelemetryUsageCollector = createTelemetryUsageCollector;
function registerTelemetryUsageCollector(usageCollection, config$) {
    const collector = createTelemetryUsageCollector(usageCollection, async () => {
        const config = await config$.pipe(operators_1.take(1)).toPromise();
        return config.config;
    });
    usageCollection.registerCollector(collector);
}
exports.registerTelemetryUsageCollector = registerTelemetryUsageCollector;
