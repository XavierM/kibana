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
const telemetry_opt_in_1 = require("./telemetry_opt_in");
const telemetry_usage_stats_1 = require("./telemetry_usage_stats");
const telemetry_opt_in_stats_1 = require("./telemetry_opt_in_stats");
const telemetry_user_has_seen_notice_1 = require("./telemetry_user_has_seen_notice");
function registerRoutes(options) {
    const { isDev, telemetryCollectionManager, router } = options;
    telemetry_opt_in_1.registerTelemetryOptInRoutes(options);
    telemetry_usage_stats_1.registerTelemetryUsageStatsRoutes(router, telemetryCollectionManager, isDev);
    telemetry_opt_in_stats_1.registerTelemetryOptInStatsRoutes(router, telemetryCollectionManager);
    telemetry_user_has_seen_notice_1.registerTelemetryUserHasSeenNotice(router);
}
exports.registerRoutes = registerRoutes;
