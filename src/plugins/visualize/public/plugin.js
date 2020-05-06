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
const rxjs_1 = require("rxjs");
const i18n_1 = require("@kbn/i18n");
const operators_1 = require("rxjs/operators");
const public_1 = require("../../kibana_utils/public");
const public_2 = require("../../data/public");
const visualize_constants_1 = require("./application/visualize_constants");
const kibana_services_1 = require("./kibana_services");
const public_3 = require("../../home/public");
const public_4 = require("../../vis_default_editor/public");
class VisualizePlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.appStateUpdater = new rxjs_1.BehaviorSubject(() => ({}));
        this.stopUrlTracking = undefined;
    }
    async setup(core, { home, kibanaLegacy, data }) {
        const { appMounted, appUnMounted, stop: stopUrlTracker, setActiveUrl } = public_1.createKbnUrlTracker({
            baseUrl: core.http.basePath.prepend('/app/kibana'),
            defaultSubUrl: '#/visualize',
            storageKey: `lastUrl:${core.http.basePath.get()}:visualize`,
            navLinkUpdater$: this.appStateUpdater,
            toastNotifications: core.notifications.toasts,
            stateParams: [
                {
                    kbnUrlKey: '_g',
                    stateUpdate$: data.query.state$.pipe(operators_1.filter(({ changes }) => !!(changes.globalFilters || changes.time || changes.refreshInterval)), operators_1.map(({ state }) => ({
                        ...state,
                        filters: state.filters?.filter(public_2.esFilters.isFilterPinned),
                    }))),
                },
            ],
        });
        this.stopUrlTracking = () => {
            stopUrlTracker();
        };
        kibanaLegacy.registerLegacyApp({
            id: 'visualize',
            title: 'Visualize',
            updater$: this.appStateUpdater.asObservable(),
            navLinkId: 'kibana:visualize',
            mount: async (params) => {
                const [coreStart, pluginsStart] = await core.getStartServices();
                appMounted();
                const deps = {
                    pluginInitializerContext: this.initializerContext,
                    addBasePath: coreStart.http.basePath.prepend,
                    core: coreStart,
                    config: kibanaLegacy.config,
                    chrome: coreStart.chrome,
                    data: pluginsStart.data,
                    localStorage: new public_1.Storage(localStorage),
                    navigation: pluginsStart.navigation,
                    savedObjectsClient: coreStart.savedObjects.client,
                    savedVisualizations: pluginsStart.visualizations.savedVisualizationsLoader,
                    share: pluginsStart.share,
                    toastNotifications: coreStart.notifications.toasts,
                    visualizeCapabilities: coreStart.application.capabilities.visualize,
                    visualizations: pluginsStart.visualizations,
                    I18nContext: coreStart.i18n.Context,
                    setActiveUrl,
                    DefaultVisualizationEditor: public_4.DefaultEditorController,
                    createVisEmbeddableFromObject: pluginsStart.visualizations.__LEGACY.createVisEmbeddableFromObject,
                };
                kibana_services_1.setServices(deps);
                // make sure the index pattern list is up to date
                await pluginsStart.data.indexPatterns.clearCache();
                const { renderApp } = await Promise.resolve().then(() => __importStar(require('./application/application')));
                const unmount = renderApp(params.element, params.appBasePath, deps);
                return () => {
                    unmount();
                    appUnMounted();
                };
            },
        });
        if (home) {
            home.featureCatalogue.register({
                id: 'visualize',
                title: 'Visualize',
                description: i18n_1.i18n.translate('visualize.visualizeDescription', {
                    defaultMessage: 'Create visualizations and aggregate data stores in your Elasticsearch indices.',
                }),
                icon: 'visualizeApp',
                path: `/app/kibana#${visualize_constants_1.VisualizeConstants.LANDING_PAGE_PATH}`,
                showOnHomePage: true,
                category: public_3.FeatureCatalogueCategory.DATA,
            });
        }
    }
    start(core, plugins) { }
    stop() {
        if (this.stopUrlTracking) {
            this.stopUrlTracking();
        }
    }
}
exports.VisualizePlugin = VisualizePlugin;
