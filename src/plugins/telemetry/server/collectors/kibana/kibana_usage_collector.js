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
const operators_1 = require("rxjs/operators");
const constants_1 = require("../../../common/constants");
const get_saved_object_counts_1 = require("./get_saved_object_counts");
function getKibanaUsageCollector(usageCollection, legacyConfig$) {
    return usageCollection.makeUsageCollector({
        type: constants_1.KIBANA_USAGE_TYPE,
        isReady: () => true,
        async fetch(callCluster) {
            const { kibana: { index }, } = await legacyConfig$.pipe(operators_1.take(1)).toPromise();
            return {
                index,
                ...(await get_saved_object_counts_1.getSavedObjectsCounts(callCluster, index)),
            };
        },
        /*
         * Format the response data into a model for internal upload
         * 1. Make this data part of the "kibana_stats" type
         * 2. Organize the payload in the usage namespace of the data payload (usage.index, etc)
         */
        formatForBulkUpload: result => {
            return {
                type: constants_1.KIBANA_STATS_TYPE,
                payload: {
                    usage: result,
                },
            };
        },
    });
}
exports.getKibanaUsageCollector = getKibanaUsageCollector;
function registerKibanaUsageCollector(usageCollection, legacyConfig$) {
    usageCollection.registerCollector(getKibanaUsageCollector(usageCollection, legacyConfig$));
}
exports.registerKibanaUsageCollector = registerKibanaUsageCollector;
