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
const application_service_mock_1 = require("./application/application_service.mock");
const chrome_service_mock_1 = require("./chrome/chrome_service.mock");
const fatal_errors_service_mock_1 = require("./fatal_errors/fatal_errors_service.mock");
const http_service_mock_1 = require("./http/http_service.mock");
const i18n_service_mock_1 = require("./i18n/i18n_service.mock");
const injected_metadata_service_mock_1 = require("./injected_metadata/injected_metadata_service.mock");
const legacy_service_mock_1 = require("./legacy/legacy_service.mock");
const notifications_service_mock_1 = require("./notifications/notifications_service.mock");
const overlay_service_mock_1 = require("./overlays/overlay_service.mock");
const plugins_service_mock_1 = require("./plugins/plugins_service.mock");
const ui_settings_service_mock_1 = require("./ui_settings/ui_settings_service.mock");
const doc_links_service_mock_1 = require("./doc_links/doc_links_service.mock");
const rendering_service_mock_1 = require("./rendering/rendering_service.mock");
const context_service_mock_1 = require("./context/context_service.mock");
const integrations_service_mock_1 = require("./integrations/integrations_service.mock");
exports.MockLegacyPlatformService = legacy_service_mock_1.legacyPlatformServiceMock.create();
exports.LegacyPlatformServiceConstructor = jest
    .fn()
    .mockImplementation(() => exports.MockLegacyPlatformService);
jest.doMock('./legacy', () => ({
    LegacyPlatformService: exports.LegacyPlatformServiceConstructor,
}));
exports.MockInjectedMetadataService = injected_metadata_service_mock_1.injectedMetadataServiceMock.create();
exports.InjectedMetadataServiceConstructor = jest
    .fn()
    .mockImplementation(() => exports.MockInjectedMetadataService);
jest.doMock('./injected_metadata', () => ({
    InjectedMetadataService: exports.InjectedMetadataServiceConstructor,
}));
exports.MockFatalErrorsService = fatal_errors_service_mock_1.fatalErrorsServiceMock.create();
exports.FatalErrorsServiceConstructor = jest
    .fn()
    .mockImplementation(() => exports.MockFatalErrorsService);
jest.doMock('./fatal_errors', () => ({
    FatalErrorsService: exports.FatalErrorsServiceConstructor,
}));
exports.MockI18nService = i18n_service_mock_1.i18nServiceMock.create();
exports.I18nServiceConstructor = jest.fn().mockImplementation(() => exports.MockI18nService);
jest.doMock('./i18n', () => ({
    I18nService: exports.I18nServiceConstructor,
}));
exports.MockNotificationsService = notifications_service_mock_1.notificationServiceMock.create();
exports.NotificationServiceConstructor = jest
    .fn()
    .mockImplementation(() => exports.MockNotificationsService);
jest.doMock('./notifications', () => ({
    NotificationsService: exports.NotificationServiceConstructor,
}));
exports.MockHttpService = http_service_mock_1.httpServiceMock.create();
exports.HttpServiceConstructor = jest.fn().mockImplementation(() => exports.MockHttpService);
jest.doMock('./http', () => ({
    HttpService: exports.HttpServiceConstructor,
}));
exports.MockUiSettingsService = ui_settings_service_mock_1.uiSettingsServiceMock.create();
exports.UiSettingsServiceConstructor = jest
    .fn()
    .mockImplementation(() => exports.MockUiSettingsService);
jest.doMock('./ui_settings', () => ({
    UiSettingsService: exports.UiSettingsServiceConstructor,
}));
exports.MockChromeService = chrome_service_mock_1.chromeServiceMock.create();
exports.ChromeServiceConstructor = jest.fn().mockImplementation(() => exports.MockChromeService);
jest.doMock('./chrome', () => ({
    ChromeService: exports.ChromeServiceConstructor,
}));
exports.MockOverlayService = overlay_service_mock_1.overlayServiceMock.create();
exports.OverlayServiceConstructor = jest.fn().mockImplementation(() => exports.MockOverlayService);
jest.doMock('./overlays', () => ({
    OverlayService: exports.OverlayServiceConstructor,
}));
exports.MockPluginsService = plugins_service_mock_1.pluginsServiceMock.create();
exports.PluginsServiceConstructor = jest.fn().mockImplementation(() => exports.MockPluginsService);
jest.doMock('./plugins', () => ({
    PluginsService: exports.PluginsServiceConstructor,
}));
exports.MockApplicationService = application_service_mock_1.applicationServiceMock.create();
exports.ApplicationServiceConstructor = jest
    .fn()
    .mockImplementation(() => exports.MockApplicationService);
jest.doMock('./application', () => ({
    ApplicationService: exports.ApplicationServiceConstructor,
}));
exports.MockDocLinksService = doc_links_service_mock_1.docLinksServiceMock.create();
exports.DocLinksServiceConstructor = jest.fn().mockImplementation(() => exports.MockDocLinksService);
jest.doMock('./doc_links', () => ({
    DocLinksService: exports.DocLinksServiceConstructor,
}));
exports.MockRenderingService = rendering_service_mock_1.renderingServiceMock.create();
exports.RenderingServiceConstructor = jest.fn().mockImplementation(() => exports.MockRenderingService);
jest.doMock('./rendering', () => ({
    RenderingService: exports.RenderingServiceConstructor,
}));
exports.MockContextService = context_service_mock_1.contextServiceMock.create();
exports.ContextServiceConstructor = jest.fn().mockImplementation(() => exports.MockContextService);
jest.doMock('./context', () => ({
    ContextService: exports.ContextServiceConstructor,
}));
exports.MockIntegrationsService = integrations_service_mock_1.integrationsServiceMock.create();
exports.IntegrationsServiceConstructor = jest
    .fn()
    .mockImplementation(() => exports.MockIntegrationsService);
jest.doMock('./integrations', () => ({
    IntegrationsService: exports.IntegrationsServiceConstructor,
}));
