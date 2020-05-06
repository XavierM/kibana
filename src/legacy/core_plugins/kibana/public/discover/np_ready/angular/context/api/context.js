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
const sorting_1 = require("./utils/sorting");
const date_conversion_1 = require("./utils/date_conversion");
const fetch_hits_in_interval_1 = require("./utils/fetch_hits_in_interval");
const generate_intervals_1 = require("./utils/generate_intervals");
const get_es_query_search_after_1 = require("./utils/get_es_query_search_after");
const get_es_query_sort_1 = require("./utils/get_es_query_sort");
const kibana_services_1 = require("../../../../kibana_services");
const DAY_MILLIS = 24 * 60 * 60 * 1000;
// look from 1 day up to 10000 days into the past and future
const LOOKUP_OFFSETS = [0, 1, 7, 30, 365, 10000].map(days => days * DAY_MILLIS);
function fetchContextProvider(indexPatterns) {
    return {
        fetchSurroundingDocs,
    };
    /**
     * Fetch successor or predecessor documents of a given anchor document
     *
     * @param {SurrDocType} type - `successors` or `predecessors`
     * @param {string} indexPatternId
     * @param {EsHitRecord} anchor - anchor record
     * @param {string} timeField - name of the timefield, that's sorted on
     * @param {string} tieBreakerField - name of the tie breaker, the 2nd sort field
     * @param {SortDirection} sortDir - direction of sorting
     * @param {number} size - number of records to retrieve
     * @param {Filter[]} filters - to apply in the elastic query
     * @returns {Promise<object[]>}
     */
    async function fetchSurroundingDocs(type, indexPatternId, anchor, timeField, tieBreakerField, sortDir, size, filters) {
        if (typeof anchor !== 'object' || anchor === null || !size) {
            return [];
        }
        const indexPattern = await indexPatterns.get(indexPatternId);
        const searchSource = await createSearchSource(indexPattern, filters);
        const sortDirToApply = type === 'successors' ? sortDir : sorting_1.reverseSortDir(sortDir);
        const nanos = indexPattern.isTimeNanosBased() ? date_conversion_1.extractNanos(anchor.fields[timeField][0]) : '';
        const timeValueMillis = nanos !== '' ? date_conversion_1.convertIsoToMillis(anchor.fields[timeField][0]) : anchor.sort[0];
        const intervals = generate_intervals_1.generateIntervals(LOOKUP_OFFSETS, timeValueMillis, type, sortDir);
        let documents = [];
        for (const interval of intervals) {
            const remainingSize = size - documents.length;
            if (remainingSize <= 0) {
                break;
            }
            const searchAfter = get_es_query_search_after_1.getEsQuerySearchAfter(type, documents, timeField, anchor, nanos);
            const sort = get_es_query_sort_1.getEsQuerySort(timeField, tieBreakerField, sortDirToApply);
            const hits = await fetch_hits_in_interval_1.fetchHitsInInterval(searchSource, timeField, sort, sortDirToApply, interval, searchAfter, remainingSize, nanos);
            documents =
                type === 'successors' ? [...documents, ...hits] : [...hits.slice().reverse(), ...documents];
        }
        return documents;
    }
    async function createSearchSource(indexPattern, filters) {
        const { data } = kibana_services_1.getServices();
        return data.search.searchSource
            .create()
            .setParent(undefined)
            .setField('index', indexPattern)
            .setField('filter', filters);
    }
}
exports.fetchContextProvider = fetchContextProvider;
