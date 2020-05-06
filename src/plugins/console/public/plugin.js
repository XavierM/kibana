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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../home/public");
class ConsoleUIPlugin {
    constructor() { }
    async setup({ notifications, getStartServices }, { devTools, home, usageCollection }) {
        home.featureCatalogue.register({
            id: 'console',
            title: i18n_1.i18n.translate('console.devToolsTitle', {
                defaultMessage: 'Console',
            }),
            description: i18n_1.i18n.translate('console.devToolsDescription', {
                defaultMessage: 'Skip cURL and use this JSON interface to work with your data directly.',
            }),
            icon: 'consoleApp',
            path: '/app/kibana#/dev_tools/console',
            showOnHomePage: true,
            category: public_1.FeatureCatalogueCategory.ADMIN,
        });
        devTools.register({
            id: 'console',
            order: 1,
            title: i18n_1.i18n.translate('console.consoleDisplayName', {
                defaultMessage: 'Console',
            }),
            enableRouting: false,
            mount: async ({ core: { docLinks, i18n: i18nDep } }, { element }) => {
                const { renderApp } = await Promise.resolve().then(() => __importStar(require('./application')));
                const [{ injectedMetadata }] = await getStartServices();
                const elasticsearchUrl = injectedMetadata.getInjectedVar('elasticsearchUrl', 'http://localhost:9200');
                return renderApp({
                    docLinkVersion: docLinks.DOC_LINK_VERSION,
                    I18nContext: i18nDep.Context,
                    notifications,
                    elasticsearchUrl,
                    usageCollection,
                    element,
                });
            },
        });
    }
    async start(core) { }
}
exports.ConsoleUIPlugin = ConsoleUIPlugin;
