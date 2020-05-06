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
/**
 * Generate a sequence of pairs from the iterable that looks like
 * `[[x_0, x_1], [x_1, x_2], [x_2, x_3], ..., [x_(n-1), x_n]]`.
 */
function* asPairs(iterable) {
    let currentPair = [];
    for (const value of iterable) {
        currentPair = [...currentPair, value].slice(-2);
        if (currentPair.length === 2) {
            yield currentPair;
        }
    }
}
exports.asPairs = asPairs;
/**
 * Returns a iterable containing intervals `[start,end]` for Elasticsearch date range queries
 * depending on type (`successors` or `predecessors`) and sort (`asc`, `desc`) these are ascending or descending intervals.
 */
function generateIntervals(offsets, startTime, type, sort) {
    const offsetSign = (sort === public_1.SortDirection.asc && type === 'successors') ||
        (sort === public_1.SortDirection.desc && type === 'predecessors')
        ? 1
        : -1;
    // ending with `null` opens the last interval
    return asPairs([...offsets.map(offset => startTime + offset * offsetSign), null]);
}
exports.generateIntervals = generateIntervals;
