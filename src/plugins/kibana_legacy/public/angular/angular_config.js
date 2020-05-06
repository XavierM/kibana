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
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const Rx = tslib_1.__importStar(require("rxjs"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const utils_1 = require("../../../../core/utils");
const public_1 = require("../../../kibana_react/public");
const utils_2 = require("../utils");
const lib_1 = require("../notify/lib");
const URL_LIMIT_WARN_WITHIN = 1000;
/**
 * Detects whether a given angular route is a dummy route that doesn't
 * require any action. There are two ways this can happen:
 * If `outerAngularWrapperRoute` is set on the route config object,
 * it means the local application service set up this route on the outer angular
 * and the internal routes will handle the hooks.
 *
 * If angular did not detect a route and it is the local angular, we are currently
 * navigating away from a URL controlled by a local angular router and the
 * application will get unmounted. In this case the outer router will handle
 * the hooks.
 * @param $route Injected $route dependency
 * @param isLocalAngular Flag whether this is the local angular router
 */
function isDummyRoute($route, isLocalAngular) {
    return (($route.current && $route.current.$$route && $route.current.$$route.outerAngularWrapperRoute) ||
        (!$route.current && isLocalAngular));
}
exports.configureAppAngularModule = (angularModule, newPlatform, isLocalAngular) => {
    const core = 'core' in newPlatform ? newPlatform.core : newPlatform;
    const packageInfo = 'env' in newPlatform
        ? newPlatform.env.packageInfo
        : newPlatform.injectedMetadata.getLegacyMetadata();
    if ('injectedMetadata' in newPlatform) {
        lodash_1.forOwn(newPlatform.injectedMetadata.getInjectedVars(), (val, name) => {
            if (name !== undefined) {
                // The legacy platform modifies some of these values, clone to an unfrozen object.
                angularModule.value(name, lodash_1.cloneDeep(val));
            }
        });
    }
    angularModule
        .value('kbnVersion', packageInfo.version)
        .value('buildNum', packageInfo.buildNum)
        .value('buildSha', packageInfo.buildSha)
        .value('esUrl', getEsUrl(core))
        .value('uiCapabilities', core.application.capabilities)
        .config(setupCompileProvider('injectedMetadata' in newPlatform
        ? newPlatform.injectedMetadata.getLegacyMetadata().devMode
        : newPlatform.env.mode.dev))
        .config(setupLocationProvider())
        .config(exports.$setupXsrfRequestInterceptor(packageInfo.version))
        .run(capture$httpLoadingCount(core))
        .run($setupBreadcrumbsAutoClear(core, isLocalAngular))
        .run($setupBadgeAutoClear(core, isLocalAngular))
        .run($setupHelpExtensionAutoClear(core, isLocalAngular))
        .run($setupUrlOverflowHandling(core, isLocalAngular))
        .run($setupUICapabilityRedirect(core));
};
const getEsUrl = (newPlatform) => {
    const a = document.createElement('a');
    a.href = newPlatform.http.basePath.prepend('/elasticsearch');
    const protocolPort = /https/.test(a.protocol) ? 443 : 80;
    const port = a.port || protocolPort;
    return {
        host: a.hostname,
        port,
        protocol: a.protocol,
        pathname: a.pathname,
    };
};
const setupCompileProvider = (devMode) => ($compileProvider) => {
    if (!devMode) {
        $compileProvider.debugInfoEnabled(false);
    }
};
const setupLocationProvider = () => ($locationProvider) => {
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false,
        rewriteLinks: false,
    });
    $locationProvider.hashPrefix('');
};
exports.$setupXsrfRequestInterceptor = (version) => {
    // Configure jQuery prefilter
    jquery_1.default.ajaxPrefilter(({ kbnXsrfToken = true }, originalOptions, jqXHR) => {
        if (kbnXsrfToken) {
            jqXHR.setRequestHeader('kbn-version', version);
        }
    });
    return ($httpProvider) => {
        // Configure $httpProvider interceptor
        $httpProvider.interceptors.push(() => {
            return {
                request(opts) {
                    const { kbnXsrfToken = true } = opts;
                    if (kbnXsrfToken) {
                        lodash_1.set(opts, ['headers', 'kbn-version'], version);
                    }
                    return opts;
                },
            };
        });
    };
};
/**
 * Injected into angular module by ui/chrome angular integration
 * and adds a root-level watcher that will capture the count of
 * active $http requests on each digest loop and expose the count to
 * the core.loadingCount api
 */
const capture$httpLoadingCount = (newPlatform) => ($rootScope, $http) => {
    newPlatform.http.addLoadingCountSource(new Rx.Observable(observer => {
        const unwatch = $rootScope.$watch(() => {
            const reqs = $http.pendingRequests || [];
            observer.next(reqs.filter(req => !utils_2.isSystemApiRequest(req)).length);
        });
        return unwatch;
    }));
};
/**
 * integrates with angular to automatically redirect to home if required
 * capability is not met
 */
const $setupUICapabilityRedirect = (newPlatform) => ($rootScope, $injector) => {
    const isKibanaAppRoute = window.location.pathname.endsWith('/app/kibana');
    // this feature only works within kibana app for now after everything is
    // switched to the application service, this can be changed to handle all
    // apps.
    if (!isKibanaAppRoute) {
        return;
    }
    $rootScope.$on('$routeChangeStart', (event, { $$route: route } = {}) => {
        if (!route || !route.requireUICapability) {
            return;
        }
        if (!lodash_1.get(newPlatform.application.capabilities, route.requireUICapability)) {
            $injector.get('$location').url('/home');
            event.preventDefault();
        }
    });
};
/**
 * internal angular run function that will be called when angular bootstraps and
 * lets us integrate with the angular router so that we can automatically clear
 * the breadcrumbs if we switch to a Kibana app that does not use breadcrumbs correctly
 */
const $setupBreadcrumbsAutoClear = (newPlatform, isLocalAngular) => ($rootScope, $injector) => {
    // A flag used to determine if we should automatically
    // clear the breadcrumbs between angular route changes.
    let breadcrumbSetSinceRouteChange = false;
    const $route = $injector.has('$route') ? $injector.get('$route') : {};
    // reset breadcrumbSetSinceRouteChange any time the breadcrumbs change, even
    // if it was done directly through the new platform
    newPlatform.chrome.getBreadcrumbs$().subscribe({
        next() {
            breadcrumbSetSinceRouteChange = true;
        },
    });
    $rootScope.$on('$routeChangeStart', () => {
        breadcrumbSetSinceRouteChange = false;
    });
    $rootScope.$on('$routeChangeSuccess', () => {
        if (isDummyRoute($route, isLocalAngular)) {
            return;
        }
        const current = $route.current || {};
        if (breadcrumbSetSinceRouteChange || (current.$$route && current.$$route.redirectTo)) {
            return;
        }
        const k7BreadcrumbsProvider = current.k7Breadcrumbs;
        if (!k7BreadcrumbsProvider) {
            newPlatform.chrome.setBreadcrumbs([]);
            return;
        }
        try {
            newPlatform.chrome.setBreadcrumbs($injector.invoke(k7BreadcrumbsProvider));
        }
        catch (error) {
            if (lib_1.isAngularHttpError(error)) {
                error = lib_1.formatAngularHttpError(error);
            }
            newPlatform.fatalErrors.add(error, 'location');
        }
    });
};
/**
 * internal angular run function that will be called when angular bootstraps and
 * lets us integrate with the angular router so that we can automatically clear
 * the badge if we switch to a Kibana app that does not use the badge correctly
 */
const $setupBadgeAutoClear = (newPlatform, isLocalAngular) => ($rootScope, $injector) => {
    // A flag used to determine if we should automatically
    // clear the badge between angular route changes.
    let badgeSetSinceRouteChange = false;
    const $route = $injector.has('$route') ? $injector.get('$route') : {};
    $rootScope.$on('$routeChangeStart', () => {
        badgeSetSinceRouteChange = false;
    });
    $rootScope.$on('$routeChangeSuccess', () => {
        if (isDummyRoute($route, isLocalAngular)) {
            return;
        }
        const current = $route.current || {};
        if (badgeSetSinceRouteChange || (current.$$route && current.$$route.redirectTo)) {
            return;
        }
        const badgeProvider = current.badge;
        if (!badgeProvider) {
            newPlatform.chrome.setBadge(undefined);
            return;
        }
        try {
            newPlatform.chrome.setBadge($injector.invoke(badgeProvider));
        }
        catch (error) {
            if (lib_1.isAngularHttpError(error)) {
                error = lib_1.formatAngularHttpError(error);
            }
            newPlatform.fatalErrors.add(error, 'location');
        }
    });
};
/**
 * internal angular run function that will be called when angular bootstraps and
 * lets us integrate with the angular router so that we can automatically clear
 * the helpExtension if we switch to a Kibana app that does not set its own
 * helpExtension
 */
const $setupHelpExtensionAutoClear = (newPlatform, isLocalAngular) => ($rootScope, $injector) => {
    /**
     * reset helpExtensionSetSinceRouteChange any time the helpExtension changes, even
     * if it was done directly through the new platform
     */
    let helpExtensionSetSinceRouteChange = false;
    newPlatform.chrome.getHelpExtension$().subscribe({
        next() {
            helpExtensionSetSinceRouteChange = true;
        },
    });
    const $route = $injector.has('$route') ? $injector.get('$route') : {};
    $rootScope.$on('$routeChangeStart', () => {
        if (isDummyRoute($route, isLocalAngular)) {
            return;
        }
        helpExtensionSetSinceRouteChange = false;
    });
    $rootScope.$on('$routeChangeSuccess', () => {
        if (isDummyRoute($route, isLocalAngular)) {
            return;
        }
        const current = $route.current || {};
        if (helpExtensionSetSinceRouteChange || (current.$$route && current.$$route.redirectTo)) {
            return;
        }
        newPlatform.chrome.setHelpExtension(current.helpExtension);
    });
};
const $setupUrlOverflowHandling = (newPlatform, isLocalAngular) => ($location, $rootScope, $injector) => {
    const $route = $injector.has('$route') ? $injector.get('$route') : {};
    const urlOverflow = new utils_2.UrlOverflowService();
    const check = () => {
        if (isDummyRoute($route, isLocalAngular)) {
            return;
        }
        // disable long url checks when storing state in session storage
        if (newPlatform.uiSettings.get('state:storeInSessionStorage')) {
            return;
        }
        if ($location.path() === '/error/url-overflow') {
            return;
        }
        try {
            if (urlOverflow.check($location.absUrl()) <= URL_LIMIT_WARN_WITHIN) {
                newPlatform.notifications.toasts.addWarning({
                    title: i18n_1.i18n.translate('kibana_legacy.bigUrlWarningNotificationTitle', {
                        defaultMessage: 'The URL is big and Kibana might stop working',
                    }),
                    text: public_1.toMountPoint(react_1.default.createElement(react_1.Fragment, null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kibana_legacy.bigUrlWarningNotificationMessage", defaultMessage: "Either enable the {storeInSessionStorageParam} option\n                  in {advancedSettingsLink} or simplify the onscreen visuals.", values: {
                                storeInSessionStorageParam: react_1.default.createElement("code", null, "state:storeInSessionStorage"),
                                advancedSettingsLink: (react_1.default.createElement("a", { href: "#/management/kibana/settings" },
                                    react_1.default.createElement(react_2.FormattedMessage, { id: "kibana_legacy.bigUrlWarningNotificationMessage.advancedSettingsLinkText", defaultMessage: "advanced settings" }))),
                            } }))),
                });
            }
        }
        catch (e) {
            window.location.href = utils_1.modifyUrl(window.location.href, (parts) => {
                parts.hash = '#/error/url-overflow';
            });
            // force the browser to reload to that Kibana's potentially unstable state is unloaded
            window.location.reload();
        }
    };
    $rootScope.$on('$routeUpdate', check);
    $rootScope.$on('$routeChangeStart', check);
};
