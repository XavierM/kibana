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
const moment_1 = tslib_1.__importDefault(require("moment"));
const operators_1 = require("rxjs/operators");
const config_schema_1 = require("@kbn/config-schema");
const telemetry_config_1 = require("../../common/telemetry_config");
const telemetry_opt_in_stats_1 = require("./telemetry_opt_in_stats");
const telemetry_repository_1 = require("../telemetry_repository");
function registerTelemetryOptInRoutes({ config$, router, currentKibanaVersion, telemetryCollectionManager, }) {
    router.post({
        path: '/api/telemetry/v2/optIn',
        validate: {
            body: config_schema_1.schema.object({ enabled: config_schema_1.schema.boolean() }),
        },
    }, async (context, req, res) => {
        const newOptInStatus = req.body.enabled;
        const attributes = {
            enabled: newOptInStatus,
            lastVersionChecked: currentKibanaVersion,
        };
        const config = await config$.pipe(operators_1.take(1)).toPromise();
        const telemetrySavedObject = await telemetry_repository_1.getTelemetrySavedObject(context.core.savedObjects.client);
        if (telemetrySavedObject === false) {
            // If we get false, we couldn't get the saved object due to lack of permissions
            // so we can assume the user won't be able to update it either
            return res.forbidden();
        }
        const configTelemetryAllowChangingOptInStatus = config.allowChangingOptInStatus;
        const allowChangingOptInStatus = telemetry_config_1.getTelemetryAllowChangingOptInStatus({
            telemetrySavedObject,
            configTelemetryAllowChangingOptInStatus,
        });
        if (!allowChangingOptInStatus) {
            return res.badRequest({
                body: JSON.stringify({ error: 'Not allowed to change Opt-in Status.' }),
            });
        }
        const statsGetterConfig = {
            start: moment_1.default()
                .subtract(20, 'minutes')
                .toISOString(),
            end: moment_1.default().toISOString(),
            unencrypted: false,
        };
        const optInStatus = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);
        if (config.sendUsageFrom === 'server') {
            const optInStatusUrl = config.optInStatusUrl;
            await telemetry_opt_in_stats_1.sendTelemetryOptInStatus(telemetryCollectionManager, { optInStatusUrl, newOptInStatus }, statsGetterConfig);
        }
        await telemetry_repository_1.updateTelemetrySavedObject(context.core.savedObjects.client, attributes);
        return res.ok({ body: optInStatus });
    });
}
exports.registerTelemetryOptInRoutes = registerTelemetryOptInRoutes;
