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
const routes_1 = require("./routes");
const create_api_1 = require("./create_api");
const es_search_1 = require("./es_search");
const saved_objects_1 = require("../saved_objects");
class SearchService {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.searchStrategies = {};
    }
    setup(core) {
        const router = core.http.createRouter();
        routes_1.registerSearchRoute(router);
        this.contextContainer = core.context.createContextContainer();
        core.savedObjects.registerType(saved_objects_1.searchSavedObjectType);
        core.http.registerRouteHandlerContext('search', context => {
            return create_api_1.createApi({
                caller: context.core.elasticsearch.dataClient.callAsCurrentUser,
                searchStrategies: this.searchStrategies,
            });
        });
        const registerSearchStrategyProvider = (plugin, name, strategyProvider) => {
            this.searchStrategies[name] = this.contextContainer.createHandler(plugin, strategyProvider);
        };
        const api = {
            registerSearchStrategyContext: this.contextContainer.registerContext,
            registerSearchStrategyProvider,
        };
        api.registerSearchStrategyContext(this.initializerContext.opaqueId, 'core', () => core);
        api.registerSearchStrategyContext(this.initializerContext.opaqueId, 'config$', () => this.initializerContext.config.legacy.globalConfig$);
        api.registerSearchStrategyProvider(this.initializerContext.opaqueId, es_search_1.ES_SEARCH_STRATEGY, es_search_1.esSearchStrategyProvider);
        return api;
    }
    start() { }
    stop() { }
}
exports.SearchService = SearchService;
