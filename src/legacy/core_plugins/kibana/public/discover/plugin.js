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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const angular_1 = tslib_1.__importDefault(require("angular"));
const public_1 = require("../../../../../plugins/data/public");
const register_feature_1 = require("./np_ready/register_feature");
require("./kibana_services");
const get_inner_angular_1 = require("./get_inner_angular");
const kibana_services_1 = require("./kibana_services");
const build_services_1 = require("./build_services");
const public_2 = require("../../../../../plugins/kibana_utils/public");
const innerAngularName = 'app/discover';
const embeddableAngularName = 'app/discoverEmbeddable';
/**
 * Contains Discover, one of the oldest parts of Kibana
 * There are 2 kinds of Angular bootstrapped for rendering, additionally to the main Angular
 * Discover provides embeddables, those contain a slimmer Angular
 */
class DiscoverPlugin {
    constructor() {
        this.servicesInitialized = false;
        this.innerAngularInitialized = false;
        this.embeddableInjector = null;
        this.getEmbeddableInjector = null;
        this.appStateUpdater = new rxjs_1.BehaviorSubject(() => ({}));
        this.stopUrlTracking = undefined;
    }
    setup(core, plugins) {
        const { appMounted, appUnMounted, stop: stopUrlTracker, setActiveUrl: setTrackedUrl, } = public_2.createKbnUrlTracker({
            // we pass getter here instead of plain `history`,
            // so history is lazily created (when app is mounted)
            // this prevents redundant `#` when not in discover app
            getHistory: kibana_services_1.getHistory,
            baseUrl: core.http.basePath.prepend('/app/kibana'),
            defaultSubUrl: '#/discover',
            storageKey: `lastUrl:${core.http.basePath.get()}:discover`,
            navLinkUpdater$: this.appStateUpdater,
            toastNotifications: core.notifications.toasts,
            stateParams: [
                {
                    kbnUrlKey: '_g',
                    stateUpdate$: plugins.data.query.state$.pipe(operators_1.filter(({ changes }) => !!(changes.globalFilters || changes.time || changes.refreshInterval)), operators_1.map(({ state }) => ({
                        ...state,
                        filters: state.filters?.filter(public_1.esFilters.isFilterPinned),
                    }))),
                },
            ],
        });
        kibana_services_1.setUrlTracker({ setTrackedUrl });
        this.stopUrlTracking = () => {
            stopUrlTracker();
        };
        this.getEmbeddableInjector = this.getInjector.bind(this);
        plugins.discover.docViews.setAngularInjectorGetter(this.getEmbeddableInjector);
        plugins.kibanaLegacy.registerLegacyApp({
            id: 'discover',
            title: 'Discover',
            updater$: this.appStateUpdater.asObservable(),
            navLinkId: 'kibana:discover',
            order: -1004,
            euiIconType: 'discoverApp',
            mount: async (params) => {
                if (!this.initializeServices) {
                    throw Error('Discover plugin method initializeServices is undefined');
                }
                if (!this.initializeInnerAngular) {
                    throw Error('Discover plugin method initializeInnerAngular is undefined');
                }
                appMounted();
                await this.initializeServices();
                await this.initializeInnerAngular();
                // make sure the index pattern list is up to date
                const [, { data: dataStart }] = await core.getStartServices();
                await dataStart.indexPatterns.clearCache();
                const { renderApp } = await Promise.resolve().then(() => tslib_1.__importStar(require('./np_ready/application')));
                const unmount = await renderApp(innerAngularName, params.element);
                return () => {
                    unmount();
                    appUnMounted();
                };
            },
        });
        register_feature_1.registerFeature(plugins.home);
        this.registerEmbeddable(core, plugins);
    }
    start(core, plugins) {
        // we need to register the application service at setup, but to render it
        // there are some start dependencies necessary, for this reason
        // initializeInnerAngular + initializeServices are assigned at start and used
        // when the application/embeddable is mounted
        this.initializeInnerAngular = async () => {
            if (this.innerAngularInitialized) {
                return;
            }
            // this is used by application mount and tests
            const module = get_inner_angular_1.getInnerAngularModule(innerAngularName, core, plugins);
            kibana_services_1.setAngularModule(module);
            this.innerAngularInitialized = true;
        };
        this.initializeServices = async () => {
            if (this.servicesInitialized) {
                return { core, plugins };
            }
            const services = await build_services_1.buildServices(core, plugins, kibana_services_1.getHistory);
            kibana_services_1.setServices(services);
            this.servicesInitialized = true;
            return { core, plugins };
        };
    }
    stop() {
        if (this.stopUrlTracking) {
            this.stopUrlTracking();
        }
    }
    /**
     * register embeddable with a slimmer embeddable version of inner angular
     */
    async registerEmbeddable(core, plugins) {
        const { SearchEmbeddableFactory } = await Promise.resolve().then(() => tslib_1.__importStar(require('./np_ready/embeddable')));
        if (!this.getEmbeddableInjector) {
            throw Error('Discover plugin method getEmbeddableInjector is undefined');
        }
        const getStartServices = async () => {
            const [coreStart, deps] = await core.getStartServices();
            return {
                executeTriggerActions: deps.uiActions.executeTriggerActions,
                isEditable: () => coreStart.application.capabilities.discover.save,
            };
        };
        const factory = new SearchEmbeddableFactory(getStartServices, this.getEmbeddableInjector);
        plugins.embeddable.registerEmbeddableFactory(factory.type, factory);
    }
    async getInjector() {
        if (!this.embeddableInjector) {
            if (!this.initializeServices) {
                throw Error('Discover plugin getEmbeddableInjector:  initializeServices is undefined');
            }
            const { core, plugins } = await this.initializeServices();
            get_inner_angular_1.getInnerAngularModuleEmbeddable(embeddableAngularName, core, plugins);
            const mountpoint = document.createElement('div');
            this.embeddableInjector = angular_1.default.bootstrap(mountpoint, [embeddableAngularName]);
        }
        return this.embeddableInjector;
    }
}
exports.DiscoverPlugin = DiscoverPlugin;
