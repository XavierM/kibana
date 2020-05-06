"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const public_1 = require("../../../../../../../../../../plugins/data/public");
const date_conversion_1 = require("./date_conversion");
/**
 * Fetch the hits between a given `interval` up to a maximum of `maxCount` documents.
 * The documents are sorted by `sort`
 *
 * The `searchSource` is assumed to have the appropriate index pattern
 * and filters set.
 */
async function fetchHitsInInterval(searchSource, timeField, sort, sortDir, interval, searchAfter, maxCount, nanosValue) {
    const range = {
        format: 'strict_date_optional_time',
    };
    const [start, stop] = interval;
    if (start) {
        range[sortDir === public_1.SortDirection.asc ? 'gte' : 'lte'] = date_conversion_1.convertTimeValueToIso(start, nanosValue);
    }
    if (stop) {
        range[sortDir === public_1.SortDirection.asc ? 'lte' : 'gte'] = date_conversion_1.convertTimeValueToIso(stop, nanosValue);
    }
    const response = await searchSource
        .setField('size', maxCount)
        .setField('query', {
        query: {
            constant_score: {
                filter: {
                    range: {
                        [timeField]: range,
                    },
                },
            },
        },
        language: 'lucene',
    })
        .setField('searchAfter', searchAfter)
        .setField('sort', sort)
        .setField('version', true)
        .fetch();
    return response.hits ? response.hits.hits : [];
}
exports.fetchHitsInInterval = fetchHitsInInterval;
