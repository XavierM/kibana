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
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const listr_1 = tslib_1.__importDefault(require("listr"));
const dev_utils_1 = require("@kbn/dev-utils");
const i18n_1 = require("./i18n");
const tasks_1 = require("./i18n/tasks");
dev_utils_1.run(async ({ flags: { 'dry-run': dryRun = false, 'ignore-incompatible': ignoreIncompatible = false, 'ignore-missing': ignoreMissing = false, 'ignore-unused': ignoreUnused = false, 'include-config': includeConfig, path, source, target, }, log, }) => {
    if (!source || typeof source === 'boolean') {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} --source option isn't provided.`);
    }
    if (Array.isArray(source)) {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} --source should be specified only once.`);
    }
    if (typeof target === 'boolean' || Array.isArray(target)) {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} --target should be specified only once and must have a value.`);
    }
    if (typeof path === 'boolean' || typeof includeConfig === 'boolean') {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} --path and --include-config require a value`);
    }
    if (typeof ignoreIncompatible !== 'boolean' ||
        typeof ignoreUnused !== 'boolean' ||
        typeof ignoreMissing !== 'boolean' ||
        typeof dryRun !== 'boolean') {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} --ignore-incompatible, --ignore-unused, --ignore-missing, and --dry-run can't have values`);
    }
    const srcPaths = Array().concat(path || ['./src', './packages', './x-pack']);
    const list = new listr_1.default([
        {
            title: 'Merging .i18nrc.json files',
            task: () => new listr_1.default(tasks_1.mergeConfigs(includeConfig), { exitOnError: true }),
        },
        {
            title: 'Extracting Default Messages',
            task: ({ config }) => new listr_1.default(tasks_1.extractDefaultMessages(config, srcPaths), { exitOnError: true }),
        },
        {
            title: 'Integrating Locale File',
            task: async ({ messages, config }) => {
                await i18n_1.integrateLocaleFiles(messages, {
                    sourceFileName: source,
                    targetFileName: target,
                    dryRun,
                    ignoreIncompatible,
                    ignoreUnused,
                    ignoreMissing,
                    config,
                    log,
                });
            },
        },
    ]);
    try {
        const reporter = new i18n_1.ErrorReporter();
        const messages = new Map();
        await list.run({ messages, reporter });
    }
    catch (error) {
        process.exitCode = 1;
        if (error instanceof i18n_1.ErrorReporter) {
            error.errors.forEach((e) => log.error(e));
        }
        else {
            log.error('Unhandled exception!');
            log.error(error);
        }
    }
}, {
    flags: {
        allowUnexpected: true,
        guessTypesForUnexpectedFlags: true,
    },
});
