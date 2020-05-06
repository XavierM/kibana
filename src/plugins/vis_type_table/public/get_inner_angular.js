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
// inner angular imports
// these are necessary to bootstrap the local angular.
// They can stay even after NP cutover
const angular_1 = tslib_1.__importDefault(require("angular"));
// required for `ngSanitize` angular module
require("angular-sanitize");
require("angular-recursion");
const angular_2 = require("@kbn/i18n/angular");
const public_1 = require("../../kibana_legacy/public");
public_1.initAngularBootstrap();
const thirdPartyAngularDependencies = ['ngSanitize', 'ui.bootstrap', 'RecursionHelper'];
function getAngularModule(name, core, context) {
    const uiModule = getInnerAngular(name, core);
    public_1.configureAppAngularModule(uiModule, { core, env: context.env }, true);
    return uiModule;
}
exports.getAngularModule = getAngularModule;
let initialized = false;
function getInnerAngular(name = 'kibana/table_vis', core) {
    if (!initialized) {
        createLocalPrivateModule();
        createLocalI18nModule();
        createLocalConfigModule(core.uiSettings);
        createLocalPaginateModule();
        initialized = true;
    }
    return angular_1.default
        .module(name, [
        ...thirdPartyAngularDependencies,
        'tableVisPaginate',
        'tableVisConfig',
        'tableVisPrivate',
        'tableVisI18n',
    ])
        .config(public_1.watchMultiDecorator)
        .directive('kbnAccessibleClick', public_1.KbnAccessibleClickProvider);
}
exports.getInnerAngular = getInnerAngular;
function createLocalPrivateModule() {
    angular_1.default.module('tableVisPrivate', []).provider('Private', public_1.PrivateProvider);
}
function createLocalConfigModule(uiSettings) {
    angular_1.default.module('tableVisConfig', []).provider('config', function () {
        return {
            $get: () => ({
                get: (value) => {
                    return uiSettings ? uiSettings.get(value) : undefined;
                },
                // set method is used in agg_table mocha test
                set: (key, value) => {
                    return uiSettings ? uiSettings.set(key, value) : undefined;
                },
            }),
        };
    });
}
function createLocalI18nModule() {
    angular_1.default
        .module('tableVisI18n', [])
        .provider('i18n', angular_2.I18nProvider)
        .filter('i18n', angular_2.i18nFilter)
        .directive('i18nId', angular_2.i18nDirective);
}
function createLocalPaginateModule() {
    angular_1.default
        .module('tableVisPaginate', [])
        .directive('paginate', public_1.PaginateDirectiveProvider)
        .directive('paginateControls', public_1.PaginateControlsDirectiveProvider);
}
