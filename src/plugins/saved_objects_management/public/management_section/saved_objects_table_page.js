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
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const objects_table_1 = require("./objects_table");
const SavedObjectsTablePage = ({ coreStart, dataStart, allowedTypes, serviceRegistry, actionRegistry, setBreadcrumbs, }) => {
    const capabilities = coreStart.application.capabilities;
    const itemsPerPage = coreStart.uiSettings.get('savedObjects:perPage', 50);
    react_1.useEffect(() => {
        setBreadcrumbs([
            {
                text: i18n_1.i18n.translate('savedObjectsManagement.breadcrumb.index', {
                    defaultMessage: 'Saved objects',
                }),
                href: '#/management/kibana/objects',
            },
        ]);
    }, [setBreadcrumbs]);
    return (react_1.default.createElement(objects_table_1.SavedObjectsTable, { allowedTypes: allowedTypes, serviceRegistry: serviceRegistry, actionRegistry: actionRegistry, savedObjectsClient: coreStart.savedObjects.client, indexPatterns: dataStart.indexPatterns, search: dataStart.search, http: coreStart.http, overlays: coreStart.overlays, notifications: coreStart.notifications, applications: coreStart.application, perPageConfig: itemsPerPage, goInspectObject: savedObject => {
            const { editUrl } = savedObject.meta;
            if (editUrl) {
                // previously, kbnUrl.change(object.meta.editUrl); was used.
                // using direct access to location.hash seems the only option for now,
                // as using react-router-dom will prefix the url with the router's basename
                // which should be ignored there.
                window.location.hash = editUrl;
            }
        }, canGoInApp: savedObject => {
            const { inAppUrl } = savedObject.meta;
            return inAppUrl ? lodash_1.get(capabilities, inAppUrl.uiCapabilitiesPath) : false;
        } }));
};
exports.default = SavedObjectsTablePage;
