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
// @ts-ignore
const _1 = require(".");
async function checkConfigNamespacePrefix(configPath) {
    const { prefix, paths } = JSON.parse(await _1.readFileAsync(path_1.resolve(configPath)));
    for (const [namespace] of Object.entries(paths)) {
        if (prefix && prefix !== namespace.split('.')[0]) {
            throw new Error(`namespace ${namespace} must be prefixed with ${prefix} in ${configPath}`);
        }
    }
}
exports.checkConfigNamespacePrefix = checkConfigNamespacePrefix;
async function assignConfigFromPath(config = { exclude: [], translations: [], paths: {} }, configPath) {
    const additionalConfig = {
        paths: {},
        exclude: [],
        translations: [],
        ...JSON.parse(await _1.readFileAsync(path_1.resolve(configPath))),
    };
    for (const [namespace, namespacePaths] of Object.entries(additionalConfig.paths)) {
        const paths = Array.isArray(namespacePaths) ? namespacePaths : [namespacePaths];
        config.paths[namespace] = paths.map(path => _1.normalizePath(path_1.resolve(configPath, '..', path)));
    }
    for (const exclude of additionalConfig.exclude) {
        config.exclude.push(_1.normalizePath(path_1.resolve(configPath, '..', exclude)));
    }
    for (const translations of additionalConfig.translations) {
        config.translations.push(_1.normalizePath(path_1.resolve(configPath, '..', translations)));
    }
    return config;
}
exports.assignConfigFromPath = assignConfigFromPath;
/**
 * Filters out custom paths based on the paths defined in config and that are
 * known to contain i18n strings.
 * @param inputPaths List of paths to filter.
 * @param config I18n config instance.
 */
function filterConfigPaths(inputPaths, config) {
    const availablePaths = Object.values(config.paths).flat();
    const pathsForExtraction = new Set();
    for (const inputPath of inputPaths) {
        const normalizedPath = _1.normalizePath(inputPath);
        // If input path is the sub path of or equal to any available path, include it.
        if (availablePaths.some(path => normalizedPath.startsWith(`${path}/`) || path === normalizedPath)) {
            pathsForExtraction.add(normalizedPath);
        }
        else {
            // Otherwise go through all available paths and see if any of them is the sub
            // path of the input path (empty normalized path corresponds to root or above).
            availablePaths
                .filter(path => !normalizedPath || path.startsWith(`${normalizedPath}/`))
                .forEach(ePath => pathsForExtraction.add(ePath));
        }
    }
    return [...pathsForExtraction];
}
exports.filterConfigPaths = filterConfigPaths;
