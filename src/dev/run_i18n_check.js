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
const skipNoTranslations = ({ config }) => !config.translations.length;
dev_utils_1.run(async ({ flags: { 'ignore-incompatible': ignoreIncompatible, 'ignore-missing': ignoreMissing, 'ignore-unused': ignoreUnused, 'include-config': includeConfig, fix = false, path, }, log, }) => {
    if (fix &&
        (ignoreIncompatible !== undefined ||
            ignoreUnused !== undefined ||
            ignoreMissing !== undefined)) {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} none of the --ignore-incompatible, --ignore-unused or --ignore-missing is allowed when --fix is set.`);
    }
    if (typeof path === 'boolean' || typeof includeConfig === 'boolean') {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} --path and --include-config require a value`);
    }
    if (typeof fix !== 'boolean') {
        throw dev_utils_1.createFailError(`${chalk_1.default.white.bgRed(' I18N ERROR ')} --fix can't have a value`);
    }
    const srcPaths = Array().concat(path || ['./src', './packages', './x-pack']);
    const list = new listr_1.default([
        {
            title: 'Checking .i18nrc.json files',
            task: () => new listr_1.default(tasks_1.checkConfigs(includeConfig), { exitOnError: true }),
        },
        {
            title: 'Merging .i18nrc.json files',
            task: () => new listr_1.default(tasks_1.mergeConfigs(includeConfig), { exitOnError: true }),
        },
        {
            title: 'Checking For Untracked Messages based on .i18nrc.json',
            skip: skipNoTranslations,
            task: ({ config }) => new listr_1.default(tasks_1.extractUntrackedMessages(srcPaths), { exitOnError: true }),
        },
        {
            title: 'Validating Default Messages',
            skip: skipNoTranslations,
            task: ({ config }) => new listr_1.default(tasks_1.extractDefaultMessages(config, srcPaths), { exitOnError: true }),
        },
        {
            title: 'Compatibility Checks',
            skip: skipNoTranslations,
            task: ({ config }) => new listr_1.default(tasks_1.checkCompatibility(config, {
                ignoreIncompatible: !!ignoreIncompatible,
                ignoreUnused: !!ignoreUnused,
                ignoreMissing: !!ignoreMissing,
                fix,
            }, log), { exitOnError: true }),
        },
    ], {
        concurrent: false,
        exitOnError: true,
    });
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
