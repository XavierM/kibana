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
const constants_1 = require("../../common/constants");
const telemetry_repository_1 = require("../telemetry_repository");
const CONFIG_ALLOW_REPORT = 'xPackMonitoring:allowReport';
async function handleOldSettings(savedObjectsClient, uiSettingsClient) {
    const oldTelemetrySetting = await uiSettingsClient.get(constants_1.CONFIG_TELEMETRY);
    const oldAllowReportSetting = await uiSettingsClient.get(CONFIG_ALLOW_REPORT);
    let legacyOptInValue = null;
    if (typeof oldTelemetrySetting === 'boolean') {
        legacyOptInValue = oldTelemetrySetting;
    }
    else if (typeof oldAllowReportSetting === 'boolean' &&
        uiSettingsClient.isOverridden(CONFIG_ALLOW_REPORT)) {
        legacyOptInValue = oldAllowReportSetting;
    }
    if (legacyOptInValue !== null) {
        await telemetry_repository_1.updateTelemetrySavedObject(savedObjectsClient, {
            enabled: legacyOptInValue,
        });
    }
}
exports.handleOldSettings = handleOldSettings;
