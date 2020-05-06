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
const public_1 = require("../../kibana_utils/public");
const autocomplete_1 = require("./autocomplete");
const search_service_1 = require("./search/search_service");
const field_formats_1 = require("./field_formats");
const query_1 = require("./query");
const index_pattern_select_1 = require("./ui/index_pattern_select");
const index_patterns_1 = require("./index_patterns");
const services_1 = require("./services");
const create_search_bar_1 = require("./ui/search_bar/create_search_bar");
const expressions_1 = require("./search/expressions");
const public_2 = require("../../ui_actions/public");
const actions_1 = require("./actions");
const select_range_action_1 = require("./actions/select_range_action");
const value_click_action_1 = require("./actions/value_click_action");
class DataPublicPlugin {
    constructor(initializerContext) {
        this.autocomplete = new autocomplete_1.AutocompleteService();
        this.searchService = new search_service_1.SearchService();
        this.queryService = new query_1.QueryService();
        this.fieldFormatsService = new field_formats_1.FieldFormatsService();
        this.storage = new public_1.Storage(window.localStorage);
        this.packageInfo = initializerContext.env.packageInfo;
    }
    setup(core, { expressions, uiActions }) {
        const startServices = public_1.createStartServicesGetter(core.getStartServices);
        const getInternalStartServices = () => {
            const { core: coreStart, self } = startServices();
            return {
                fieldFormats: self.fieldFormats,
                notifications: coreStart.notifications,
                uiSettings: coreStart.uiSettings,
                searchService: self.search,
                injectedMetadata: coreStart.injectedMetadata,
            };
        };
        expressions.registerFunction(expressions_1.esaggs);
        const queryService = this.queryService.setup({
            uiSettings: core.uiSettings,
            storage: this.storage,
        });
        uiActions.registerAction(actions_1.createFilterAction(queryService.filterManager, queryService.timefilter.timefilter));
        uiActions.attachAction(public_2.SELECT_RANGE_TRIGGER, select_range_action_1.selectRangeAction(queryService.filterManager, queryService.timefilter.timefilter));
        uiActions.attachAction(public_2.VALUE_CLICK_TRIGGER, value_click_action_1.valueClickAction(queryService.filterManager, queryService.timefilter.timefilter));
        return {
            autocomplete: this.autocomplete.setup(core),
            search: this.searchService.setup(core, {
                expressions,
                getInternalStartServices,
                packageInfo: this.packageInfo,
                query: queryService,
            }),
            fieldFormats: this.fieldFormatsService.setup(core),
            query: queryService,
        };
    }
    start(core, { uiActions }) {
        const { uiSettings, http, notifications, savedObjects, overlays } = core;
        services_1.setHttp(http);
        services_1.setNotifications(notifications);
        services_1.setOverlays(overlays);
        services_1.setUiSettings(uiSettings);
        services_1.setInjectedMetadata(core.injectedMetadata);
        const fieldFormats = this.fieldFormatsService.start();
        services_1.setFieldFormats(fieldFormats);
        const indexPatterns = new index_patterns_1.IndexPatternsService(core, savedObjects.client, http);
        services_1.setIndexPatterns(indexPatterns);
        const query = this.queryService.start(savedObjects);
        services_1.setQueryService(query);
        const search = this.searchService.start(core, {
            indexPatterns,
            fieldFormats,
        });
        services_1.setSearchService(search);
        uiActions.attachAction(public_2.APPLY_FILTER_TRIGGER, uiActions.getAction(actions_1.ACTION_GLOBAL_APPLY_FILTER));
        const dataServices = {
            actions: {
                createFiltersFromValueClickAction: actions_1.createFiltersFromValueClickAction,
                createFiltersFromRangeSelectAction: actions_1.createFiltersFromRangeSelectAction,
            },
            autocomplete: this.autocomplete.start(),
            fieldFormats,
            indexPatterns,
            query,
            search,
        };
        const SearchBar = create_search_bar_1.createSearchBar({
            core,
            data: dataServices,
            storage: this.storage,
        });
        return {
            ...dataServices,
            ui: {
                IndexPatternSelect: index_pattern_select_1.createIndexPatternSelect(core.savedObjects.client),
                SearchBar,
            },
        };
    }
    stop() {
        this.autocomplete.clearProviders();
    }
}
exports.DataPublicPlugin = DataPublicPlugin;
