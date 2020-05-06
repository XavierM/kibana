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
require("./index.scss");
const eui_1 = require("@elastic/eui");
const angular_1 = tslib_1.__importDefault(require("angular"));
// required for `ngSanitize` angular module
require("angular-sanitize");
const angular_2 = require("@kbn/i18n/angular");
// @ts-ignore
const legacy_app_1 = require("./legacy_app");
const public_1 = require("../../../kibana_legacy/public");
let angularModuleInstance = null;
exports.renderApp = (element, appBasePath, deps) => {
    if (!angularModuleInstance) {
        angularModuleInstance = createLocalAngularModule(deps.core, deps.navigation);
        // global routing stuff
        public_1.configureAppAngularModule(angularModuleInstance, { core: deps.core, env: deps.pluginInitializerContext.env }, true);
        legacy_app_1.initDashboardApp(angularModuleInstance, deps);
    }
    const $injector = mountDashboardApp(appBasePath, element);
    return () => {
        $injector.get('$rootScope').$destroy();
    };
};
const mainTemplate = (basePath) => `<div ng-view class="kbnLocalApplicationWrapper">
  <base href="${basePath}" />
</div>`;
const moduleName = 'app/dashboard';
const thirdPartyAngularDependencies = ['ngSanitize', 'ngRoute', 'react'];
function mountDashboardApp(appBasePath, element) {
    const mountpoint = document.createElement('div');
    mountpoint.setAttribute('class', 'kbnLocalApplicationWrapper');
    // eslint-disable-next-line
    mountpoint.innerHTML = mainTemplate(appBasePath);
    // bootstrap angular into detached element and attach it later to
    // make angular-within-angular possible
    const $injector = angular_1.default.bootstrap(mountpoint, [moduleName]);
    // initialize global state handler
    element.appendChild(mountpoint);
    return $injector;
}
function createLocalAngularModule(core, navigation) {
    createLocalI18nModule();
    createLocalIconModule();
    const dashboardAngularModule = angular_1.default.module(moduleName, [
        ...thirdPartyAngularDependencies,
        'app/dashboard/I18n',
        'app/dashboard/icon',
    ]);
    return dashboardAngularModule;
}
function createLocalIconModule() {
    angular_1.default
        .module('app/dashboard/icon', ['react'])
        .directive('icon', reactDirective => reactDirective(eui_1.EuiIcon));
}
function createLocalI18nModule() {
    angular_1.default
        .module('app/dashboard/I18n', [])
        .provider('i18n', angular_2.I18nProvider)
        .filter('i18n', angular_2.i18nFilter)
        .directive('i18nId', angular_2.i18nDirective);
}
