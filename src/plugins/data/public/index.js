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
require("./index.scss");
/*
 * Filters:
 */
const common_1 = require("../common");
const filter_bar_1 = require("./ui/filter_bar");
const query_1 = require("./query");
// Filter helpers namespace:
exports.esFilters = {
    FilterLabel: filter_bar_1.FilterLabel,
    FILTERS: common_1.FILTERS,
    FilterStateStore: common_1.FilterStateStore,
    buildEmptyFilter: common_1.buildEmptyFilter,
    buildPhrasesFilter: common_1.buildPhrasesFilter,
    buildExistsFilter: common_1.buildExistsFilter,
    buildPhraseFilter: common_1.buildPhraseFilter,
    buildQueryFilter: common_1.buildQueryFilter,
    buildRangeFilter: common_1.buildRangeFilter,
    isPhraseFilter: common_1.isPhraseFilter,
    isExistsFilter: common_1.isExistsFilter,
    isPhrasesFilter: common_1.isPhrasesFilter,
    isRangeFilter: common_1.isRangeFilter,
    isMatchAllFilter: common_1.isMatchAllFilter,
    isMissingFilter: common_1.isMissingFilter,
    isQueryStringFilter: common_1.isQueryStringFilter,
    isFilterPinned: common_1.isFilterPinned,
    toggleFilterNegated: common_1.toggleFilterNegated,
    disableFilter: common_1.disableFilter,
    getPhraseFilterField: common_1.getPhraseFilterField,
    getPhraseFilterValue: common_1.getPhraseFilterValue,
    getDisplayValueFromFilter: common_1.getDisplayValueFromFilter,
    compareFilters: common_1.compareFilters,
    COMPARE_ALL_OPTIONS: common_1.COMPARE_ALL_OPTIONS,
    generateFilters: query_1.generateFilters,
    onlyDisabledFiltersChanged: query_1.onlyDisabledFiltersChanged,
    changeTimeFilter: query_1.changeTimeFilter,
    mapAndFlattenFilters: query_1.mapAndFlattenFilters,
    extractTimeFilter: query_1.extractTimeFilter,
};
/*
 * esQuery and esKuery:
 */
const common_2 = require("../common");
exports.esKuery = {
    nodeTypes: common_2.nodeTypes,
    fromKueryExpression: common_2.fromKueryExpression,
    toElasticsearchQuery: common_2.toElasticsearchQuery,
};
exports.esQuery = {
    buildEsQuery: common_2.buildEsQuery,
    getEsQueryConfig: common_2.getEsQueryConfig,
    buildQueryFromFilters: common_2.buildQueryFromFilters,
    luceneStringToDsl: common_2.luceneStringToDsl,
    decorateQuery: common_2.decorateQuery,
};
/*
 * Field Formatters:
 */
const field_formats_1 = require("../common/field_formats");
const field_formats_2 = require("./field_formats");
var field_formats_3 = require("./field_formats");
exports.baseFormattersPublic = field_formats_3.baseFormattersPublic;
// Field formats helpers namespace:
exports.fieldFormats = {
    FieldFormat: field_formats_1.FieldFormat,
    FieldFormatsRegistry: field_formats_1.FieldFormatsRegistry,
    serialize: field_formats_1.serializeFieldFormat,
    DEFAULT_CONVERTER_COLOR: field_formats_1.DEFAULT_CONVERTER_COLOR,
    HTML_CONTEXT_TYPE: field_formats_1.HTML_CONTEXT_TYPE,
    TEXT_CONTEXT_TYPE: field_formats_1.TEXT_CONTEXT_TYPE,
    FIELD_FORMAT_IDS: field_formats_1.FIELD_FORMAT_IDS,
    BoolFormat: field_formats_1.BoolFormat,
    BytesFormat: field_formats_1.BytesFormat,
    ColorFormat: field_formats_1.ColorFormat,
    DateFormat: field_formats_2.DateFormat,
    DateNanosFormat: field_formats_1.DateNanosFormat,
    DurationFormat: field_formats_1.DurationFormat,
    IpFormat: field_formats_1.IpFormat,
    NumberFormat: field_formats_1.NumberFormat,
    PercentFormat: field_formats_1.PercentFormat,
    RelativeDateFormat: field_formats_1.RelativeDateFormat,
    SourceFormat: field_formats_1.SourceFormat,
    StaticLookupFormat: field_formats_1.StaticLookupFormat,
    UrlFormat: field_formats_1.UrlFormat,
    StringFormat: field_formats_1.StringFormat,
    TruncateFormat: field_formats_1.TruncateFormat,
};
var common_3 = require("../common");
exports.FieldFormat = common_3.FieldFormat;
/*
 * Index patterns:
 */
const common_4 = require("../common");
const index_patterns_1 = require("./index_patterns");
// Index patterns namespace:
exports.indexPatterns = {
    ILLEGAL_CHARACTERS_KEY: index_patterns_1.ILLEGAL_CHARACTERS_KEY,
    CONTAINS_SPACES_KEY: index_patterns_1.CONTAINS_SPACES_KEY,
    ILLEGAL_CHARACTERS_VISIBLE: index_patterns_1.ILLEGAL_CHARACTERS_VISIBLE,
    ILLEGAL_CHARACTERS: index_patterns_1.ILLEGAL_CHARACTERS,
    isDefault: index_patterns_1.isDefault,
    isFilterable: common_4.isFilterable,
    isNestedField: common_4.isNestedField,
    validate: index_patterns_1.validateIndexPattern,
    getFromSavedObject: index_patterns_1.getFromSavedObject,
    flattenHitWrapper: index_patterns_1.flattenHitWrapper,
    // TODO: exported only in stub_index_pattern test. Move into data plugin and remove export.
    getRoutes: index_patterns_1.getRoutes,
    formatHitProvider: index_patterns_1.formatHitProvider,
};
var index_patterns_2 = require("./index_patterns");
exports.IndexPattern = index_patterns_2.IndexPattern;
exports.IndexPatternField = index_patterns_2.Field;
// TODO: exported only in stub_index_pattern test. Move into data plugin and remove export.
exports.IndexPatternFieldList = index_patterns_2.FieldList;
exports.Field = index_patterns_2.Field;
var common_5 = require("../common");
exports.ES_FIELD_TYPES = common_5.ES_FIELD_TYPES;
exports.KBN_FIELD_TYPES = common_5.KBN_FIELD_TYPES;
/*
 * Autocomplete query suggestions:
 */
var autocomplete_1 = require("./autocomplete");
exports.QuerySuggestionTypes = autocomplete_1.QuerySuggestionTypes;
/*
 * Search:
 */
const search_1 = require("./search");
const common_6 = require("../common");
var search_2 = require("./search");
// aggs
exports.AggGroupNames = search_2.AggGroupNames;
exports.AggParamType = search_2.AggParamType;
exports.AggTypeFieldFilters = search_2.AggTypeFieldFilters;
exports.AggTypeFilters = search_2.AggTypeFilters;
exports.BUCKET_TYPES = search_2.BUCKET_TYPES;
exports.METRIC_TYPES = search_2.METRIC_TYPES;
exports.OptionedParamType = search_2.OptionedParamType;
// search
exports.ES_SEARCH_STRATEGY = search_2.ES_SEARCH_STRATEGY;
exports.SYNC_SEARCH_STRATEGY = search_2.SYNC_SEARCH_STRATEGY;
exports.getEsPreference = search_2.getEsPreference;
exports.getSearchErrorType = search_2.getSearchErrorType;
exports.SearchError = search_2.SearchError;
exports.SortDirection = search_2.SortDirection;
exports.SearchInterceptor = search_2.SearchInterceptor;
exports.RequestTimeoutError = search_2.RequestTimeoutError;
// Search namespace
exports.search = {
    aggs: {
        AggConfigs: search_1.AggConfigs,
        aggGroupNamesMap: search_1.aggGroupNamesMap,
        aggTypeFilters: search_1.aggTypeFilters,
        CidrMask: search_1.CidrMask,
        convertDateRangeToString: search_1.convertDateRangeToString,
        convertIPRangeToString: search_1.convertIPRangeToString,
        dateHistogramInterval: common_6.dateHistogramInterval,
        intervalOptions: search_1.intervalOptions,
        InvalidEsCalendarIntervalError: // only used in Discover
        common_6.InvalidEsCalendarIntervalError,
        InvalidEsIntervalFormatError: common_6.InvalidEsIntervalFormatError,
        isDateHistogramBucketAggConfig: search_1.isDateHistogramBucketAggConfig,
        isNumberType: search_1.isNumberType,
        isStringType: search_1.isStringType,
        isType: search_1.isType,
        isValidEsInterval: common_6.isValidEsInterval,
        isValidInterval: common_6.isValidInterval,
        parentPipelineType: search_1.parentPipelineType,
        parseEsInterval: common_6.parseEsInterval,
        parseInterval: common_6.parseInterval,
        propFilter: search_1.propFilter,
        siblingPipelineType: search_1.siblingPipelineType,
        termsAggFilter: search_1.termsAggFilter,
        toAbsoluteDates: common_6.toAbsoluteDates,
    },
    getRequestInspectorStats: search_1.getRequestInspectorStats,
    getResponseInspectorStats: search_1.getResponseInspectorStats,
    tabifyAggResponse: search_1.tabifyAggResponse,
    tabifyGetColumns: search_1.tabifyGetColumns,
};
/*
 * UI components
 */
var ui_1 = require("./ui");
exports.SearchBar = ui_1.SearchBar;
exports.FilterBar = ui_1.FilterBar;
exports.QueryStringInput = ui_1.QueryStringInput;
exports.IndexPatternSelect = ui_1.IndexPatternSelect;
var query_2 = require("./query");
exports.createSavedQueryService = query_2.createSavedQueryService;
exports.connectToQueryState = query_2.connectToQueryState;
exports.syncQueryStateWithUrl = query_2.syncQueryStateWithUrl;
exports.getTime = query_2.getTime;
exports.getQueryLog = query_2.getQueryLog;
exports.getDefaultQuery = query_2.getDefaultQuery;
exports.FilterManager = query_2.FilterManager;
exports.TimeHistory = query_2.TimeHistory;
var common_7 = require("../common");
// kbn field types
exports.castEsToKbnFieldTypeName = common_7.castEsToKbnFieldTypeName;
exports.getKbnTypeNames = common_7.getKbnTypeNames;
/*
 * Plugin setup
 */
const plugin_1 = require("./plugin");
exports.Plugin = plugin_1.DataPublicPlugin;
function plugin(initializerContext) {
    return new plugin_1.DataPublicPlugin(initializerContext);
}
exports.plugin = plugin;
