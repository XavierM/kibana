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
const history_1 = require("history");
// Import values from their individual modules instead.
const application_1 = require("./application");
const application_service_mock_1 = require("./application/application_service.mock");
const chrome_service_mock_1 = require("./chrome/chrome_service.mock");
const doc_links_service_mock_1 = require("./doc_links/doc_links_service.mock");
const fatal_errors_service_mock_1 = require("./fatal_errors/fatal_errors_service.mock");
const http_service_mock_1 = require("./http/http_service.mock");
const i18n_service_mock_1 = require("./i18n/i18n_service.mock");
const notifications_service_mock_1 = require("./notifications/notifications_service.mock");
const overlay_service_mock_1 = require("./overlays/overlay_service.mock");
const ui_settings_service_mock_1 = require("./ui_settings/ui_settings_service.mock");
const saved_objects_service_mock_1 = require("./saved_objects/saved_objects_service.mock");
const context_service_mock_1 = require("./context/context_service.mock");
const injected_metadata_service_mock_1 = require("./injected_metadata/injected_metadata_service.mock");
var chrome_service_mock_2 = require("./chrome/chrome_service.mock");
exports.chromeServiceMock = chrome_service_mock_2.chromeServiceMock;
var doc_links_service_mock_2 = require("./doc_links/doc_links_service.mock");
exports.docLinksServiceMock = doc_links_service_mock_2.docLinksServiceMock;
var fatal_errors_service_mock_2 = require("./fatal_errors/fatal_errors_service.mock");
exports.fatalErrorsServiceMock = fatal_errors_service_mock_2.fatalErrorsServiceMock;
var http_service_mock_2 = require("./http/http_service.mock");
exports.httpServiceMock = http_service_mock_2.httpServiceMock;
var i18n_service_mock_2 = require("./i18n/i18n_service.mock");
exports.i18nServiceMock = i18n_service_mock_2.i18nServiceMock;
var injected_metadata_service_mock_2 = require("./injected_metadata/injected_metadata_service.mock");
exports.injectedMetadataServiceMock = injected_metadata_service_mock_2.injectedMetadataServiceMock;
var legacy_service_mock_1 = require("./legacy/legacy_service.mock");
exports.legacyPlatformServiceMock = legacy_service_mock_1.legacyPlatformServiceMock;
var notifications_service_mock_2 = require("./notifications/notifications_service.mock");
exports.notificationServiceMock = notifications_service_mock_2.notificationServiceMock;
var overlay_service_mock_2 = require("./overlays/overlay_service.mock");
exports.overlayServiceMock = overlay_service_mock_2.overlayServiceMock;
var ui_settings_service_mock_2 = require("./ui_settings/ui_settings_service.mock");
exports.uiSettingsServiceMock = ui_settings_service_mock_2.uiSettingsServiceMock;
var saved_objects_service_mock_2 = require("./saved_objects/saved_objects_service.mock");
exports.savedObjectsServiceMock = saved_objects_service_mock_2.savedObjectsServiceMock;
var scoped_history_mock_1 = require("./application/scoped_history.mock");
exports.scopedHistoryMock = scoped_history_mock_1.scopedHistoryMock;
var application_service_mock_2 = require("./application/application_service.mock");
exports.applicationServiceMock = application_service_mock_2.applicationServiceMock;
function createCoreSetupMock({ basePath = '', pluginStartDeps = {}, pluginStartContract, } = {}) {
    const mock = {
        application: application_service_mock_1.applicationServiceMock.createSetupContract(),
        context: context_service_mock_1.contextServiceMock.createSetupContract(),
        fatalErrors: fatal_errors_service_mock_1.fatalErrorsServiceMock.createSetupContract(),
        getStartServices: jest.fn(() => Promise.resolve([createCoreStartMock({ basePath }), pluginStartDeps, pluginStartContract])),
        http: http_service_mock_1.httpServiceMock.createSetupContract({ basePath }),
        notifications: notifications_service_mock_1.notificationServiceMock.createSetupContract(),
        uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract(),
        injectedMetadata: {
            getInjectedVar: injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract().getInjectedVar,
        },
    };
    return mock;
}
function createCoreStartMock({ basePath = '' } = {}) {
    const mock = {
        application: application_service_mock_1.applicationServiceMock.createStartContract(),
        chrome: chrome_service_mock_1.chromeServiceMock.createStartContract(),
        docLinks: doc_links_service_mock_1.docLinksServiceMock.createStartContract(),
        http: http_service_mock_1.httpServiceMock.createStartContract({ basePath }),
        i18n: i18n_service_mock_1.i18nServiceMock.createStartContract(),
        notifications: notifications_service_mock_1.notificationServiceMock.createStartContract(),
        overlays: overlay_service_mock_1.overlayServiceMock.createStartContract(),
        uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createStartContract(),
        savedObjects: saved_objects_service_mock_1.savedObjectsServiceMock.createStartContract(),
        injectedMetadata: {
            getInjectedVar: injected_metadata_service_mock_1.injectedMetadataServiceMock.createStartContract().getInjectedVar,
        },
        fatalErrors: fatal_errors_service_mock_1.fatalErrorsServiceMock.createStartContract(),
    };
    return mock;
}
function pluginInitializerContextMock() {
    const mock = {
        opaqueId: Symbol(),
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
        config: {
            get: () => ({}),
        },
    };
    return mock;
}
function createCoreContext() {
    return {
        coreId: Symbol('core context mock'),
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
    };
}
function createStorageMock() {
    const storageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 10,
    };
    return storageMock;
}
function createAppMountParametersMock(appBasePath = '') {
    // Assemble an in-memory history mock using the provided basePath
    const rawHistory = history_1.createMemoryHistory();
    rawHistory.push(appBasePath);
    const history = new application_1.ScopedHistory(rawHistory, appBasePath);
    const params = {
        appBasePath,
        element: document.createElement('div'),
        history,
        onAppLeave: jest.fn(),
    };
    return params;
}
exports.coreMock = {
    createCoreContext,
    createSetup: createCoreSetupMock,
    createStart: createCoreStartMock,
    createPluginInitializerContext: pluginInitializerContextMock,
    createStorage: createStorageMock,
    createAppMountParamters: createAppMountParametersMock,
};
