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
const public_1 = require("../../data/public");
// @ts-ignore
const vega_parser_1 = require("./data_model/vega_parser");
// @ts-ignore
const search_cache_1 = require("./data_model/search_cache");
// @ts-ignore
const time_cache_1 = require("./data_model/time_cache");
const services_1 = require("./services");
function createVegaRequestHandler({ plugins: { data }, core: { uiSettings }, serviceSettings, }) {
    let searchCache;
    const { timefilter } = data.query.timefilter;
    const timeCache = new time_cache_1.TimeCache(timefilter, 3 * 1000);
    return ({ timeRange, filters, query, visParams }) => {
        if (!searchCache) {
            searchCache = new search_cache_1.SearchCache(services_1.getData().search.__LEGACY.esClient, {
                max: 10,
                maxAge: 4 * 1000,
            });
        }
        timeCache.setTimeRange(timeRange);
        const esQueryConfigs = public_1.esQuery.getEsQueryConfig(uiSettings);
        const filtersDsl = public_1.esQuery.buildEsQuery(undefined, query, filters, esQueryConfigs);
        const vp = new vega_parser_1.VegaParser(visParams.spec, searchCache, timeCache, filtersDsl, serviceSettings);
        return vp.parseAsync();
    };
}
exports.createVegaRequestHandler = createVegaRequestHandler;
