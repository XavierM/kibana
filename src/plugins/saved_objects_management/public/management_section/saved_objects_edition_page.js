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
const react_router_dom_1 = require("react-router-dom");
const query_string_1 = require("query-string");
const i18n_1 = require("@kbn/i18n");
const object_view_1 = require("./object_view");
const SavedObjectsEditionPage = ({ coreStart, serviceRegistry, setBreadcrumbs, }) => {
    const { service: serviceName, id } = react_router_dom_1.useParams();
    const capabilities = coreStart.application.capabilities;
    const { search } = react_router_dom_1.useLocation();
    const query = query_string_1.parse(search);
    const service = serviceRegistry.get(serviceName);
    react_1.useEffect(() => {
        setBreadcrumbs([
            {
                text: i18n_1.i18n.translate('savedObjectsManagement.breadcrumb.index', {
                    defaultMessage: 'Saved objects',
                }),
                href: '#/management/kibana/objects',
            },
            {
                text: i18n_1.i18n.translate('savedObjectsManagement.breadcrumb.edit', {
                    defaultMessage: 'Edit {savedObjectType}',
                    values: { savedObjectType: service?.service.type ?? 'object' },
                }),
            },
        ]);
    }, [setBreadcrumbs, service]);
    return (react_1.default.createElement(object_view_1.SavedObjectEdition, { id: id, serviceName: serviceName, serviceRegistry: serviceRegistry, savedObjectsClient: coreStart.savedObjects.client, overlays: coreStart.overlays, notifications: coreStart.notifications, capabilities: capabilities, notFoundType: query.notFound }));
};
exports.default = SavedObjectsEditionPage;
