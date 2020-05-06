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
const i18n_1 = require("@kbn/i18n");
const doc_views_registry_1 = require("./doc_views/doc_views_registry");
const table_1 = require("./components/table/table");
const json_code_block_1 = require("./components/json_code_block/json_code_block");
const doc_viewer_1 = require("./components/doc_viewer/doc_viewer");
const services_1 = require("./services");
const saved_searches_1 = require("./saved_searches");
require("./index.scss");
/**
 * Contains Discover, one of the oldest parts of Kibana
 * There are 2 kinds of Angular bootstrapped for rendering, additionally to the main Angular
 * Discover provides embeddables, those contain a slimmer Angular
 */
class DiscoverPlugin {
    constructor() {
        this.docViewsRegistry = null;
    }
    setup(core) {
        this.docViewsRegistry = new doc_views_registry_1.DocViewsRegistry();
        services_1.setDocViewsRegistry(this.docViewsRegistry);
        this.docViewsRegistry.addDocView({
            title: i18n_1.i18n.translate('discover.docViews.table.tableTitle', {
                defaultMessage: 'Table',
            }),
            order: 10,
            component: table_1.DocViewTable,
        });
        this.docViewsRegistry.addDocView({
            title: i18n_1.i18n.translate('discover.docViews.json.jsonTitle', {
                defaultMessage: 'JSON',
            }),
            order: 20,
            component: json_code_block_1.JsonCodeBlock,
        });
        return {
            docViews: {
                addDocView: this.docViewsRegistry.addDocView.bind(this.docViewsRegistry),
                setAngularInjectorGetter: this.docViewsRegistry.setAngularInjectorGetter.bind(this.docViewsRegistry),
            },
        };
    }
    start() {
        return {
            docViews: {
                DocViewer: doc_viewer_1.DocViewer,
            },
            savedSearches: {
                createLoader: saved_searches_1.createSavedSearchesLoader,
            },
        };
    }
}
exports.DiscoverPlugin = DiscoverPlugin;
