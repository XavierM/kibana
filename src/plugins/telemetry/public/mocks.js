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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const overlay_service_mock_1 = require("../../../core/public/overlays/overlay_service.mock");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const http_service_mock_1 = require("../../../core/public/http/http_service.mock");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const notifications_service_mock_1 = require("../../../core/public/notifications/notifications_service.mock");
const telemetry_service_1 = require("./services/telemetry_service");
const telemetry_notifications_1 = require("./services/telemetry_notifications/telemetry_notifications");
function mockTelemetryService({ reportOptInStatusChange, config: configOverride = {}, } = {}) {
    const config = {
        enabled: true,
        url: 'http://localhost',
        optInStatusUrl: 'http://localhost',
        sendUsageFrom: 'browser',
        optIn: true,
        banner: true,
        allowChangingOptInStatus: true,
        telemetryNotifyUserAboutOptInDefault: true,
        ...configOverride,
    };
    const telemetryService = new telemetry_service_1.TelemetryService({
        config,
        http: http_service_mock_1.httpServiceMock.createStartContract(),
        notifications: notifications_service_mock_1.notificationServiceMock.createStartContract(),
        reportOptInStatusChange,
    });
    const originalReportOptInStatus = telemetryService['reportOptInStatus'];
    telemetryService['reportOptInStatus'] = jest.fn().mockImplementation(optInPayload => {
        return originalReportOptInStatus(optInPayload); // Actually calling the original method
    });
    return telemetryService;
}
exports.mockTelemetryService = mockTelemetryService;
function mockTelemetryNotifications({ telemetryService, }) {
    return new telemetry_notifications_1.TelemetryNotifications({
        overlays: overlay_service_mock_1.overlayServiceMock.createStartContract(),
        telemetryService,
    });
}
exports.mockTelemetryNotifications = mockTelemetryNotifications;
exports.telemetryPluginMock = {
    createSetupContract,
};
function createSetupContract() {
    const telemetryService = mockTelemetryService();
    const telemetryNotifications = mockTelemetryNotifications({ telemetryService });
    const setupContract = {
        telemetryService,
        telemetryNotifications,
    };
    return setupContract;
}
