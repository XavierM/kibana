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
const dev_utils_1 = require("@kbn/dev-utils");
const __1 = require("..");
function filterEntries(entries, exclude) {
    return entries.filter((entry) => exclude.every((excludedPath) => !__1.normalizePath(entry).startsWith(excludedPath)));
}
async function extractUntrackedMessagesTask({ path, config, reporter, }) {
    const inputPaths = Array.isArray(path) ? path : [path || './'];
    const availablePaths = Object.values(config.paths).flat();
    const ignore = availablePaths.concat([
        '**/build/**',
        '**/webpackShims/**',
        '**/__fixtures__/**',
        '**/packages/kbn-i18n/**',
        '**/packages/kbn-plugin-generator/sao_template/**',
        '**/packages/kbn-ui-framework/generator-kui/**',
        '**/target/**',
        '**/test/**',
        '**/scripts/**',
        '**/src/dev/**',
        '**/target/**',
        '**/dist/**',
    ]);
    for (const inputPath of inputPaths) {
        const categorizedEntries = await __1.matchEntriesWithExctractors(inputPath, {
            additionalIgnore: ignore,
            mark: true,
            absolute: true,
        });
        for (const [entries, extractFunction] of categorizedEntries) {
            const files = await Promise.all(filterEntries(entries, config.exclude)
                .filter(entry => {
                const normalizedEntry = __1.normalizePath(entry);
                return !availablePaths.some(availablePath => normalizedEntry.startsWith(`${__1.normalizePath(availablePath)}/`) ||
                    __1.normalizePath(availablePath) === normalizedEntry);
            })
                .map(async (entry) => ({
                name: entry,
                content: await __1.readFileAsync(entry),
            })));
            for (const { name, content } of files) {
                const reporterWithContext = reporter.withContext({ name });
                for (const [id] of extractFunction(content, reporterWithContext)) {
                    const errorMessage = `Untracked file contains i18n label (${id}).`;
                    reporterWithContext.report(dev_utils_1.createFailError(errorMessage));
                }
            }
        }
    }
}
exports.extractUntrackedMessagesTask = extractUntrackedMessagesTask;
function extractUntrackedMessages(inputPaths) {
    return inputPaths.map(inputPath => ({
        title: `Checking untracked messages in ${inputPath}`,
        task: async (context) => {
            const { reporter, config } = context;
            const initialErrorsNumber = reporter.errors.length;
            const result = await extractUntrackedMessagesTask({ path: inputPath, config, reporter });
            if (reporter.errors.length === initialErrorsNumber) {
                return result;
            }
            throw reporter;
        },
    }));
}
exports.extractUntrackedMessages = extractUntrackedMessages;
