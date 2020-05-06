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
const _pattern_cache_1 = require("./_pattern_cache");
const index_pattern_1 = require("./index_pattern");
const index_patterns_api_client_1 = require("./index_patterns_api_client");
const ensure_default_index_pattern_1 = require("./ensure_default_index_pattern");
const indexPatternCache = _pattern_cache_1.createIndexPatternCache();
class IndexPatternsService {
    constructor(core, savedObjectsClient, http) {
        this.getIds = async (refresh = false) => {
            if (!this.savedObjectsCache || refresh) {
                await this.refreshSavedObjectsCache();
            }
            if (!this.savedObjectsCache) {
                return [];
            }
            return this.savedObjectsCache.map(obj => obj?.id);
        };
        this.getTitles = async (refresh = false) => {
            if (!this.savedObjectsCache || refresh) {
                await this.refreshSavedObjectsCache();
            }
            if (!this.savedObjectsCache) {
                return [];
            }
            return this.savedObjectsCache.map(obj => obj?.attributes?.title);
        };
        this.getFields = async (fields, refresh = false) => {
            if (!this.savedObjectsCache || refresh) {
                await this.refreshSavedObjectsCache();
            }
            if (!this.savedObjectsCache) {
                return [];
            }
            return this.savedObjectsCache.map((obj) => {
                const result = {};
                fields.forEach((f) => (result[f] = obj[f] || obj?.attributes?.[f]));
                return result;
            });
        };
        this.getFieldsForTimePattern = (options = {}) => {
            return this.apiClient.getFieldsForTimePattern(options);
        };
        this.getFieldsForWildcard = (options = {}) => {
            return this.apiClient.getFieldsForWildcard(options);
        };
        this.clearCache = (id) => {
            this.savedObjectsCache = null;
            if (id) {
                indexPatternCache.clear(id);
            }
            else {
                indexPatternCache.clearAll();
            }
        };
        this.getCache = async () => {
            if (!this.savedObjectsCache) {
                await this.refreshSavedObjectsCache();
            }
            return this.savedObjectsCache;
        };
        this.getDefault = async () => {
            const defaultIndexPatternId = this.config.get('defaultIndex');
            if (defaultIndexPatternId) {
                return await this.get(defaultIndexPatternId);
            }
            return null;
        };
        this.get = async (id) => {
            const cache = indexPatternCache.get(id);
            if (cache) {
                return cache;
            }
            const indexPattern = await this.make(id);
            return indexPatternCache.set(id, indexPattern);
        };
        this.make = (id) => {
            const indexPattern = new index_pattern_1.IndexPattern(id, (cfg) => this.config.get(cfg), this.savedObjectsClient, this.apiClient, indexPatternCache);
            return indexPattern.init();
        };
        this.apiClient = new index_patterns_api_client_1.IndexPatternsApiClient(http);
        this.config = core.uiSettings;
        this.savedObjectsClient = savedObjectsClient;
        this.ensureDefaultIndexPattern = ensure_default_index_pattern_1.createEnsureDefaultIndexPattern(core);
    }
    async refreshSavedObjectsCache() {
        this.savedObjectsCache = (await this.savedObjectsClient.find({
            type: 'index-pattern',
            fields: ['title'],
            perPage: 10000,
        })).savedObjects;
    }
}
exports.IndexPatternsService = IndexPatternsService;
