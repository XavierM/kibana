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
const config_1 = require("./config");
const plugin_1 = require("./plugin");
exports.config = {
    deprecations: ({ unused, renameFromRoot }) => [
        // In Kibana v7.8 plugin id was renamed from 'metrics' to 'vis_type_timeseries':
        renameFromRoot('metrics.enabled', 'vis_type_timeseries.enabled', true),
        renameFromRoot('metrics.chartResolution', 'vis_type_timeseries.chartResolution', true),
        renameFromRoot('metrics.minimumBucketSize', 'vis_type_timeseries.minimumBucketSize', true),
        // Unused properties which should be removed after releasing Kibana v8.0:
        unused('chartResolution'),
        unused('minimumBucketSize'),
    ],
    schema: config_1.config,
};
// @ts-ignore
var abstract_search_strategy_1 = require("./lib/search_strategies/strategies/abstract_search_strategy");
exports.AbstractSearchStrategy = abstract_search_strategy_1.AbstractSearchStrategy;
// @ts-ignore
var abstract_request_1 = require("./lib/search_strategies/search_requests/abstract_request");
exports.AbstractSearchRequest = abstract_request_1.AbstractSearchRequest;
// @ts-ignore
var default_search_capabilities_1 = require("./lib/search_strategies/default_search_capabilities");
exports.DefaultSearchCapabilities = default_search_capabilities_1.DefaultSearchCapabilities;
function plugin(initializerContext) {
    return new plugin_1.VisTypeTimeseriesPlugin(initializerContext);
}
exports.plugin = plugin;
