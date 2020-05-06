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
const React = tslib_1.__importStar(require("react"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../plugins/embeddable/public");
const public_2 = require("../../../plugins/data/public");
const public_3 = require("../../../plugins/saved_objects/public");
const public_4 = require("../../../plugins/kibana_react/public");
const public_5 = require("../../../plugins/kibana_utils/public");
const public_6 = require("../../../plugins/kibana_legacy/public");
const public_7 = require("../../../plugins/home/public");
const application_1 = require("./application");
const url_generator_1 = require("./url_generator");
const saved_dashboards_1 = require("./saved_dashboards");
const dashboard_constants_1 = require("./dashboard_constants");
const placeholder_1 = require("./application/embeddable/placeholder");
class DashboardPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.appStateUpdater = new rxjs_1.BehaviorSubject(() => ({}));
        this.stopUrlTracking = undefined;
    }
    setup(core, { share, uiActions, embeddable, home, kibanaLegacy, data, usageCollection }) {
        const expandPanelAction = new application_1.ExpandPanelAction();
        uiActions.registerAction(expandPanelAction);
        uiActions.attachAction(public_1.CONTEXT_MENU_TRIGGER, expandPanelAction);
        const startServices = core.getStartServices();
        if (share) {
            share.urlGenerators.registerUrlGenerator(url_generator_1.createDirectAccessDashboardLinkGenerator(async () => {
                const [coreStart, , selfStart] = await startServices;
                return {
                    appBasePath: coreStart.application.getUrlForApp('dashboard'),
                    useHashedUrl: coreStart.uiSettings.get('state:storeInSessionStorage'),
                    savedDashboardLoader: selfStart.getSavedDashboardLoader(),
                };
            }));
        }
        const getStartServices = async () => {
            const [coreStart, deps] = await core.getStartServices();
            const useHideChrome = () => {
                React.useEffect(() => {
                    coreStart.chrome.setIsVisible(false);
                    return () => coreStart.chrome.setIsVisible(true);
                }, []);
            };
            const ExitFullScreenButton = props => {
                useHideChrome();
                return React.createElement(public_4.ExitFullScreenButton, Object.assign({}, props));
            };
            return {
                capabilities: coreStart.application.capabilities,
                application: coreStart.application,
                notifications: coreStart.notifications,
                overlays: coreStart.overlays,
                embeddable: deps.embeddable,
                inspector: deps.inspector,
                SavedObjectFinder: public_3.getSavedObjectFinder(coreStart.savedObjects, coreStart.uiSettings),
                ExitFullScreenButton,
                uiActions: deps.uiActions,
            };
        };
        const factory = new application_1.DashboardContainerFactory(getStartServices);
        embeddable.registerEmbeddableFactory(factory.type, factory);
        const placeholderFactory = new placeholder_1.PlaceholderEmbeddableFactory();
        embeddable.registerEmbeddableFactory(placeholderFactory.type, placeholderFactory);
        const { appMounted, appUnMounted, stop: stopUrlTracker } = public_5.createKbnUrlTracker({
            baseUrl: core.http.basePath.prepend('/app/kibana'),
            defaultSubUrl: `#${dashboard_constants_1.DashboardConstants.LANDING_PAGE_PATH}`,
            shouldTrackUrlUpdate: pathname => {
                const targetAppName = pathname.split('/')[1];
                return (targetAppName === dashboard_constants_1.DashboardConstants.DASHBOARDS_ID ||
                    targetAppName === dashboard_constants_1.DashboardConstants.DASHBOARD_ID);
            },
            storageKey: `lastUrl:${core.http.basePath.get()}:dashboard`,
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
        const app = {
            id: '',
            title: 'Dashboards',
            mount: async (params) => {
                const [coreStart, pluginsStart, dashboardStart] = await core.getStartServices();
                appMounted();
                const { embeddable: embeddableStart, navigation, share: shareStart, data: dataStart, kibanaLegacy: { dashboardConfig }, } = pluginsStart;
                const deps = {
                    pluginInitializerContext: this.initializerContext,
                    core: coreStart,
                    dashboardConfig,
                    navigation,
                    share: shareStart,
                    data: dataStart,
                    savedObjectsClient: coreStart.savedObjects.client,
                    savedDashboards: dashboardStart.getSavedDashboardLoader(),
                    chrome: coreStart.chrome,
                    addBasePath: coreStart.http.basePath.prepend,
                    uiSettings: coreStart.uiSettings,
                    config: kibanaLegacy.config,
                    savedQueryService: dataStart.query.savedQueries,
                    embeddable: embeddableStart,
                    dashboardCapabilities: coreStart.application.capabilities.dashboard,
                    embeddableCapabilities: {
                        visualizeCapabilities: coreStart.application.capabilities.visualize,
                        mapsCapabilities: coreStart.application.capabilities.maps,
                    },
                    localStorage: new public_5.Storage(localStorage),
                    usageCollection,
                };
                // make sure the index pattern list is up to date
                await dataStart.indexPatterns.clearCache();
                const { renderApp } = await Promise.resolve().then(() => tslib_1.__importStar(require('./application/application')));
                const unmount = renderApp(params.element, params.appBasePath, deps);
                return () => {
                    unmount();
                    appUnMounted();
                };
            },
        };
        public_6.initAngularBootstrap();
        kibanaLegacy.registerLegacyApp({
            ...app,
            id: dashboard_constants_1.DashboardConstants.DASHBOARD_ID,
            // only register the updater in once app, otherwise all updates would happen twice
            updater$: this.appStateUpdater.asObservable(),
            navLinkId: 'kibana:dashboard',
        });
        kibanaLegacy.registerLegacyApp({ ...app, id: dashboard_constants_1.DashboardConstants.DASHBOARDS_ID });
        if (home) {
            home.featureCatalogue.register({
                id: dashboard_constants_1.DashboardConstants.DASHBOARD_ID,
                title: i18n_1.i18n.translate('dashboard.featureCatalogue.dashboardTitle', {
                    defaultMessage: 'Dashboard',
                }),
                description: i18n_1.i18n.translate('dashboard.featureCatalogue.dashboardDescription', {
                    defaultMessage: 'Display and share a collection of visualizations and saved searches.',
                }),
                icon: 'dashboardApp',
                path: `/app/kibana#${dashboard_constants_1.DashboardConstants.LANDING_PAGE_PATH}`,
                showOnHomePage: true,
                category: public_7.FeatureCatalogueCategory.DATA,
            });
        }
    }
    start(core, plugins) {
        const { notifications } = core;
        const { uiActions, data: { indexPatterns, search }, } = plugins;
        const SavedObjectFinder = public_3.getSavedObjectFinder(core.savedObjects, core.uiSettings);
        const changeViewAction = new application_1.ReplacePanelAction(core, SavedObjectFinder, notifications, plugins.embeddable.getEmbeddableFactories);
        uiActions.registerAction(changeViewAction);
        uiActions.attachAction(public_1.CONTEXT_MENU_TRIGGER, changeViewAction);
        const clonePanelAction = new application_1.ClonePanelAction(core);
        uiActions.registerAction(clonePanelAction);
        uiActions.attachAction(public_1.CONTEXT_MENU_TRIGGER, clonePanelAction);
        const savedDashboardLoader = saved_dashboards_1.createSavedDashboardLoader({
            savedObjectsClient: core.savedObjects.client,
            indexPatterns,
            search,
            chrome: core.chrome,
            overlays: core.overlays,
        });
        return {
            getSavedDashboardLoader: () => savedDashboardLoader,
        };
    }
    stop() {
        if (this.stopUrlTracking) {
            this.stopUrlTracking();
        }
    }
}
exports.DashboardPlugin = DashboardPlugin;
