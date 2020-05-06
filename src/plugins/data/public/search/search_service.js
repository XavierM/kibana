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
const sync_search_strategy_1 = require("./sync_search_strategy");
const search_source_1 = require("./search_source");
const legacy_1 = require("./legacy");
const search_1 = require("../../common/search");
const es_search_1 = require("./es_search");
const search_interceptor_1 = require("./search_interceptor");
const aggs_1 = require("./aggs");
/**
 * The search plugin exposes two registration methods for other plugins:
 *  -  registerSearchStrategyProvider for plugins to add their own custom
 * search strategies
 *  -  registerSearchStrategyContext for plugins to expose information
 * and/or functionality for other search strategies to use
 *
 * It also comes with two search strategy implementations - SYNC_SEARCH_STRATEGY and ES_SEARCH_STRATEGY.
 */
class SearchService {
    constructor() {
        /**
         * A mapping of search strategies keyed by a unique identifier.  Plugins can use this unique identifier
         * to override certain strategy implementations.
         */
        this.searchStrategies = {};
        this.aggTypesRegistry = new aggs_1.AggTypesRegistry();
        this.registerSearchStrategyProvider = (name, strategyProvider) => {
            this.searchStrategies[name] = strategyProvider;
        };
        this.getSearchStrategy = (name) => {
            const strategyProvider = this.searchStrategies[name];
            if (!strategyProvider)
                throw new Error(`Search strategy ${name} not found`);
            return strategyProvider;
        };
    }
    setup(core, { expressions, packageInfo, query, getInternalStartServices }) {
        this.esClient = legacy_1.getEsClient(core.injectedMetadata, core.http, packageInfo);
        this.registerSearchStrategyProvider(sync_search_strategy_1.SYNC_SEARCH_STRATEGY, sync_search_strategy_1.syncSearchStrategyProvider);
        this.registerSearchStrategyProvider(search_1.ES_SEARCH_STRATEGY, es_search_1.esSearchStrategyProvider);
        const aggTypesSetup = this.aggTypesRegistry.setup();
        // register each agg type
        const aggTypes = aggs_1.getAggTypes({
            query,
            uiSettings: core.uiSettings,
            getInternalStartServices,
        });
        aggTypes.buckets.forEach(b => aggTypesSetup.registerBucket(b));
        aggTypes.metrics.forEach(m => aggTypesSetup.registerMetric(m));
        // register expression functions for each agg type
        const aggFunctions = aggs_1.getAggTypesFunctions();
        aggFunctions.forEach(fn => expressions.registerFunction(fn));
        return {
            aggs: {
                calculateAutoTimeExpression: aggs_1.getCalculateAutoTimeExpression(core.uiSettings),
                types: aggTypesSetup,
            },
            registerSearchStrategyProvider: this.registerSearchStrategyProvider,
        };
    }
    start(core, dependencies) {
        /**
         * A global object that intercepts all searches and provides convenience methods for cancelling
         * all pending search requests, as well as getting the number of pending search requests.
         * TODO: Make this modular so that apps can opt in/out of search collection, or even provide
         * their own search collector instances
         */
        this.searchInterceptor = new search_interceptor_1.SearchInterceptor(core.notifications.toasts, core.application, core.injectedMetadata.getInjectedVar('esRequestTimeout'));
        const aggTypesStart = this.aggTypesRegistry.start();
        const search = (request, options, strategyName) => {
            const strategyProvider = this.getSearchStrategy(strategyName || search_1.DEFAULT_SEARCH_STRATEGY);
            const searchStrategy = strategyProvider({
                core,
                getSearchStrategy: this.getSearchStrategy,
            });
            return this.searchInterceptor.search(searchStrategy.search, request, options);
        };
        const legacySearch = {
            esClient: this.esClient,
            AggConfig: aggs_1.AggConfig,
            AggType: aggs_1.AggType,
            aggTypeFieldFilters: aggs_1.aggTypeFieldFilters,
            FieldParamType: aggs_1.FieldParamType,
            MetricAggType: aggs_1.MetricAggType,
            parentPipelineAggHelper: aggs_1.parentPipelineAggHelper,
            siblingPipelineAggHelper: aggs_1.siblingPipelineAggHelper,
        };
        const searchSourceDependencies = {
            uiSettings: core.uiSettings,
            injectedMetadata: core.injectedMetadata,
            search,
            legacySearch,
        };
        return {
            aggs: {
                calculateAutoTimeExpression: aggs_1.getCalculateAutoTimeExpression(core.uiSettings),
                createAggConfigs: (indexPattern, configStates = [], schemas) => {
                    return new aggs_1.AggConfigs(indexPattern, configStates, {
                        fieldFormats: dependencies.fieldFormats,
                        typesRegistry: aggTypesStart,
                    });
                },
                types: aggTypesStart,
            },
            search,
            searchSource: {
                create: (fields) => new search_source_1.SearchSource(fields, searchSourceDependencies),
                fromJSON: search_source_1.createSearchSourceFromJSON(dependencies.indexPatterns, searchSourceDependencies),
            },
            setInterceptor: (searchInterceptor) => {
                // TODO: should an intercepror have a destroy method?
                this.searchInterceptor = searchInterceptor;
            },
            __LEGACY: legacySearch,
        };
    }
    stop() { }
}
exports.SearchService = SearchService;
