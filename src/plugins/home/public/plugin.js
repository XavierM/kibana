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
const services_1 = require("./services");
const kibana_services_1 = require("./application/kibana_services");
class HomePublicPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.featuresCatalogueRegistry = new services_1.FeatureCatalogueRegistry();
        this.environmentService = new services_1.EnvironmentService();
        this.tutorialService = new services_1.TutorialService();
    }
    setup(core, { kibanaLegacy, usageCollection }) {
        kibanaLegacy.registerLegacyApp({
            id: 'home',
            title: 'Home',
            mount: async (params) => {
                const trackUiMetric = usageCollection
                    ? usageCollection.reportUiStats.bind(usageCollection, 'Kibana_home')
                    : () => { };
                const [coreStart, { telemetry, data }] = await core.getStartServices();
                kibana_services_1.setServices({
                    trackUiMetric,
                    kibanaVersion: this.initializerContext.env.packageInfo.version,
                    http: coreStart.http,
                    toastNotifications: core.notifications.toasts,
                    banners: coreStart.overlays.banners,
                    docLinks: coreStart.docLinks,
                    savedObjectsClient: coreStart.savedObjects.client,
                    chrome: coreStart.chrome,
                    telemetry,
                    uiSettings: core.uiSettings,
                    addBasePath: core.http.basePath.prepend,
                    getBasePath: core.http.basePath.get,
                    indexPatternService: data.indexPatterns,
                    environmentService: this.environmentService,
                    config: kibanaLegacy.config,
                    homeConfig: this.initializerContext.config.get(),
                    tutorialService: this.tutorialService,
                    featureCatalogue: this.featuresCatalogueRegistry,
                });
                const { renderApp } = await Promise.resolve().then(() => __importStar(require('./application')));
                return await renderApp(params.element);
            },
        });
        return {
            featureCatalogue: { ...this.featuresCatalogueRegistry.setup() },
            environment: { ...this.environmentService.setup() },
            tutorials: { ...this.tutorialService.setup() },
        };
    }
    start({ application: { capabilities } }) {
        this.featuresCatalogueRegistry.start({ capabilities });
    }
}
exports.HomePublicPlugin = HomePublicPlugin;
