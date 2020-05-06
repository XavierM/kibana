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
const config_schema_1 = require("@kbn/config-schema");
const utils_1 = require("../utils");
const isString = (v) => typeof v === 'string';
const CONFIG_PATHS = [
    process.env.KIBANA_PATH_CONF && path_1.join(process.env.KIBANA_PATH_CONF, 'kibana.yml'),
    process.env.CONFIG_PATH,
    utils_1.fromRoot('config/kibana.yml'),
    '/etc/kibana/kibana.yml',
].filter(isString);
const DATA_PATHS = [
    process.env.DATA_PATH,
    utils_1.fromRoot('data'),
    '/var/lib/kibana',
].filter(isString);
function findFile(paths) {
    const availablePath = paths.find(configPath => {
        try {
            fs_1.accessSync(configPath, fs_1.constants.R_OK);
            return true;
        }
        catch (e) {
            // Check the next path
        }
    });
    return availablePath || paths[0];
}
/**
 * Get the path where the config files are stored
 * @internal
 */
exports.getConfigPath = () => findFile(CONFIG_PATHS);
/**
 * Get the path where the data can be stored
 * @internal
 */
exports.getDataPath = () => findFile(DATA_PATHS);
exports.config = {
    path: 'path',
    schema: config_schema_1.schema.object({
        data: config_schema_1.schema.string({ defaultValue: () => exports.getDataPath() }),
    }),
};
