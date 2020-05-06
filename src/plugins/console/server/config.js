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
exports.config = config_schema_1.schema.object({
    enabled: config_schema_1.schema.boolean({ defaultValue: true }),
    proxyFilter: config_schema_1.schema.arrayOf(config_schema_1.schema.string(), { defaultValue: ['.*'] }),
    ssl: config_schema_1.schema.object({ verify: config_schema_1.schema.boolean({ defaultValue: false }) }, {}),
    // This does not actually work, track this issue: https://github.com/elastic/kibana/issues/55576
    proxyConfig: config_schema_1.schema.arrayOf(config_schema_1.schema.object({
        match: config_schema_1.schema.object({
            protocol: config_schema_1.schema.string({ defaultValue: '*' }),
            host: config_schema_1.schema.string({ defaultValue: '*' }),
            port: config_schema_1.schema.string({ defaultValue: '*' }),
            path: config_schema_1.schema.string({ defaultValue: '*' }),
        }),
        timeout: config_schema_1.schema.number(),
        ssl: config_schema_1.schema.object({
            verify: config_schema_1.schema.boolean(),
            ca: config_schema_1.schema.arrayOf(config_schema_1.schema.string()),
            cert: config_schema_1.schema.string(),
            key: config_schema_1.schema.string(),
        }, { defaultValue: undefined }),
    }), { defaultValue: [] }),
}, { defaultValue: undefined });
