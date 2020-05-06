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
const react_dom_1 = require("react-dom");
const contexts_1 = require("./contexts");
const containers_1 = require("./containers");
const services_1 = require("../services");
const localStorageObjectClient = tslib_1.__importStar(require("../lib/local_storage_object_client"));
const tracker_1 = require("../services/tracker");
function renderApp({ I18nContext, notifications, docLinkVersion, elasticsearchUrl, usageCollection, element, }) {
    const trackUiMetric = tracker_1.createUsageTracker(usageCollection);
    trackUiMetric.load('opened_app');
    const storage = services_1.createStorage({
        engine: window.localStorage,
        prefix: 'sense:',
    });
    const history = services_1.createHistory({ storage });
    const settings = services_1.createSettings({ storage });
    const objectStorageClient = localStorageObjectClient.create(storage);
    react_dom_1.render(react_1.default.createElement(I18nContext, null,
        react_1.default.createElement(contexts_1.ServicesContextProvider, { value: {
                elasticsearchUrl,
                docLinkVersion,
                services: {
                    storage,
                    history,
                    settings,
                    notifications,
                    trackUiMetric,
                    objectStorageClient,
                },
            } },
            react_1.default.createElement(contexts_1.RequestContextProvider, null,
                react_1.default.createElement(contexts_1.EditorContextProvider, { settings: settings.toJSON() },
                    react_1.default.createElement(containers_1.Main, null))))), element);
    return () => react_dom_1.unmountComponentAtNode(element);
}
exports.renderApp = renderApp;
