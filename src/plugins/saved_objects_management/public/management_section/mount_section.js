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
const react_1 = tslib_1.__importStar(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const lib_1 = require("./../lib");
let allowedObjectTypes;
const SavedObjectsEditionPage = react_1.lazy(() => Promise.resolve().then(() => tslib_1.__importStar(require('./saved_objects_edition_page'))));
const SavedObjectsTablePage = react_1.lazy(() => Promise.resolve().then(() => tslib_1.__importStar(require('./saved_objects_table_page'))));
exports.mountManagementSection = async ({ core, mountParams, serviceRegistry, }) => {
    const [coreStart, { data }, pluginStart] = await core.getStartServices();
    const { element, basePath, setBreadcrumbs } = mountParams;
    if (allowedObjectTypes === undefined) {
        allowedObjectTypes = await lib_1.getAllowedTypes(coreStart.http);
    }
    const capabilities = coreStart.application.capabilities;
    react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(react_router_dom_1.HashRouter, { basename: basePath },
            react_1.default.createElement(react_router_dom_1.Switch, null,
                react_1.default.createElement(react_router_dom_1.Route, { path: '/:service/:id', exact: true },
                    react_1.default.createElement(RedirectToHomeIfUnauthorized, { capabilities: capabilities },
                        react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(eui_1.EuiLoadingSpinner, null) },
                            react_1.default.createElement(SavedObjectsEditionPage, { coreStart: coreStart, serviceRegistry: serviceRegistry, setBreadcrumbs: setBreadcrumbs })))),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/', exact: false },
                    react_1.default.createElement(RedirectToHomeIfUnauthorized, { capabilities: capabilities },
                        react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(eui_1.EuiLoadingSpinner, null) },
                            react_1.default.createElement(SavedObjectsTablePage, { coreStart: coreStart, dataStart: data, serviceRegistry: serviceRegistry, actionRegistry: pluginStart.actions, allowedTypes: allowedObjectTypes, setBreadcrumbs: setBreadcrumbs }))))))), element);
    return () => {
        react_dom_1.default.unmountComponentAtNode(element);
    };
};
const RedirectToHomeIfUnauthorized = ({ children, capabilities }) => {
    const allowed = capabilities?.management?.kibana?.objects ?? false;
    if (!allowed) {
        window.location.hash = '/home';
        return null;
    }
    return children;
};
