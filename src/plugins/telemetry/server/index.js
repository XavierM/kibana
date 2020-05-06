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
const plugin_1 = require("./plugin");
const constants = tslib_1.__importStar(require("../common/constants"));
exports.constants = constants;
const config_1 = require("./config");
var fetcher_1 = require("./fetcher");
exports.FetcherTask = fetcher_1.FetcherTask;
var handle_old_settings_1 = require("./handle_old_settings");
exports.handleOldSettings = handle_old_settings_1.handleOldSettings;
exports.config = {
    schema: config_1.configSchema,
    exposeToBrowser: {
        enabled: true,
        url: true,
        banner: true,
        allowChangingOptInStatus: true,
        optIn: true,
        optInStatusUrl: true,
        sendUsageFrom: true,
    },
};
exports.plugin = (initializerContext) => new plugin_1.TelemetryPlugin(initializerContext);
var telemetry_collection_1 = require("./telemetry_collection");
exports.getClusterUuids = telemetry_collection_1.getClusterUuids;
exports.getLocalLicense = telemetry_collection_1.getLocalLicense;
exports.getLocalStats = telemetry_collection_1.getLocalStats;
