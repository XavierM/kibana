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
const i18n_1 = require("@kbn/i18n");
const path_1 = require("path");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const utils_1 = require("../../../core/server/utils");
const get_translations_path_1 = require("./get_translations_path");
const constants_1 = require("./constants");
const localization_1 = require("./localization");
async function i18nMixin(kbnServer, server, config) {
    const locale = config.get('i18n.locale');
    const translationPaths = await Promise.all([
        get_translations_path_1.getTranslationPaths({
            cwd: utils_1.fromRoot('.'),
            glob: constants_1.I18N_RC,
        }),
        ...config.get('plugins.paths').map(cwd => get_translations_path_1.getTranslationPaths({ cwd, glob: constants_1.I18N_RC })),
        ...config.get('plugins.scanDirs').map(cwd => get_translations_path_1.getTranslationPaths({ cwd, glob: `*/${constants_1.I18N_RC}` })),
        get_translations_path_1.getTranslationPaths({
            cwd: utils_1.fromRoot('../kibana-extra'),
            glob: `*/${constants_1.I18N_RC}`,
        }),
    ]);
    const currentTranslationPaths = []
        .concat(...translationPaths)
        .filter(translationPath => path_1.basename(translationPath, '.json') === locale);
    i18n_1.i18nLoader.registerTranslationFiles(currentTranslationPaths);
    const translations = await i18n_1.i18nLoader.getTranslationsByLocale(locale);
    i18n_1.i18n.init(Object.freeze({
        locale,
        ...translations,
    }));
    const getTranslationsFilePaths = () => currentTranslationPaths;
    server.decorate('server', 'getTranslationsFilePaths', getTranslationsFilePaths);
    if (kbnServer.newPlatform.setup.plugins.usageCollection) {
        localization_1.registerLocalizationUsageCollector(kbnServer.newPlatform.setup.plugins.usageCollection, {
            getLocale: () => config.get('i18n.locale'),
            getTranslationsFilePaths,
        });
    }
}
exports.i18nMixin = i18nMixin;
