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
function isQueryFilter(filter) {
    return filter.query && !filter.meta;
}
function moveFiltersToQuery(searchSource) {
    const searchSource730 = {
        ...searchSource,
        filter: [],
        query: searchSource.query || {
            query: '',
            language: 'kuery',
        },
    };
    // I encountered at least one export from 7.0.0-alpha that was missing the filter property in here.
    // The maps data in esarchives actually has it, but I don't know how/when they created it.
    if (!searchSource.filter) {
        searchSource.filter = [];
    }
    searchSource.filter.forEach(filter => {
        if (isQueryFilter(filter)) {
            searchSource730.query = {
                query: filter.query.query_string ? filter.query.query_string.query : '',
                language: 'lucene',
            };
        }
        else {
            searchSource730.filter.push(filter);
        }
    });
    return searchSource730;
}
exports.moveFiltersToQuery = moveFiltersToQuery;
