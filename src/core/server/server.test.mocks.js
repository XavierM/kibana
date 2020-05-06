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
const http_service_mock_1 = require("./http/http_service.mock");
exports.mockHttpService = http_service_mock_1.httpServiceMock.create();
jest.doMock('./http/http_service', () => ({
    HttpService: jest.fn(() => exports.mockHttpService),
}));
const plugins_service_mock_1 = require("./plugins/plugins_service.mock");
exports.mockPluginsService = plugins_service_mock_1.pluginServiceMock.create();
jest.doMock('./plugins/plugins_service', () => ({
    PluginsService: jest.fn(() => exports.mockPluginsService),
}));
const elasticsearch_service_mock_1 = require("./elasticsearch/elasticsearch_service.mock");
exports.mockElasticsearchService = elasticsearch_service_mock_1.elasticsearchServiceMock.create();
jest.doMock('./elasticsearch/elasticsearch_service', () => ({
    ElasticsearchService: jest.fn(() => exports.mockElasticsearchService),
}));
const legacy_service_mock_1 = require("./legacy/legacy_service.mock");
exports.mockLegacyService = legacy_service_mock_1.legacyServiceMock.create();
jest.mock('./legacy/legacy_service', () => ({
    LegacyService: jest.fn(() => exports.mockLegacyService),
}));
const config_service_mock_1 = require("./config/config_service.mock");
exports.mockConfigService = config_service_mock_1.configServiceMock.create();
jest.doMock('./config/config_service', () => ({
    ConfigService: jest.fn(() => exports.mockConfigService),
}));
const saved_objects_service_mock_1 = require("./saved_objects/saved_objects_service.mock");
exports.mockSavedObjectsService = saved_objects_service_mock_1.savedObjectsServiceMock.create();
jest.doMock('./saved_objects/saved_objects_service', () => ({
    SavedObjectsService: jest.fn(() => exports.mockSavedObjectsService),
}));
const context_service_mock_1 = require("./context/context_service.mock");
exports.mockContextService = context_service_mock_1.contextServiceMock.create();
jest.doMock('./context/context_service', () => ({
    ContextService: jest.fn(() => exports.mockContextService),
}));
const ui_settings_service_mock_1 = require("./ui_settings/ui_settings_service.mock");
exports.mockUiSettingsService = ui_settings_service_mock_1.uiSettingsServiceMock.create();
jest.doMock('./ui_settings/ui_settings_service', () => ({
    UiSettingsService: jest.fn(() => exports.mockUiSettingsService),
}));
exports.mockEnsureValidConfiguration = jest.fn();
jest.doMock('./legacy/config/ensure_valid_configuration', () => ({
    ensureValidConfiguration: exports.mockEnsureValidConfiguration,
}));
const rendering_service_1 = require("./rendering/__mocks__/rendering_service");
exports.mockRenderingService = rendering_service_1.mockRenderingService;
jest.doMock('./rendering/rendering_service', () => ({ RenderingService: rendering_service_1.RenderingService }));
const uuid_service_mock_1 = require("./uuid/uuid_service.mock");
exports.mockUuidService = uuid_service_mock_1.uuidServiceMock.create();
jest.doMock('./uuid/uuid_service', () => ({
    UuidService: jest.fn(() => exports.mockUuidService),
}));
const metrics_service_mock_1 = require("./metrics/metrics_service.mock");
exports.mockMetricsService = metrics_service_mock_1.metricsServiceMock.create();
jest.doMock('./metrics/metrics_service', () => ({
    MetricsService: jest.fn(() => exports.mockMetricsService),
}));
const status_service_mock_1 = require("./status/status_service.mock");
exports.mockStatusService = status_service_mock_1.statusServiceMock.create();
jest.doMock('./status/status_service', () => ({
    StatusService: jest.fn(() => exports.mockStatusService),
}));
