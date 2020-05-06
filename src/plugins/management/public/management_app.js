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
const React = tslib_1.__importStar(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const i18n_1 = require("@kbn/i18n");
const components_1 = require("./components");
class ManagementApp {
    constructor({ id, title, basePath, order = 100, mount }, getSections, registerLegacyApp, getLegacyManagementSections, getStartServices) {
        this.enabledStatus = true;
        this.id = id;
        this.title = title;
        this.basePath = basePath;
        this.order = order;
        this.mount = mount;
        registerLegacyApp({
            id: basePath.substr(1),
            title,
            mount: async ({}, params) => {
                let appUnmount;
                if (!this.enabledStatus) {
                    const [coreStart] = await getStartServices();
                    coreStart.application.navigateToApp('kibana#/management');
                    return () => { };
                }
                async function setBreadcrumbs(crumbs) {
                    const [coreStart] = await getStartServices();
                    coreStart.chrome.setBreadcrumbs([
                        {
                            text: i18n_1.i18n.translate('management.breadcrumb', {
                                defaultMessage: 'Management',
                            }),
                            href: '#/management',
                        },
                        ...crumbs,
                    ]);
                }
                react_dom_1.default.render(React.createElement(components_1.ManagementChrome, { getSections: getSections, selectedId: id, legacySections: getLegacyManagementSections().items, onMounted: async (element) => {
                        appUnmount = await mount({
                            basePath,
                            element,
                            setBreadcrumbs,
                        });
                    } }), params.element);
                return async () => {
                    appUnmount();
                    react_dom_1.default.unmountComponentAtNode(params.element);
                };
            },
        });
    }
    enable() {
        this.enabledStatus = true;
    }
    disable() {
        this.enabledStatus = false;
    }
    get enabled() {
        return this.enabledStatus;
    }
}
exports.ManagementApp = ManagementApp;
