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
const new_platform_1 = require("ui/new_platform");
const eui_1 = require("@elastic/eui");
const matchAllWithPrefix = (prefixOrApp) => `/${typeof prefixOrApp === 'string' ? prefixOrApp : prefixOrApp.id}/:tail*?`;
/**
 * To be able to migrate and shim parts of the Kibana app plugin
 * while still running some parts of it in the legacy world, this
 * service emulates the core application service while using the global
 * angular router to switch between apps without page reload.
 *
 * The id of the apps is used as prefix of the route - when switching between
 * to apps, the current application is unmounted.
 *
 * This service becomes unnecessary once the platform provides a central
 * router that handles switching between applications without page reload.
 */
class LocalApplicationService {
    constructor() {
        this.idGenerator = eui_1.htmlIdGenerator('kibanaAppLocalApp');
    }
    /**
     * Wires up listeners to handle mounting and unmounting of apps to
     * the legacy angular route manager. Once all apps within the Kibana
     * plugin are using the local route manager, this implementation can
     * be switched to a more lightweight implementation.
     *
     * @param angularRouteManager The current `ui/routes` instance
     */
    attachToAngular(angularRouteManager) {
        new_platform_1.npStart.plugins.kibanaLegacy.getApps().forEach(app => {
            const wrapperElementId = this.idGenerator();
            angularRouteManager.when(matchAllWithPrefix(app), {
                outerAngularWrapperRoute: true,
                reloadOnSearch: false,
                reloadOnUrl: false,
                template: `<div class="kbnLocalApplicationWrapper" id="${wrapperElementId}"></div>`,
                controller($scope) {
                    const element = document.getElementById(wrapperElementId);
                    let unmountHandler = null;
                    let isUnmounted = false;
                    $scope.$on('$destroy', () => {
                        if (unmountHandler) {
                            unmountHandler();
                        }
                        isUnmounted = true;
                    });
                    (async () => {
                        const params = {
                            element,
                            appBasePath: '',
                            onAppLeave: () => undefined,
                            // TODO: adapt to use Core's ScopedHistory
                            history: {},
                        };
                        unmountHandler = isAppMountDeprecated(app.mount)
                            ? await app.mount({ core: new_platform_1.npStart.core }, params)
                            : await app.mount(params);
                        // immediately unmount app if scope got destroyed in the meantime
                        if (isUnmounted) {
                            unmountHandler();
                        }
                    })();
                },
            });
            if (app.updater$) {
                app.updater$.subscribe(updater => {
                    const updatedFields = updater(app);
                    if (updatedFields && updatedFields.activeUrl) {
                        new_platform_1.npStart.core.chrome.navLinks.update(app.navLinkId || app.id, {
                            url: updatedFields.activeUrl,
                        });
                    }
                });
            }
        });
        new_platform_1.npStart.plugins.kibanaLegacy.getForwards().forEach(forwardDefinition => {
            angularRouteManager.when(matchAllWithPrefix(forwardDefinition.legacyAppId), {
                outerAngularWrapperRoute: true,
                reloadOnSearch: false,
                reloadOnUrl: false,
                template: '<span></span>',
                controller($location) {
                    const newPath = forwardDefinition.rewritePath($location.url());
                    new_platform_1.npStart.core.application.navigateToApp(forwardDefinition.newAppId, { path: newPath });
                },
            });
        });
        new_platform_1.npStart.plugins.kibanaLegacy
            .getLegacyAppAliases()
            .forEach(({ legacyAppId, newAppId, keepPrefix }) => {
            angularRouteManager.when(matchAllWithPrefix(legacyAppId), {
                resolveRedirectTo: ($location) => {
                    const url = $location.url();
                    return `/${newAppId}${keepPrefix ? url : url.replace(legacyAppId, '')}`;
                },
            });
        });
    }
}
exports.LocalApplicationService = LocalApplicationService;
exports.localApplicationService = new LocalApplicationService();
function isAppMountDeprecated(mount) {
    // Mount functions with two arguments are assumed to expect deprecated `context` object.
    return mount.length === 2;
}
