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
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const constants_1 = require("../../../common/constants");
/**
 * Initialize a collector for Kibana Ops Stats
 */
function getOpsStatsCollector(usageCollection, metrics$) {
    let lastMetrics = null;
    metrics$.subscribe(_metrics => {
        const metrics = lodash_1.cloneDeep(_metrics);
        // Ensure we only include the same data that Metricbeat collection would get
        delete metrics.process.pid;
        const responseTimes = {
            average: metrics.response_times.avg_in_millis,
            max: metrics.response_times.max_in_millis,
        };
        delete metrics.requests.statusCodes;
        lastMetrics = {
            ...metrics,
            response_times: responseTimes,
            timestamp: moment_1.default.utc().toISOString(),
        };
    });
    return usageCollection.makeStatsCollector({
        type: constants_1.KIBANA_STATS_TYPE,
        isReady: () => !!lastMetrics,
        fetch: () => lastMetrics,
    });
}
exports.getOpsStatsCollector = getOpsStatsCollector;
function registerOpsStatsCollector(usageCollection, metrics$) {
    usageCollection.registerCollector(getOpsStatsCollector(usageCollection, metrics$));
}
exports.registerOpsStatsCollector = registerOpsStatsCollector;
