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
const rxjs_1 = require("rxjs");
const moment_1 = require("moment");
const csp_1 = require("./csp");
const logging_service_mock_1 = require("./logging/logging_service.mock");
const elasticsearch_service_mock_1 = require("./elasticsearch/elasticsearch_service.mock");
const http_service_mock_1 = require("./http/http_service.mock");
const http_resources_service_mock_1 = require("./http_resources/http_resources_service.mock");
const context_service_mock_1 = require("./context/context_service.mock");
const saved_objects_service_mock_1 = require("./saved_objects/saved_objects_service.mock");
const saved_objects_client_mock_1 = require("./saved_objects/service/saved_objects_client.mock");
exports.savedObjectsClientMock = saved_objects_client_mock_1.savedObjectsClientMock;
const saved_objects_type_registry_mock_1 = require("./saved_objects/saved_objects_type_registry.mock");
const rendering_service_mock_1 = require("./rendering/rendering_service.mock");
const ui_settings_service_mock_1 = require("./ui_settings/ui_settings_service.mock");
const capabilities_service_mock_1 = require("./capabilities/capabilities_service.mock");
const metrics_service_mock_1 = require("./metrics/metrics_service.mock");
const uuid_service_mock_1 = require("./uuid/uuid_service.mock");
const status_service_mock_1 = require("./status/status_service.mock");
var http_server_mocks_1 = require("./http/http_server.mocks");
exports.httpServerMock = http_server_mocks_1.httpServerMock;
var http_resources_service_mock_2 = require("./http_resources/http_resources_service.mock");
exports.httpResourcesMock = http_resources_service_mock_2.httpResourcesMock;
var cookie_session_storage_mocks_1 = require("./http/cookie_session_storage.mocks");
exports.sessionStorageMock = cookie_session_storage_mocks_1.sessionStorageMock;
var config_service_mock_1 = require("./config/config_service.mock");
exports.configServiceMock = config_service_mock_1.configServiceMock;
var elasticsearch_service_mock_2 = require("./elasticsearch/elasticsearch_service.mock");
exports.elasticsearchServiceMock = elasticsearch_service_mock_2.elasticsearchServiceMock;
var http_service_mock_2 = require("./http/http_service.mock");
exports.httpServiceMock = http_service_mock_2.httpServiceMock;
var logging_service_mock_2 = require("./logging/logging_service.mock");
exports.loggingServiceMock = logging_service_mock_2.loggingServiceMock;
var repository_mock_1 = require("./saved_objects/service/lib/repository.mock");
exports.savedObjectsRepositoryMock = repository_mock_1.savedObjectsRepositoryMock;
var saved_objects_service_mock_2 = require("./saved_objects/saved_objects_service.mock");
exports.savedObjectsServiceMock = saved_objects_service_mock_2.savedObjectsServiceMock;
var saved_objects_type_registry_mock_2 = require("./saved_objects/saved_objects_type_registry.mock");
exports.savedObjectsTypeRegistryMock = saved_objects_type_registry_mock_2.typeRegistryMock;
var ui_settings_service_mock_2 = require("./ui_settings/ui_settings_service.mock");
exports.uiSettingsServiceMock = ui_settings_service_mock_2.uiSettingsServiceMock;
var metrics_service_mock_2 = require("./metrics/metrics_service.mock");
exports.metricsServiceMock = metrics_service_mock_2.metricsServiceMock;
var rendering_service_mock_2 = require("./rendering/rendering_service.mock");
exports.renderingMock = rendering_service_mock_2.renderingMock;
function pluginInitializerContextConfigMock(config) {
    const globalConfig = {
        kibana: {
            index: '.kibana-tests',
            autocompleteTerminateAfter: moment_1.duration(100000),
            autocompleteTimeout: moment_1.duration(1000),
        },
        elasticsearch: {
            shardTimeout: moment_1.duration('30s'),
            requestTimeout: moment_1.duration('30s'),
            pingTimeout: moment_1.duration('30s'),
            startupTimeout: moment_1.duration('30s'),
        },
        path: { data: '/tmp' },
    };
    const mock = {
        legacy: { globalConfig$: rxjs_1.of(globalConfig) },
        create: jest.fn().mockReturnValue(rxjs_1.of(config)),
        createIfExists: jest.fn().mockReturnValue(rxjs_1.of(config)),
    };
    return mock;
}
exports.pluginInitializerContextConfigMock = pluginInitializerContextConfigMock;
function pluginInitializerContextMock(config = {}) {
    const mock = {
        opaqueId: Symbol(),
        logger: logging_service_mock_1.loggingServiceMock.create(),
        env: {
            mode: {
                dev: true,
                name: 'development',
                prod: false,
            },
            packageInfo: {
                version: 'version',
                branch: 'branch',
                buildNum: 100,
                buildSha: 'buildSha',
                dist: false,
            },
        },
        config: pluginInitializerContextConfigMock(config),
    };
    return mock;
}
function createCoreSetupMock({ pluginStartDeps = {}, pluginStartContract, } = {}) {
    const httpService = http_service_mock_1.httpServiceMock.createSetupContract();
    const httpMock = {
        createCookieSessionStorageFactory: httpService.createCookieSessionStorageFactory,
        registerOnPreAuth: httpService.registerOnPreAuth,
        registerAuth: httpService.registerAuth,
        registerOnPostAuth: httpService.registerOnPostAuth,
        registerOnPreResponse: httpService.registerOnPreResponse,
        basePath: httpService.basePath,
        csp: csp_1.CspConfig.DEFAULT,
        isTlsEnabled: httpService.isTlsEnabled,
        createRouter: jest.fn(),
        registerRouteHandlerContext: jest.fn(),
        auth: {
            get: httpService.auth.get,
            isAuthenticated: httpService.auth.isAuthenticated,
        },
        resources: http_resources_service_mock_1.httpResourcesMock.createRegistrar(),
        getServerInfo: httpService.getServerInfo,
    };
    httpMock.createRouter.mockImplementation(() => httpService.createRouter(''));
    const uiSettingsMock = {
        register: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract().register,
    };
    const mock = {
        capabilities: capabilities_service_mock_1.capabilitiesServiceMock.createSetupContract(),
        context: context_service_mock_1.contextServiceMock.createSetupContract(),
        elasticsearch: elasticsearch_service_mock_1.elasticsearchServiceMock.createSetup(),
        http: httpMock,
        savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createInternalSetupContract(),
        status: status_service_mock_1.statusServiceMock.createSetupContract(),
        metrics: metrics_service_mock_1.metricsServiceMock.createSetupContract(),
        uiSettings: uiSettingsMock,
        uuid: uuid_service_mock_1.uuidServiceMock.createSetupContract(),
        getStartServices: jest
            .fn()
            .mockResolvedValue([createCoreStartMock(), pluginStartDeps, pluginStartContract]),
    };
    return mock;
}
function createCoreStartMock() {
    const mock = {
        capabilities: capabilities_service_mock_1.capabilitiesServiceMock.createStartContract(),
        elasticsearch: elasticsearch_service_mock_1.elasticsearchServiceMock.createStart(),
        savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createStartContract(),
        uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createStartContract(),
    };
    return mock;
}
function createInternalCoreSetupMock() {
    const setupDeps = {
        capabilities: capabilities_service_mock_1.capabilitiesServiceMock.createSetupContract(),
        context: context_service_mock_1.contextServiceMock.createSetupContract(),
        elasticsearch: elasticsearch_service_mock_1.elasticsearchServiceMock.createInternalSetup(),
        http: http_service_mock_1.httpServiceMock.createSetupContract(),
        metrics: metrics_service_mock_1.metricsServiceMock.createInternalSetupContract(),
        savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createInternalSetupContract(),
        status: status_service_mock_1.statusServiceMock.createInternalSetupContract(),
        uuid: uuid_service_mock_1.uuidServiceMock.createSetupContract(),
        httpResources: http_resources_service_mock_1.httpResourcesMock.createSetupContract(),
        rendering: rendering_service_mock_1.renderingMock.createSetupContract(),
        uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract(),
    };
    return setupDeps;
}
function createInternalCoreStartMock() {
    const startDeps = {
        capabilities: capabilities_service_mock_1.capabilitiesServiceMock.createStartContract(),
        elasticsearch: elasticsearch_service_mock_1.elasticsearchServiceMock.createStart(),
        savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createInternalStartContract(),
        uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createStartContract(),
    };
    return startDeps;
}
function createCoreRequestHandlerContextMock() {
    return {
        savedObjects: {
            client: saved_objects_client_mock_1.savedObjectsClientMock.create(),
            typeRegistry: saved_objects_type_registry_mock_1.typeRegistryMock.create(),
        },
        elasticsearch: {
            adminClient: elasticsearch_service_mock_1.elasticsearchServiceMock.createScopedClusterClient(),
            dataClient: elasticsearch_service_mock_1.elasticsearchServiceMock.createScopedClusterClient(),
        },
        uiSettings: {
            client: ui_settings_service_mock_1.uiSettingsServiceMock.createClient(),
        },
    };
}
exports.coreMock = {
    createSetup: createCoreSetupMock,
    createStart: createCoreStartMock,
    createInternalSetup: createInternalCoreSetupMock,
    createInternalStart: createInternalCoreStartMock,
    createPluginInitializerContext: pluginInitializerContextMock,
    createRequestHandlerContext: createCoreRequestHandlerContextMock,
};
