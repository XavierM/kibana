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
const server_1 = require("../../../../../core/server");
const constants_1 = require("../../../common/constants");
const telemetry_repository_1 = require("../../telemetry_repository");
const telemetry_config_1 = require("../../../common/telemetry_config");
function createCollectorFetch({ currentKibanaVersion, config$, getSavedObjectsClient, }) {
    return async function fetchUsageStats() {
        const { sendUsageFrom, allowChangingOptInStatus, optIn = null } = await config$
            .pipe(operators_1.take(1))
            .toPromise();
        const configTelemetrySendUsageFrom = sendUsageFrom;
        const configTelemetryOptIn = optIn;
        let telemetrySavedObject = {};
        try {
            const internalRepository = getSavedObjectsClient();
            telemetrySavedObject = await telemetry_repository_1.getTelemetrySavedObject(new server_1.SavedObjectsClient(internalRepository));
        }
        catch (err) {
            // no-op
        }
        return {
            opt_in_status: telemetry_config_1.getTelemetryOptIn({
                currentKibanaVersion,
                telemetrySavedObject,
                allowChangingOptInStatus,
                configTelemetryOptIn,
            }),
            last_reported: telemetrySavedObject ? telemetrySavedObject.lastReported : undefined,
            usage_fetcher: telemetry_config_1.getTelemetrySendUsageFrom({
                telemetrySavedObject,
                configTelemetrySendUsageFrom,
            }),
        };
    };
}
exports.createCollectorFetch = createCollectorFetch;
function registerTelemetryPluginUsageCollector(usageCollection, options) {
    const collector = usageCollection.makeUsageCollector({
        type: constants_1.TELEMETRY_STATS_TYPE,
        isReady: () => typeof options.getSavedObjectsClient() !== 'undefined',
        fetch: createCollectorFetch(options),
    });
    usageCollection.registerCollector(collector);
}
exports.registerTelemetryPluginUsageCollector = registerTelemetryPluginUsageCollector;
