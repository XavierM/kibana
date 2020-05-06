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
function findIndexPatternById(indexPatterns, id) {
    if (!Array.isArray(indexPatterns) || !id) {
        return;
    }
    return indexPatterns.find(o => o.id === id);
}
exports.findIndexPatternById = findIndexPatternById;
/**
 * Checks if the given defaultIndex exists and returns
 * the first available index pattern id if not
 */
function getFallbackIndexPatternId(indexPatterns, defaultIndex = '') {
    if (defaultIndex && findIndexPatternById(indexPatterns, defaultIndex)) {
        return defaultIndex;
    }
    return !indexPatterns || !indexPatterns.length || !indexPatterns[0].id ? '' : indexPatterns[0].id;
}
exports.getFallbackIndexPatternId = getFallbackIndexPatternId;
/**
 * A given index pattern id is checked for existence and a fallback is provided if it doesn't exist
 * The provided defaultIndex is usually configured in Advanced Settings, if it's also invalid
 * the first entry of the given list of Indexpatterns is used
 */
function getIndexPatternId(id = '', indexPatterns, defaultIndex = '') {
    if (!id || !findIndexPatternById(indexPatterns, id)) {
        return getFallbackIndexPatternId(indexPatterns, defaultIndex);
    }
    return id;
}
exports.getIndexPatternId = getIndexPatternId;
