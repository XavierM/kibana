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
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_router_dom_1 = require("react-router-dom");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const advanced_settings_1 = require("./advanced_settings");
const title = i18n_1.i18n.translate('advancedSettings.advancedSettingsLabel', {
    defaultMessage: 'Advanced Settings',
});
const crumb = [{ text: title }];
const readOnlyBadge = {
    text: i18n_1.i18n.translate('advancedSettings.badge.readOnly.text', {
        defaultMessage: 'Read only',
    }),
    tooltip: i18n_1.i18n.translate('advancedSettings.badge.readOnly.tooltip', {
        defaultMessage: 'Unable to save advanced settings',
    }),
    iconType: 'glasses',
};
async function mountManagementSection(getStartServices, params, componentRegistry) {
    params.setBreadcrumbs(crumb);
    const [{ uiSettings, notifications, docLinks, application, chrome }] = await getStartServices();
    const canSave = application.capabilities.advancedSettings.save;
    if (!canSave) {
        chrome.setBadge(readOnlyBadge);
    }
    react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(react_router_dom_1.HashRouter, { basename: params.basePath },
            react_1.default.createElement(react_router_dom_1.Switch, null,
                react_1.default.createElement(react_router_dom_1.Route, { path: ['/:query', '/'] },
                    react_1.default.createElement(advanced_settings_1.AdvancedSettings, { enableSaving: canSave, toasts: notifications.toasts, dockLinks: docLinks.links, uiSettings: uiSettings, componentRegistry: componentRegistry }))))), params.element);
    return () => {
        react_dom_1.default.unmountComponentAtNode(params.element);
    };
}
exports.mountManagementSection = mountManagementSection;
