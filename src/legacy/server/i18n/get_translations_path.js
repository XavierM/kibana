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
const util_1 = require("util");
const fs_1 = require("fs");
const path_1 = require("path");
const globby_1 = tslib_1.__importDefault(require("globby"));
const readFileAsync = util_1.promisify(fs_1.readFile);
async function getTranslationPaths({ cwd, glob }) {
    const entries = await globby_1.default(glob, { cwd });
    const translationPaths = [];
    for (const entry of entries) {
        const entryFullPath = path_1.resolve(cwd, entry);
        const pluginBasePath = path_1.dirname(entryFullPath);
        try {
            const content = await readFileAsync(entryFullPath, 'utf8');
            const { translations } = JSON.parse(content);
            if (translations && translations.length) {
                translations.forEach(translation => {
                    const translationFullPath = path_1.resolve(pluginBasePath, translation);
                    translationPaths.push(translationFullPath);
                });
            }
        }
        catch (err) {
            throw new Error(`Failed to parse .i18nrc.json file at ${entryFullPath}`);
        }
    }
    return translationPaths;
}
exports.getTranslationPaths = getTranslationPaths;
