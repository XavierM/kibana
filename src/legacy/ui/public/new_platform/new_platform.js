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
const history_1 = require("history");
const set_services_1 = require("./set_services");
const public_1 = require("../../../../core/public");
exports.npSetup = {
    core: null,
    plugins: {},
};
exports.npStart = {
    core: null,
    plugins: {},
};
/**
 * Only used by unit tests
 * @internal
 */
function __reset__() {
    exports.npSetup.core = null;
    exports.npSetup.plugins = {};
    exports.npStart.core = null;
    exports.npStart.plugins = {};
    legacyAppRegistered = false;
}
exports.__reset__ = __reset__;
function __setup__(coreSetup, plugins) {
    exports.npSetup.core = coreSetup;
    exports.npSetup.plugins = plugins;
    // Setup compatibility layer for AppService in legacy platform
    exports.npSetup.core.application.register = exports.legacyAppRegister;
    // Services that need to be set in the legacy platform since the legacy data
    // & vis plugins which previously provided them have been removed.
    set_services_1.setSetupServices(exports.npSetup);
}
exports.__setup__ = __setup__;
function __start__(coreStart, plugins) {
    exports.npStart.core = coreStart;
    exports.npStart.plugins = plugins;
    // Services that need to be set in the legacy platform since the legacy data
    // & vis plugins which previously provided them have been removed.
    set_services_1.setStartServices(exports.npStart);
}
exports.__start__ = __start__;
/** Flag used to ensure `legacyAppRegister` is only called once. */
let legacyAppRegistered = false;
/**
 * Exported for testing only. Use `npSetup.core.application.register` in legacy apps.
 * @internal
 */
exports.legacyAppRegister = (app) => {
    if (legacyAppRegistered) {
        throw new Error(`core.application.register may only be called once for legacy plugins.`);
    }
    legacyAppRegistered = true;
    require('ui/chrome').setRootController(app.id, ($scope, $element) => {
        const element = $element[0];
        // Root controller cannot return a Promise so use an internal async function and call it immediately
        (async () => {
            const appRoute = app.appRoute || `/app/${app.id}`;
            const appBasePath = exports.npSetup.core.http.basePath.prepend(appRoute);
            const params = {
                element,
                appBasePath,
                history: new public_1.ScopedHistory(history_1.createBrowserHistory({ basename: exports.npSetup.core.http.basePath.get() }), appRoute),
                onAppLeave: () => undefined,
            };
            const unmount = isAppMountDeprecated(app.mount)
                ? await app.mount({ core: exports.npStart.core }, params)
                : await app.mount(params);
            $scope.$on('$destroy', () => {
                unmount();
            });
        })();
    });
};
function isAppMountDeprecated(mount) {
    // Mount functions with two arguments are assumed to expect deprecated `context` object.
    return mount.length === 2;
}
