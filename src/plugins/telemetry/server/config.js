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
const config_schema_1 = require("@kbn/config-schema");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const path_1 = require("../../../core/server/path");
const constants_1 = require("../common/constants");
exports.configSchema = config_schema_1.schema.object({
    enabled: config_schema_1.schema.boolean({ defaultValue: true }),
    allowChangingOptInStatus: config_schema_1.schema.boolean({ defaultValue: true }),
    optIn: config_schema_1.schema.conditional(config_schema_1.schema.siblingRef('allowChangingOptInStatus'), config_schema_1.schema.literal(false), config_schema_1.schema.maybe(config_schema_1.schema.literal(true)), config_schema_1.schema.boolean({ defaultValue: true }), { defaultValue: true }),
    // `config` is used internally and not intended to be set
    config: config_schema_1.schema.string({ defaultValue: path_1.getConfigPath() }),
    banner: config_schema_1.schema.boolean({ defaultValue: true }),
    url: config_schema_1.schema.conditional(config_schema_1.schema.contextRef('dist'), config_schema_1.schema.literal(false), // Point to staging if it's not a distributable release
    config_schema_1.schema.string({
        defaultValue: `https://telemetry-staging.elastic.co/xpack/${constants_1.ENDPOINT_VERSION}/send`,
    }), config_schema_1.schema.string({
        defaultValue: `https://telemetry.elastic.co/xpack/${constants_1.ENDPOINT_VERSION}/send`,
    })),
    optInStatusUrl: config_schema_1.schema.conditional(config_schema_1.schema.contextRef('dist'), config_schema_1.schema.literal(false), // Point to staging if it's not a distributable release
    config_schema_1.schema.string({
        defaultValue: `https://telemetry-staging.elastic.co/opt_in_status/${constants_1.ENDPOINT_VERSION}/send`,
    }), config_schema_1.schema.string({
        defaultValue: `https://telemetry.elastic.co/opt_in_status/${constants_1.ENDPOINT_VERSION}/send`,
    })),
    sendUsageFrom: config_schema_1.schema.oneOf([config_schema_1.schema.literal('server'), config_schema_1.schema.literal('browser')], {
        defaultValue: 'browser',
    }),
});
