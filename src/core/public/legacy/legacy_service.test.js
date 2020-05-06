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
const angular_1 = tslib_1.__importDefault(require("angular"));
const chrome_service_mock_1 = require("../chrome/chrome_service.mock");
const fatal_errors_service_mock_1 = require("../fatal_errors/fatal_errors_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const i18n_service_mock_1 = require("../i18n/i18n_service.mock");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const notifications_service_mock_1 = require("../notifications/notifications_service.mock");
const overlay_service_mock_1 = require("../overlays/overlay_service.mock");
const ui_settings_service_mock_1 = require("../ui_settings/ui_settings_service.mock");
const legacy_service_1 = require("./legacy_service");
const application_service_mock_1 = require("../application/application_service.mock");
const doc_links_service_mock_1 = require("../doc_links/doc_links_service.mock");
const saved_objects_service_mock_1 = require("../saved_objects/saved_objects_service.mock");
const context_service_mock_1 = require("../context/context_service.mock");
const applicationSetup = application_service_mock_1.applicationServiceMock.createInternalSetupContract();
const contextSetup = context_service_mock_1.contextServiceMock.createSetupContract();
const fatalErrorsSetup = fatal_errors_service_mock_1.fatalErrorsServiceMock.createSetupContract();
const httpSetup = http_service_mock_1.httpServiceMock.createSetupContract();
const injectedMetadataSetup = injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract();
const notificationsSetup = notifications_service_mock_1.notificationServiceMock.createSetupContract();
const uiSettingsSetup = ui_settings_service_mock_1.uiSettingsServiceMock.createSetupContract();
const mockLoadOrder = [];
const mockUiNewPlatformSetup = jest.fn();
const mockUiNewPlatformStart = jest.fn();
const mockUiChromeBootstrap = jest.fn();
const defaultParams = {
    requireLegacyFiles: jest.fn(() => {
        mockLoadOrder.push('legacy files');
    }),
    requireLegacyBootstrapModule: jest.fn(() => {
        mockLoadOrder.push('ui/chrome');
        return {
            bootstrap: mockUiChromeBootstrap,
        };
    }),
    requireNewPlatformShimModule: jest.fn(() => ({
        __setup__: mockUiNewPlatformSetup,
        __start__: mockUiNewPlatformStart,
    })),
};
const defaultSetupDeps = {
    core: {
        application: applicationSetup,
        context: contextSetup,
        fatalErrors: fatalErrorsSetup,
        injectedMetadata: injectedMetadataSetup,
        notifications: notificationsSetup,
        http: httpSetup,
        uiSettings: uiSettingsSetup,
    },
    plugins: {},
};
const applicationStart = application_service_mock_1.applicationServiceMock.createInternalStartContract();
const docLinksStart = doc_links_service_mock_1.docLinksServiceMock.createStartContract();
const httpStart = http_service_mock_1.httpServiceMock.createStartContract();
const chromeStart = chrome_service_mock_1.chromeServiceMock.createStartContract();
const i18nStart = i18n_service_mock_1.i18nServiceMock.createStartContract();
const injectedMetadataStart = injected_metadata_service_mock_1.injectedMetadataServiceMock.createStartContract();
const notificationsStart = notifications_service_mock_1.notificationServiceMock.createStartContract();
const overlayStart = overlay_service_mock_1.overlayServiceMock.createStartContract();
const uiSettingsStart = ui_settings_service_mock_1.uiSettingsServiceMock.createStartContract();
const savedObjectsStart = saved_objects_service_mock_1.savedObjectsServiceMock.createStartContract();
const fatalErrorsStart = fatal_errors_service_mock_1.fatalErrorsServiceMock.createStartContract();
const mockStorage = { getItem: jest.fn() };
const defaultStartDeps = {
    core: {
        application: applicationStart,
        docLinks: docLinksStart,
        http: httpStart,
        chrome: chromeStart,
        i18n: i18nStart,
        injectedMetadata: injectedMetadataStart,
        notifications: notificationsStart,
        overlays: overlayStart,
        uiSettings: uiSettingsStart,
        savedObjects: savedObjectsStart,
        fatalErrors: fatalErrorsStart,
    },
    lastSubUrlStorage: mockStorage,
    targetDomElement: document.createElement('div'),
    plugins: {},
};
afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockLoadOrder.length = 0;
});
describe('#setup()', () => {
    describe('default', () => {
        it('initializes new platform shim module with core APIs', () => {
            const legacyPlatform = new legacy_service_1.LegacyPlatformService({
                ...defaultParams,
            });
            legacyPlatform.setup(defaultSetupDeps);
            expect(mockUiNewPlatformSetup).toHaveBeenCalledTimes(1);
            expect(mockUiNewPlatformSetup).toHaveBeenCalledWith(expect.any(Object), {});
        });
        it('throws error if requireNewPlatformShimModule is undefined', () => {
            const legacyPlatform = new legacy_service_1.LegacyPlatformService({
                ...defaultParams,
                requireNewPlatformShimModule: undefined,
            });
            expect(() => {
                legacyPlatform.setup(defaultSetupDeps);
            }).toThrowErrorMatchingInlineSnapshot(`"requireNewPlatformShimModule must be specified when rendering a legacy application"`);
            expect(mockUiNewPlatformSetup).not.toHaveBeenCalled();
        });
    });
});
describe('#start()', () => {
    it('fetches and sets legacy lastSubUrls', () => {
        chromeStart.navLinks.getAll.mockReturnValue([
            { id: 'link1', baseUrl: 'http://wowza.com/app1', legacy: true },
        ]);
        mockStorage.getItem.mockReturnValue('http://wowza.com/app1/subUrl');
        const legacyPlatform = new legacy_service_1.LegacyPlatformService({
            ...defaultParams,
        });
        legacyPlatform.setup(defaultSetupDeps);
        legacyPlatform.start({ ...defaultStartDeps, lastSubUrlStorage: mockStorage });
        expect(chromeStart.navLinks.update).toHaveBeenCalledWith('link1', {
            url: 'http://wowza.com/app1/subUrl',
        });
    });
    it('initializes ui/new_platform with core APIs', () => {
        const legacyPlatform = new legacy_service_1.LegacyPlatformService({
            ...defaultParams,
        });
        legacyPlatform.setup(defaultSetupDeps);
        legacyPlatform.start(defaultStartDeps);
        expect(mockUiNewPlatformStart).toHaveBeenCalledTimes(1);
        expect(mockUiNewPlatformStart).toHaveBeenCalledWith(expect.any(Object), {});
    });
    it('throws error if requireNewPlatformShimeModule is undefined', () => {
        const legacyPlatform = new legacy_service_1.LegacyPlatformService({
            ...defaultParams,
            requireNewPlatformShimModule: undefined,
        });
        expect(() => {
            legacyPlatform.start(defaultStartDeps);
        }).toThrowErrorMatchingInlineSnapshot(`"requireNewPlatformShimModule must be specified when rendering a legacy application"`);
        expect(mockUiNewPlatformStart).not.toHaveBeenCalled();
    });
    it('resolves getStartServices with core and plugin APIs', async () => {
        const legacyPlatform = new legacy_service_1.LegacyPlatformService({
            ...defaultParams,
        });
        legacyPlatform.setup(defaultSetupDeps);
        legacyPlatform.start(defaultStartDeps);
        const { getStartServices } = mockUiNewPlatformSetup.mock.calls[0][0];
        const [coreStart, pluginsStart] = await getStartServices();
        expect(coreStart).toEqual(expect.any(Object));
        expect(pluginsStart).toBe(defaultStartDeps.plugins);
    });
    it('passes the targetDomElement to legacy bootstrap module', () => {
        const legacyPlatform = new legacy_service_1.LegacyPlatformService({
            ...defaultParams,
        });
        legacyPlatform.setup(defaultSetupDeps);
        legacyPlatform.start(defaultStartDeps);
        expect(mockUiChromeBootstrap).toHaveBeenCalledTimes(1);
        expect(mockUiChromeBootstrap).toHaveBeenCalledWith(defaultStartDeps.targetDomElement);
    });
    describe('load order', () => {
        it('loads ui/modules before ui/chrome, and both before legacy files', () => {
            const legacyPlatform = new legacy_service_1.LegacyPlatformService({
                ...defaultParams,
            });
            expect(mockLoadOrder).toEqual([]);
            legacyPlatform.setup(defaultSetupDeps);
            legacyPlatform.start(defaultStartDeps);
            expect(mockLoadOrder).toMatchInlineSnapshot(`
        Array [
          "ui/chrome",
          "legacy files",
        ]
      `);
        });
    });
});
describe('#stop()', () => {
    it('does nothing if angular was not bootstrapped to targetDomElement', () => {
        const targetDomElement = document.createElement('div');
        targetDomElement.innerHTML = `
      <h1>this should not be removed</h1>
    `;
        const legacyPlatform = new legacy_service_1.LegacyPlatformService({
            ...defaultParams,
        });
        legacyPlatform.stop();
        expect(targetDomElement).toMatchInlineSnapshot(`
      <div>
        
            
        <h1>
          this should not be removed
        </h1>
        
          
      </div>
    `);
    });
    it('destroys the angular scope and empties the targetDomElement if angular is bootstrapped to targetDomElement', async () => {
        const targetDomElement = document.createElement('div');
        const scopeDestroySpy = jest.fn();
        const legacyPlatform = new legacy_service_1.LegacyPlatformService({
            ...defaultParams,
        });
        // simulate bootstrapping with a module "foo"
        angular_1.default.module('foo', []).directive('bar', () => ({
            restrict: 'E',
            link($scope) {
                $scope.$on('$destroy', scopeDestroySpy);
            },
        }));
        targetDomElement.innerHTML = `
      <bar></bar>
    `;
        angular_1.default.bootstrap(targetDomElement, ['foo']);
        await legacyPlatform.setup(defaultSetupDeps);
        legacyPlatform.start({ ...defaultStartDeps, targetDomElement });
        legacyPlatform.stop();
        expect(targetDomElement).toMatchInlineSnapshot(`
      <div
        class="ng-scope"
      />
    `);
        expect(scopeDestroySpy).toHaveBeenCalledTimes(1);
    });
});
