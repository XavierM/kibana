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
const config_schema_1 = require("@kbn/config-schema");
const validate = value => {
    if (!moment_1.default(value).isValid()) {
        return `${value} is not a valid date`;
    }
};
const dateSchema = config_schema_1.schema.oneOf([config_schema_1.schema.string({ validate }), config_schema_1.schema.number({ validate })]);
function registerTelemetryUsageStatsRoutes(router, telemetryCollectionManager, isDev) {
    router.post({
        path: '/api/telemetry/v2/clusters/_stats',
        validate: {
            body: config_schema_1.schema.object({
                unencrypted: config_schema_1.schema.boolean({ defaultValue: false }),
                timeRange: config_schema_1.schema.object({
                    min: dateSchema,
                    max: dateSchema,
                }),
            }),
        },
    }, async (context, req, res) => {
        const start = moment_1.default(req.body.timeRange.min).toISOString();
        const end = moment_1.default(req.body.timeRange.max).toISOString();
        const unencrypted = req.body.unencrypted;
        try {
            const statsConfig = {
                unencrypted,
                start,
                end,
                request: req,
            };
            const stats = await telemetryCollectionManager.getStats(statsConfig);
            return res.ok({ body: stats });
        }
        catch (err) {
            if (isDev) {
                // don't ignore errors when running in dev mode
                throw err;
            }
            if (unencrypted && err.status === 403) {
                return res.forbidden();
            }
            // ignore errors and return empty set
            return res.ok({ body: [] });
        }
    });
}
exports.registerTelemetryUsageStatsRoutes = registerTelemetryUsageStatsRoutes;
