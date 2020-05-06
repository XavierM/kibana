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
// @ts-ignore
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const config_schema_1 = require("@kbn/config-schema");
async function sendTelemetryOptInStatus(telemetryCollectionManager, config, statsGetterConfig) {
    const { optInStatusUrl, newOptInStatus } = config;
    const optInStatus = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);
    await node_fetch_1.default(optInStatusUrl, {
        method: 'post',
        body: optInStatus,
    });
}
exports.sendTelemetryOptInStatus = sendTelemetryOptInStatus;
function registerTelemetryOptInStatsRoutes(router, telemetryCollectionManager) {
    router.post({
        path: '/api/telemetry/v2/clusters/_opt_in_stats',
        validate: {
            body: config_schema_1.schema.object({
                enabled: config_schema_1.schema.boolean(),
                unencrypted: config_schema_1.schema.boolean({ defaultValue: true }),
            }),
        },
    }, async (context, req, res) => {
        try {
            const newOptInStatus = req.body.enabled;
            const unencrypted = req.body.unencrypted;
            const statsGetterConfig = {
                start: moment_1.default()
                    .subtract(20, 'minutes')
                    .toISOString(),
                end: moment_1.default().toISOString(),
                unencrypted,
                request: req,
            };
            const optInStatus = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);
            return res.ok({ body: optInStatus });
        }
        catch (err) {
            return res.ok({ body: [] });
        }
    });
}
exports.registerTelemetryOptInStatsRoutes = registerTelemetryOptInStatsRoutes;
