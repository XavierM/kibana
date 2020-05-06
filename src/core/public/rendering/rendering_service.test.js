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
const react_1 = tslib_1.__importDefault(require("react"));
const test_utils_1 = require("react-dom/test-utils");
const rendering_service_1 = require("./rendering_service");
const application_service_mock_1 = require("../application/application_service.mock");
const chrome_service_mock_1 = require("../chrome/chrome_service.mock");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const overlay_service_mock_1 = require("../overlays/overlay_service.mock");
const rxjs_1 = require("rxjs");
describe('RenderingService#start', () => {
    let application;
    let chrome;
    let overlays;
    let injectedMetadata;
    let targetDomElement;
    let rendering;
    beforeEach(() => {
        application = application_service_mock_1.applicationServiceMock.createInternalStartContract();
        application.getComponent.mockReturnValue(react_1.default.createElement("div", null, "Hello application!"));
        chrome = chrome_service_mock_1.chromeServiceMock.createStartContract();
        chrome.getHeaderComponent.mockReturnValue(react_1.default.createElement("div", null, "Hello chrome!"));
        overlays = overlay_service_mock_1.overlayServiceMock.createStartContract();
        overlays.banners.getComponent.mockReturnValue(react_1.default.createElement("div", null, "I'm a banner!"));
        injectedMetadata = injected_metadata_service_mock_1.injectedMetadataServiceMock.createStartContract();
        targetDomElement = document.createElement('div');
        rendering = new rendering_service_1.RenderingService();
    });
    const startService = () => {
        return rendering.start({
            application,
            chrome,
            injectedMetadata,
            overlays,
            targetDomElement,
        });
    };
    describe('standard mode', () => {
        beforeEach(() => {
            injectedMetadata.getLegacyMode.mockReturnValue(false);
        });
        it('renders application service into provided DOM element', () => {
            startService();
            expect(targetDomElement.querySelector('div.application')).toMatchInlineSnapshot(`
              <div
                class="application class-name"
              >
                <div>
                  Hello application!
                </div>
              </div>
          `);
        });
        it('adds the `chrome-hidden` class to the AppWrapper when chrome is hidden', () => {
            const isVisible$ = new rxjs_1.BehaviorSubject(true);
            chrome.getIsVisible$.mockReturnValue(isVisible$);
            startService();
            const appWrapper = targetDomElement.querySelector('div.app-wrapper');
            expect(appWrapper.className).toEqual('app-wrapper');
            test_utils_1.act(() => isVisible$.next(false));
            expect(appWrapper.className).toEqual('app-wrapper hidden-chrome');
            test_utils_1.act(() => isVisible$.next(true));
            expect(appWrapper.className).toEqual('app-wrapper');
        });
        it('adds the application classes to the AppContainer', () => {
            const applicationClasses$ = new rxjs_1.BehaviorSubject([]);
            chrome.getApplicationClasses$.mockReturnValue(applicationClasses$);
            startService();
            const appContainer = targetDomElement.querySelector('div.application');
            expect(appContainer.className).toEqual('application');
            test_utils_1.act(() => applicationClasses$.next(['classA', 'classB']));
            expect(appContainer.className).toEqual('application classA classB');
            test_utils_1.act(() => applicationClasses$.next(['classC']));
            expect(appContainer.className).toEqual('application classC');
            test_utils_1.act(() => applicationClasses$.next([]));
            expect(appContainer.className).toEqual('application');
        });
        it('contains wrapper divs', () => {
            startService();
            expect(targetDomElement.querySelector('div.app-wrapper')).toBeDefined();
            expect(targetDomElement.querySelector('div.app-wrapper-pannel')).toBeDefined();
        });
        it('renders the banner UI', () => {
            startService();
            expect(targetDomElement.querySelector('#globalBannerList')).toMatchInlineSnapshot(`
              <div
                id="globalBannerList"
              >
                <div>
                  I'm a banner!
                </div>
              </div>
          `);
        });
    });
    describe('legacy mode', () => {
        beforeEach(() => {
            injectedMetadata.getLegacyMode.mockReturnValue(true);
        });
        it('renders into provided DOM element', () => {
            startService();
            expect(targetDomElement).toMatchInlineSnapshot(`
          <div>
            <div
              class="content"
              data-test-subj="kibanaChrome"
            >
              <div>
                Hello chrome!
              </div>
              <div />
            </div>
          </div>
      `);
        });
        it('returns a div for the legacy service to render into', () => {
            const { legacyTargetDomElement } = startService();
            expect(targetDomElement.contains(legacyTargetDomElement)).toBe(true);
        });
    });
});
