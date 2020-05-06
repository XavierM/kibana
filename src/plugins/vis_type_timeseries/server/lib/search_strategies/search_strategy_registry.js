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
const abstract_search_strategy_1 = require("./strategies/abstract_search_strategy");
// @ts-ignore
const default_search_strategy_1 = require("./strategies/default_search_strategy");
// @ts-ignore
const extract_index_patterns_1 = require("../../../common/extract_index_patterns");
class SearchStrategyRegistry {
    constructor() {
        this.strategies = [];
        this.addStrategy(new default_search_strategy_1.DefaultSearchStrategy());
    }
    addStrategy(searchStrategy) {
        if (searchStrategy instanceof abstract_search_strategy_1.AbstractSearchStrategy) {
            this.strategies.unshift(searchStrategy);
        }
        return this.strategies;
    }
    async getViableStrategy(req, indexPattern) {
        for (const searchStrategy of this.strategies) {
            const { isViable, capabilities } = await searchStrategy.checkForViability(req, indexPattern);
            if (isViable) {
                return {
                    searchStrategy,
                    capabilities,
                };
            }
        }
    }
    async getViableStrategyForPanel(req, panel) {
        const indexPattern = extract_index_patterns_1.extractIndexPatterns(panel).join(',');
        return this.getViableStrategy(req, indexPattern);
    }
}
exports.SearchStrategyRegistry = SearchStrategyRegistry;
