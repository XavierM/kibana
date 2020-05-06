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
// required for `ngSanitize` angular module
require("angular-sanitize");
const angular_1 = require("@kbn/i18n/angular");
// @ts-ignore
const modules_1 = require("ui/modules");
const new_platform_1 = require("ui/new_platform");
exports.I18nContext = new_platform_1.npStart.core.i18n.Context;
function wrapInI18nContext(ComponentToWrap) {
    const ContextWrapper = props => {
        return (react_1.default.createElement(exports.I18nContext, null,
            react_1.default.createElement(ComponentToWrap, Object.assign({}, props))));
    };
    // Original propTypes from the wrapped component should be re-exposed
    // since it will be used by reactDirective Angular service
    // that will rely on propTypes to watch attributes with these names
    ContextWrapper.propTypes = ComponentToWrap.propTypes;
    return ContextWrapper;
}
exports.wrapInI18nContext = wrapInI18nContext;
modules_1.uiModules
    .get('i18n', ['ngSanitize'])
    .provider('i18n', angular_1.I18nProvider)
    .filter('i18n', angular_1.i18nFilter)
    .directive('i18nId', angular_1.i18nDirective);
