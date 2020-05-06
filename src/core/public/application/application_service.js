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
const react_1 = tslib_1.__importDefault(require("react"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const history_1 = require("history");
const ui_1 = require("./ui");
const capabilities_1 = require("./capabilities");
const types_1 = require("./types");
const application_leave_1 = require("./application_leave");
const utils_1 = require("./utils");
// Mount functions with two arguments are assumed to expect deprecated `context` object.
const isAppMountDeprecated = (mount) => mount.length === 2;
function filterAvailable(m, capabilities) {
    return new Map([...m].filter(([id]) => capabilities.navLinks[id] === undefined || capabilities.navLinks[id] === true));
}
const findMounter = (mounters, appRoute) => [...mounters].find(([, mounter]) => mounter.appRoute === appRoute);
const getAppUrl = (mounters, appId, path = '') => {
    const appBasePath = mounters.get(appId)?.appRoute
        ? `/${mounters.get(appId).appRoute}`
        : `/app/${appId}`;
    return utils_1.appendAppPath(appBasePath, path);
};
const allApplicationsFilter = '__ALL__';
/**
 * Service that is responsible for registering new applications.
 * @internal
 */
class ApplicationService {
    constructor() {
        this.apps = new Map();
        this.mounters = new Map();
        this.capabilities = new capabilities_1.CapabilitiesService();
        this.appLeaveHandlers = new Map();
        this.currentAppId$ = new rxjs_1.BehaviorSubject(undefined);
        this.statusUpdaters$ = new rxjs_1.BehaviorSubject(new Map());
        this.subscriptions = [];
        this.stop$ = new rxjs_1.Subject();
        this.registrationClosed = false;
        this.setAppLeaveHandler = (appId, handler) => {
            this.appLeaveHandlers.set(appId, handler);
        };
        this.onBeforeUnload = (event) => {
            const currentAppId = this.currentAppId$.value;
            if (currentAppId === undefined) {
                return;
            }
            const action = application_leave_1.getLeaveAction(this.appLeaveHandlers.get(currentAppId));
            if (application_leave_1.isConfirmAction(action)) {
                event.preventDefault();
                // some browsers accept a string return value being the message displayed
                event.returnValue = action.text;
            }
        };
    }
    setup({ context, http: { basePath }, injectedMetadata, redirectTo = (path) => (window.location.href = path), history, }) {
        const basename = basePath.get();
        if (injectedMetadata.getLegacyMode()) {
            this.currentAppId$.next(injectedMetadata.getLegacyMetadata().app.id);
        }
        else {
            // Only setup history if we're not in legacy mode
            this.history = history || history_1.createBrowserHistory({ basename });
        }
        // If we do not have history available, use redirectTo to do a full page refresh.
        this.navigate = (url, state) => 
        // basePath not needed here because `history` is configured with basename
        this.history ? this.history.push(url, state) : redirectTo(basePath.prepend(url));
        this.mountContext = context.createContextContainer();
        const registerStatusUpdater = (application, updater$) => {
            const updaterId = Symbol();
            const subscription = updater$.subscribe(updater => {
                const nextValue = new Map(this.statusUpdaters$.getValue());
                nextValue.set(updaterId, {
                    application,
                    updater,
                });
                this.statusUpdaters$.next(nextValue);
            });
            this.subscriptions.push(subscription);
        };
        return {
            registerMountContext: this.mountContext.registerContext,
            register: (plugin, app) => {
                app = { appRoute: `/app/${app.id}`, ...app };
                if (this.registrationClosed) {
                    throw new Error(`Applications cannot be registered after "setup"`);
                }
                else if (this.apps.has(app.id)) {
                    throw new Error(`An application is already registered with the id "${app.id}"`);
                }
                else if (findMounter(this.mounters, app.appRoute)) {
                    throw new Error(`An application is already registered with the appRoute "${app.appRoute}"`);
                }
                else if (basename && app.appRoute.startsWith(basename)) {
                    throw new Error('Cannot register an application route that includes HTTP base path');
                }
                let handler;
                if (isAppMountDeprecated(app.mount)) {
                    handler = this.mountContext.createHandler(plugin, app.mount);
                    // eslint-disable-next-line no-console
                    console.warn(`App [${app.id}] is using deprecated mount context. Use core.getStartServices() instead.`);
                }
                else {
                    handler = app.mount;
                }
                const mount = async (params) => {
                    const unmount = await handler(params);
                    this.currentAppId$.next(app.id);
                    return unmount;
                };
                const { updater$, ...appProps } = app;
                this.apps.set(app.id, {
                    ...appProps,
                    status: app.status ?? types_1.AppStatus.accessible,
                    navLinkStatus: app.navLinkStatus ?? types_1.AppNavLinkStatus.default,
                    legacy: false,
                });
                if (updater$) {
                    registerStatusUpdater(app.id, updater$);
                }
                this.mounters.set(app.id, {
                    appRoute: app.appRoute,
                    appBasePath: basePath.prepend(app.appRoute),
                    mount,
                    unmountBeforeMounting: false,
                });
            },
            registerLegacyApp: app => {
                const appRoute = `/app/${app.id.split(':')[0]}`;
                if (this.registrationClosed) {
                    throw new Error('Applications cannot be registered after "setup"');
                }
                else if (this.apps.has(app.id)) {
                    throw new Error(`An application is already registered with the id "${app.id}"`);
                }
                else if (basename && appRoute.startsWith(basename)) {
                    throw new Error('Cannot register an application route that includes HTTP base path');
                }
                const appBasePath = basePath.prepend(appRoute);
                const mount = () => redirectTo(appBasePath);
                const { updater$, ...appProps } = app;
                this.apps.set(app.id, {
                    ...appProps,
                    status: app.status ?? types_1.AppStatus.accessible,
                    navLinkStatus: app.navLinkStatus ?? types_1.AppNavLinkStatus.default,
                    legacy: true,
                });
                if (updater$) {
                    registerStatusUpdater(app.id, updater$);
                }
                this.mounters.set(app.id, {
                    appRoute,
                    appBasePath,
                    mount,
                    unmountBeforeMounting: true,
                });
            },
            registerAppUpdater: (appUpdater$) => registerStatusUpdater(allApplicationsFilter, appUpdater$),
        };
    }
    async start({ http, overlays }) {
        if (!this.mountContext) {
            throw new Error('ApplicationService#setup() must be invoked before start.');
        }
        this.registrationClosed = true;
        window.addEventListener('beforeunload', this.onBeforeUnload);
        const { capabilities } = await this.capabilities.start({
            appIds: [...this.mounters.keys()],
            http,
        });
        const availableMounters = filterAvailable(this.mounters, capabilities);
        const availableApps = filterAvailable(this.apps, capabilities);
        const applications$ = new rxjs_1.BehaviorSubject(availableApps);
        this.statusUpdaters$
            .pipe(operators_1.map(statusUpdaters => {
            return new Map([...availableApps].map(([id, app]) => [
                id,
                updateStatus(app, [...statusUpdaters.values()]),
            ]));
        }))
            .subscribe(apps => applications$.next(apps));
        const applicationStatuses$ = applications$.pipe(operators_1.map(apps => new Map([...apps.entries()].map(([id, app]) => [id, app.status]))), operators_1.shareReplay(1));
        return {
            applications$,
            capabilities,
            currentAppId$: this.currentAppId$.pipe(operators_1.filter(appId => appId !== undefined), operators_1.distinctUntilChanged(), operators_1.takeUntil(this.stop$)),
            registerMountContext: this.mountContext.registerContext,
            getUrlForApp: (appId, { path, absolute = false } = {}) => {
                const relUrl = http.basePath.prepend(getAppUrl(availableMounters, appId, path));
                return absolute ? relativeToAbsolute(relUrl) : relUrl;
            },
            navigateToApp: async (appId, { path, state } = {}) => {
                if (await this.shouldNavigate(overlays)) {
                    if (path === undefined) {
                        path = applications$.value.get(appId)?.defaultPath;
                    }
                    this.appLeaveHandlers.delete(this.currentAppId$.value);
                    this.navigate(getAppUrl(availableMounters, appId, path), state);
                    this.currentAppId$.next(appId);
                }
            },
            getComponent: () => {
                if (!this.history) {
                    return null;
                }
                return (react_1.default.createElement(ui_1.AppRouter, { history: this.history, mounters: availableMounters, "appStatuses$": applicationStatuses$, setAppLeaveHandler: this.setAppLeaveHandler }));
            },
        };
    }
    async shouldNavigate(overlays) {
        const currentAppId = this.currentAppId$.value;
        if (currentAppId === undefined) {
            return true;
        }
        const action = application_leave_1.getLeaveAction(this.appLeaveHandlers.get(currentAppId));
        if (application_leave_1.isConfirmAction(action)) {
            const confirmed = await overlays.openConfirm(action.text, {
                title: action.title,
                'data-test-subj': 'appLeaveConfirmModal',
            });
            if (!confirmed) {
                return false;
            }
        }
        return true;
    }
    stop() {
        this.stop$.next();
        this.currentAppId$.complete();
        this.statusUpdaters$.complete();
        this.subscriptions.forEach(sub => sub.unsubscribe());
        window.removeEventListener('beforeunload', this.onBeforeUnload);
    }
}
exports.ApplicationService = ApplicationService;
const updateStatus = (app, statusUpdaters) => {
    let changes = {};
    statusUpdaters.forEach(wrapper => {
        if (wrapper.application !== allApplicationsFilter && wrapper.application !== app.id) {
            return;
        }
        const fields = wrapper.updater(app);
        if (fields) {
            changes = {
                ...changes,
                ...fields,
                // status and navLinkStatus enums are ordered by reversed priority
                // if multiple updaters wants to change these fields, we will always follow the priority order.
                status: Math.max(changes.status ?? 0, fields.status ?? 0),
                navLinkStatus: Math.max(changes.navLinkStatus ?? 0, fields.navLinkStatus ?? 0),
            };
        }
    });
    return {
        ...app,
        ...changes,
    };
};
function relativeToAbsolute(url) {
    // convert all link urls to absolute urls
    const a = document.createElement('a');
    a.setAttribute('href', url);
    return a.href;
}
