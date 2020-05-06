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
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const enzyme_1 = require("enzyme");
const react_1 = tslib_1.__importDefault(require("react"));
const application_service_mock_1 = require("../application/application_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const notifications_service_mock_1 = require("../notifications/notifications_service.mock");
const doc_links_service_mock_1 = require("../doc_links/doc_links_service.mock");
const chrome_service_1 = require("./chrome_service");
const ui_settings_service_mock_1 = require("../ui_settings/ui_settings_service.mock");
class FakeApp {
    constructor(id, chromeless) {
        this.id = id;
        this.chromeless = chromeless;
        this.title = `${this.id} App`;
        this.mount = () => () => { };
    }
}
const store = new Map();
const originalLocalStorage = window.localStorage;
window.localStorage = {
    setItem: (key, value) => store.set(String(key), String(value)),
    getItem: (key) => store.get(String(key)),
    removeItem: (key) => store.delete(String(key)),
};
function defaultStartDeps(availableApps) {
    const deps = {
        application: application_service_mock_1.applicationServiceMock.createInternalStartContract(),
        docLinks: doc_links_service_mock_1.docLinksServiceMock.createStartContract(),
        http: http_service_mock_1.httpServiceMock.createStartContract(),
        injectedMetadata: injected_metadata_service_mock_1.injectedMetadataServiceMock.createStartContract(),
        notifications: notifications_service_mock_1.notificationServiceMock.createStartContract(),
        uiSettings: ui_settings_service_mock_1.uiSettingsServiceMock.createStartContract(),
    };
    if (availableApps) {
        deps.application.applications$ = new Rx.BehaviorSubject(new Map(availableApps.map(app => [app.id, app])));
    }
    return deps;
}
async function start({ options = { browserSupportsCsp: true }, cspConfigMock = { warnLegacyBrowsers: true }, startDeps = defaultStartDeps(), } = {}) {
    const service = new chrome_service_1.ChromeService(options);
    if (cspConfigMock) {
        startDeps.injectedMetadata.getCspConfig.mockReturnValue(cspConfigMock);
    }
    return {
        service,
        startDeps,
        chrome: await service.start(startDeps),
    };
}
beforeEach(() => {
    store.clear();
    window.history.pushState(undefined, '', '#/home?a=b');
});
afterAll(() => {
    window.localStorage = originalLocalStorage;
});
describe('start', () => {
    it('adds legacy browser warning if browserSupportsCsp is disabled and warnLegacyBrowsers is enabled', async () => {
        const { startDeps } = await start({ options: { browserSupportsCsp: false } });
        expect(startDeps.notifications.toasts.addWarning.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "Your browser does not meet the security requirements for Kibana.",
        ],
      ]
    `);
    });
    it('does not add legacy browser warning if browser supports CSP', async () => {
        const { startDeps } = await start();
        expect(startDeps.notifications.toasts.addWarning).not.toBeCalled();
    });
    it('does not add legacy browser warning if warnLegacyBrowsers is disabled', async () => {
        const { startDeps } = await start({
            options: { browserSupportsCsp: false },
            cspConfigMock: { warnLegacyBrowsers: false },
        });
        expect(startDeps.notifications.toasts.addWarning).not.toBeCalled();
    });
    describe('getComponent', () => {
        it('returns a renderable React component', async () => {
            const { chrome } = await start();
            // Have to do some fanagling to get the type system and enzyme to accept this.
            // Don't capture the snapshot because it's 600+ lines long.
            expect(enzyme_1.shallow(react_1.default.createElement(() => chrome.getHeaderComponent()))).toBeDefined();
        });
    });
    describe('brand', () => {
        it('updates/emits the brand as it changes', async () => {
            const { chrome, service } = await start();
            const promise = chrome
                .getBrand$()
                .pipe(operators_1.toArray())
                .toPromise();
            chrome.setBrand({
                logo: 'big logo',
                smallLogo: 'not so big logo',
            });
            chrome.setBrand({
                logo: 'big logo without small logo',
            });
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          Object {},
          Object {
            "logo": "big logo",
            "smallLogo": "not so big logo",
          },
          Object {
            "logo": "big logo without small logo",
            "smallLogo": undefined,
          },
        ]
      `);
        });
    });
    describe('visibility', () => {
        it('updates/emits the visibility', async () => {
            const { chrome, service } = await start();
            const promise = chrome
                .getIsVisible$()
                .pipe(operators_1.toArray())
                .toPromise();
            chrome.setIsVisible(true);
            chrome.setIsVisible(false);
            chrome.setIsVisible(true);
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          true,
          true,
          false,
          true,
        ]
      `);
        });
        it('always emits false if embed query string is preset when set up', async () => {
            window.history.pushState(undefined, '', '#/home?a=b&embed=true');
            const { chrome, service } = await start();
            const promise = chrome
                .getIsVisible$()
                .pipe(operators_1.toArray())
                .toPromise();
            chrome.setIsVisible(true);
            chrome.setIsVisible(false);
            chrome.setIsVisible(true);
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          false,
          false,
          false,
          false,
        ]
      `);
        });
        it('application-specified visibility on mount', async () => {
            const startDeps = defaultStartDeps([
                new FakeApp('alpha'),
                new FakeApp('beta', true),
                new FakeApp('gamma', false),
            ]);
            const { applications$, navigateToApp } = startDeps.application;
            const { chrome, service } = await start({ startDeps });
            const promise = chrome
                .getIsVisible$()
                .pipe(operators_1.toArray())
                .toPromise();
            const availableApps = await applications$.pipe(operators_1.take(1)).toPromise();
            [...availableApps.keys()].forEach(appId => navigateToApp(appId));
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          true,
          true,
          false,
          true,
        ]
      `);
        });
        it('changing visibility has no effect on chrome-hiding application', async () => {
            const startDeps = defaultStartDeps([new FakeApp('alpha', true)]);
            const { navigateToApp } = startDeps.application;
            const { chrome, service } = await start({ startDeps });
            const promise = chrome
                .getIsVisible$()
                .pipe(operators_1.toArray())
                .toPromise();
            navigateToApp('alpha');
            chrome.setIsVisible(true);
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          true,
          false,
          false,
        ]
      `);
        });
    });
    describe('application classes', () => {
        it('updates/emits the application classes', async () => {
            const { chrome, service } = await start();
            const promise = chrome
                .getApplicationClasses$()
                .pipe(operators_1.toArray())
                .toPromise();
            chrome.addApplicationClass('foo');
            chrome.addApplicationClass('foo');
            chrome.addApplicationClass('bar');
            chrome.addApplicationClass('bar');
            chrome.addApplicationClass('baz');
            chrome.removeApplicationClass('bar');
            chrome.removeApplicationClass('foo');
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          Array [],
          Array [
            "foo",
          ],
          Array [
            "foo",
          ],
          Array [
            "foo",
            "bar",
          ],
          Array [
            "foo",
            "bar",
          ],
          Array [
            "foo",
            "bar",
            "baz",
          ],
          Array [
            "foo",
            "baz",
          ],
          Array [
            "baz",
          ],
        ]
      `);
        });
    });
    describe('badge', () => {
        it('updates/emits the current badge', async () => {
            const { chrome, service } = await start();
            const promise = chrome
                .getBadge$()
                .pipe(operators_1.toArray())
                .toPromise();
            chrome.setBadge({ text: 'foo', tooltip: `foo's tooltip` });
            chrome.setBadge({ text: 'bar', tooltip: `bar's tooltip` });
            chrome.setBadge(undefined);
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          undefined,
          Object {
            "text": "foo",
            "tooltip": "foo's tooltip",
          },
          Object {
            "text": "bar",
            "tooltip": "bar's tooltip",
          },
          undefined,
        ]
      `);
        });
    });
    describe('breadcrumbs', () => {
        it('updates/emits the current set of breadcrumbs', async () => {
            const { chrome, service } = await start();
            const promise = chrome
                .getBreadcrumbs$()
                .pipe(operators_1.toArray())
                .toPromise();
            chrome.setBreadcrumbs([{ text: 'foo' }, { text: 'bar' }]);
            chrome.setBreadcrumbs([{ text: 'foo' }]);
            chrome.setBreadcrumbs([{ text: 'bar' }]);
            chrome.setBreadcrumbs([]);
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
        Array [
          Array [],
          Array [
            Object {
              "text": "foo",
            },
            Object {
              "text": "bar",
            },
          ],
          Array [
            Object {
              "text": "foo",
            },
          ],
          Array [
            Object {
              "text": "bar",
            },
          ],
          Array [],
        ]
      `);
        });
    });
    describe('help extension', () => {
        it('updates/emits the current help extension', async () => {
            const { chrome, service } = await start();
            const promise = chrome
                .getHelpExtension$()
                .pipe(operators_1.toArray())
                .toPromise();
            chrome.setHelpExtension({ appName: 'App name', content: () => () => undefined });
            chrome.setHelpExtension(undefined);
            service.stop();
            await expect(promise).resolves.toMatchInlineSnapshot(`
              Array [
                undefined,
                Object {
                  "appName": "App name",
                  "content": [Function],
                },
                undefined,
              ]
            `);
        });
    });
});
describe('stop', () => {
    it('completes applicationClass$, getIsNavDrawerLocked, breadcrumbs$, isVisible$, and brand$ observables', async () => {
        const { chrome, service } = await start();
        const promise = Rx.combineLatest(chrome.getBrand$(), chrome.getApplicationClasses$(), chrome.getIsNavDrawerLocked$(), chrome.getBreadcrumbs$(), chrome.getIsVisible$(), chrome.getHelpExtension$()).toPromise();
        service.stop();
        await promise;
    });
    it('completes immediately if service already stopped', async () => {
        const { chrome, service } = await start();
        service.stop();
        await expect(Rx.combineLatest(chrome.getBrand$(), chrome.getApplicationClasses$(), chrome.getIsNavDrawerLocked$(), chrome.getBreadcrumbs$(), chrome.getIsVisible$(), chrome.getHelpExtension$()).toPromise()).resolves.toBe(undefined);
    });
});
