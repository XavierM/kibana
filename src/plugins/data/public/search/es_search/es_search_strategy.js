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
const search_1 = require("../../../common/search");
const sync_search_strategy_1 = require("../sync_search_strategy");
const get_es_preference_1 = require("./get_es_preference");
exports.esSearchStrategyProvider = (context) => {
    const syncStrategyProvider = context.getSearchStrategy(sync_search_strategy_1.SYNC_SEARCH_STRATEGY);
    const { search } = syncStrategyProvider(context);
    return {
        search: (request, options) => {
            request.params = {
                preference: get_es_preference_1.getEsPreference(context.core.uiSettings),
                ...request.params,
            };
            return search({ ...request, serverStrategy: search_1.ES_SEARCH_STRATEGY }, options);
        },
    };
};
