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
const lodash_1 = require("lodash");
const file_integrity_1 = require("./file_integrity");
const constants_1 = require("../constants");
async function getTranslationCount(loader, locale) {
    const translations = await loader.getTranslationsByLocale(locale);
    return lodash_1.size(translations.messages);
}
exports.getTranslationCount = getTranslationCount;
function createCollectorFetch({ getLocale, getTranslationsFilePaths, }) {
    return async function fetchUsageStats() {
        const locale = getLocale();
        const translationFilePaths = getTranslationsFilePaths();
        const [labelsCount, integrities] = await Promise.all([
            getTranslationCount(i18n_1.i18nLoader, locale),
            file_integrity_1.getIntegrityHashes(translationFilePaths),
        ]);
        return {
            locale,
            integrities,
            labelsCount,
        };
    };
}
exports.createCollectorFetch = createCollectorFetch;
function registerLocalizationUsageCollector(usageCollection, helpers) {
    const collector = usageCollection.makeUsageCollector({
        type: constants_1.KIBANA_LOCALIZATION_STATS_TYPE,
        isReady: () => true,
        fetch: createCollectorFetch(helpers),
    });
    usageCollection.registerCollector(collector);
}
exports.registerLocalizationUsageCollector = registerLocalizationUsageCollector;
