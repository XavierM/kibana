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
const config_schema_1 = require("@kbn/config-schema");
const plugin_1 = require("./plugin");
exports.config = {
    schema: config_schema_1.schema.object({
        enabled: config_schema_1.schema.boolean({ defaultValue: true }),
        transactionIndices: config_schema_1.schema.string({ defaultValue: 'apm-*' }),
        spanIndices: config_schema_1.schema.string({ defaultValue: 'apm-*' }),
        errorIndices: config_schema_1.schema.string({ defaultValue: 'apm-*' }),
        metricsIndices: config_schema_1.schema.string({ defaultValue: 'apm-*' }),
        sourcemapIndices: config_schema_1.schema.string({ defaultValue: 'apm-*' }),
        onboardingIndices: config_schema_1.schema.string({ defaultValue: 'apm-*' }),
        indexPattern: config_schema_1.schema.string({ defaultValue: 'apm-*' }),
    }),
};
function plugin(initializerContext) {
    return new plugin_1.APMOSSPlugin(initializerContext);
}
exports.plugin = plugin;
