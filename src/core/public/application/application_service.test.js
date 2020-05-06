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
const react_1 = require("react");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const enzyme_1 = require("enzyme");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const context_service_mock_1 = require("../context/context_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const overlay_service_mock_1 = require("../overlays/overlay_service.mock");
const application_service_test_mocks_1 = require("./application_service.test.mocks");
const application_service_1 = require("./application_service");
const types_1 = require("./types");
const createApp = (props) => {
    return {
        id: 'some-id',
        title: 'some-title',
        mount: () => () => undefined,
        ...props,
    };
};
const createLegacyApp = (props) => {
    return {
        id: 'some-id',
        title: 'some-title',
        appUrl: '/my-url',
        ...props,
    };
};
let setupDeps;
let startDeps;
let service;
describe('#setup()', () => {
    beforeEach(() => {
        const http = http_service_mock_1.httpServiceMock.createSetupContract({ basePath: '/base-path' });
        setupDeps = {
            http,
            context: context_service_mock_1.contextServiceMock.createSetupContract(),
            injectedMetadata: injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract(),
        };
        setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(false);
        startDeps = { http, overlays: overlay_service_mock_1.overlayServiceMock.createStartContract() };
        service = new application_service_1.ApplicationService();
    });
    describe('register', () => {
        it('throws an error if two apps with the same id are registered', () => {
            const { register } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app1' }));
            expect(() => register(Symbol(), createApp({ id: 'app1' }))).toThrowErrorMatchingInlineSnapshot(`"An application is already registered with the id \\"app1\\""`);
        });
        it('throws error if additional apps are registered after setup', async () => {
            const { register } = service.setup(setupDeps);
            await service.start(startDeps);
            expect(() => register(Symbol(), createApp({ id: 'app1' }))).toThrowErrorMatchingInlineSnapshot(`"Applications cannot be registered after \\"setup\\""`);
        });
        it('allows to register an AppUpdater for the application', async () => {
            const setup = service.setup(setupDeps);
            const pluginId = Symbol('plugin');
            const updater$ = new rxjs_1.BehaviorSubject(app => ({}));
            setup.register(pluginId, createApp({ id: 'app1', updater$ }));
            setup.register(pluginId, createApp({ id: 'app2' }));
            const { applications$ } = await service.start(startDeps);
            let applications = await applications$.pipe(operators_1.take(1)).toPromise();
            expect(applications.size).toEqual(2);
            expect(applications.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.default,
                status: types_1.AppStatus.accessible,
            }));
            expect(applications.get('app2')).toEqual(expect.objectContaining({
                id: 'app2',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.default,
                status: types_1.AppStatus.accessible,
            }));
            updater$.next(app => ({
                status: types_1.AppStatus.inaccessible,
                tooltip: 'App inaccessible due to reason',
                defaultPath: 'foo/bar',
            }));
            applications = await applications$.pipe(operators_1.take(1)).toPromise();
            expect(applications.size).toEqual(2);
            expect(applications.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.default,
                status: types_1.AppStatus.inaccessible,
                defaultPath: 'foo/bar',
                tooltip: 'App inaccessible due to reason',
            }));
            expect(applications.get('app2')).toEqual(expect.objectContaining({
                id: 'app2',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.default,
                status: types_1.AppStatus.accessible,
            }));
        });
        it('throws an error if an App with the same appRoute is registered', () => {
            const { register, registerLegacyApp } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app1' }));
            expect(() => register(Symbol(), createApp({ id: 'app2', appRoute: '/app/app1' }))).toThrowErrorMatchingInlineSnapshot(`"An application is already registered with the appRoute \\"/app/app1\\""`);
            expect(() => registerLegacyApp(createLegacyApp({ id: 'app1' }))).toThrow();
            register(Symbol(), createApp({ id: 'app-next', appRoute: '/app/app3' }));
            expect(() => register(Symbol(), createApp({ id: 'app2', appRoute: '/app/app3' }))).toThrowErrorMatchingInlineSnapshot(`"An application is already registered with the appRoute \\"/app/app3\\""`);
            expect(() => registerLegacyApp(createLegacyApp({ id: 'app3' }))).not.toThrow();
        });
        it('throws an error if an App starts with the HTTP base path', () => {
            const { register } = service.setup(setupDeps);
            expect(() => register(Symbol(), createApp({ id: 'app2', appRoute: '/base-path/app2' }))).toThrowErrorMatchingInlineSnapshot(`"Cannot register an application route that includes HTTP base path"`);
        });
    });
    describe('registerLegacyApp', () => {
        it('throws an error if two apps with the same id are registered', () => {
            const { registerLegacyApp } = service.setup(setupDeps);
            registerLegacyApp(createLegacyApp({ id: 'app2' }));
            expect(() => registerLegacyApp(createLegacyApp({ id: 'app2' }))).toThrowErrorMatchingInlineSnapshot(`"An application is already registered with the id \\"app2\\""`);
        });
        it('throws error if additional apps are registered after setup', async () => {
            const { registerLegacyApp } = service.setup(setupDeps);
            await service.start(startDeps);
            expect(() => registerLegacyApp(createLegacyApp({ id: 'app2' }))).toThrowErrorMatchingInlineSnapshot(`"Applications cannot be registered after \\"setup\\""`);
        });
        it('throws an error if a LegacyApp with the same appRoute is registered', () => {
            const { register, registerLegacyApp } = service.setup(setupDeps);
            registerLegacyApp(createLegacyApp({ id: 'app1' }));
            expect(() => register(Symbol(), createApp({ id: 'app2', appRoute: '/app/app1' }))).toThrowErrorMatchingInlineSnapshot(`"An application is already registered with the appRoute \\"/app/app1\\""`);
            expect(() => registerLegacyApp(createLegacyApp({ id: 'app1:other' }))).not.toThrow();
        });
    });
    describe('registerAppUpdater', () => {
        it('updates status fields', async () => {
            const setup = service.setup(setupDeps);
            const pluginId = Symbol('plugin');
            setup.register(pluginId, createApp({ id: 'app1' }));
            setup.register(pluginId, createApp({ id: 'app2' }));
            setup.registerAppUpdater(new rxjs_1.BehaviorSubject(app => {
                if (app.id === 'app1') {
                    return {
                        status: types_1.AppStatus.inaccessible,
                        navLinkStatus: types_1.AppNavLinkStatus.disabled,
                        tooltip: 'App inaccessible due to reason',
                    };
                }
                return {
                    tooltip: 'App accessible',
                };
            }));
            const start = await service.start(startDeps);
            const applications = await start.applications$.pipe(operators_1.take(1)).toPromise();
            expect(applications.size).toEqual(2);
            expect(applications.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.disabled,
                status: types_1.AppStatus.inaccessible,
                tooltip: 'App inaccessible due to reason',
            }));
            expect(applications.get('app2')).toEqual(expect.objectContaining({
                id: 'app2',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.default,
                status: types_1.AppStatus.accessible,
                tooltip: 'App accessible',
            }));
        });
        it(`properly combine with application's updater$`, async () => {
            const setup = service.setup(setupDeps);
            const pluginId = Symbol('plugin');
            const appStatusUpdater$ = new rxjs_1.BehaviorSubject(app => ({
                status: types_1.AppStatus.inaccessible,
                navLinkStatus: types_1.AppNavLinkStatus.disabled,
            }));
            setup.register(pluginId, createApp({ id: 'app1', updater$: appStatusUpdater$ }));
            setup.register(pluginId, createApp({ id: 'app2' }));
            setup.registerAppUpdater(new rxjs_1.BehaviorSubject(app => {
                if (app.id === 'app1') {
                    return {
                        status: types_1.AppStatus.accessible,
                        tooltip: 'App inaccessible due to reason',
                    };
                }
                return {
                    status: types_1.AppStatus.inaccessible,
                    navLinkStatus: types_1.AppNavLinkStatus.hidden,
                };
            }));
            const { applications$ } = await service.start(startDeps);
            const applications = await applications$.pipe(operators_1.take(1)).toPromise();
            expect(applications.size).toEqual(2);
            expect(applications.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.disabled,
                status: types_1.AppStatus.inaccessible,
                tooltip: 'App inaccessible due to reason',
            }));
            expect(applications.get('app2')).toEqual(expect.objectContaining({
                id: 'app2',
                legacy: false,
                status: types_1.AppStatus.inaccessible,
                navLinkStatus: types_1.AppNavLinkStatus.hidden,
            }));
        });
        it('applies the most restrictive status in case of multiple updaters', async () => {
            const setup = service.setup(setupDeps);
            const pluginId = Symbol('plugin');
            setup.register(pluginId, createApp({ id: 'app1' }));
            setup.registerAppUpdater(new rxjs_1.BehaviorSubject(app => {
                return {
                    status: types_1.AppStatus.inaccessible,
                    navLinkStatus: types_1.AppNavLinkStatus.disabled,
                };
            }));
            setup.registerAppUpdater(new rxjs_1.BehaviorSubject(app => {
                return {
                    status: types_1.AppStatus.accessible,
                    navLinkStatus: types_1.AppNavLinkStatus.default,
                };
            }));
            const start = await service.start(startDeps);
            const applications = await start.applications$.pipe(operators_1.take(1)).toPromise();
            expect(applications.size).toEqual(1);
            expect(applications.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: false,
                navLinkStatus: types_1.AppNavLinkStatus.disabled,
                status: types_1.AppStatus.inaccessible,
            }));
        });
        it('emits on applications$ when a status updater changes', async () => {
            const setup = service.setup(setupDeps);
            const pluginId = Symbol('plugin');
            setup.register(pluginId, createApp({ id: 'app1' }));
            const statusUpdater = new rxjs_1.BehaviorSubject(app => {
                return {
                    status: types_1.AppStatus.inaccessible,
                    navLinkStatus: types_1.AppNavLinkStatus.disabled,
                };
            });
            setup.registerAppUpdater(statusUpdater);
            const start = await service.start(startDeps);
            let latestValue = new Map();
            start.applications$.subscribe(apps => {
                latestValue = apps;
            });
            expect(latestValue.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: false,
                status: types_1.AppStatus.inaccessible,
                navLinkStatus: types_1.AppNavLinkStatus.disabled,
            }));
            statusUpdater.next(app => {
                return {
                    status: types_1.AppStatus.accessible,
                    navLinkStatus: types_1.AppNavLinkStatus.hidden,
                };
            });
            expect(latestValue.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: false,
                status: types_1.AppStatus.accessible,
                navLinkStatus: types_1.AppNavLinkStatus.hidden,
            }));
        });
        it('also updates legacy apps', async () => {
            const setup = service.setup(setupDeps);
            setup.registerLegacyApp(createLegacyApp({ id: 'app1' }));
            setup.registerAppUpdater(new rxjs_1.BehaviorSubject(app => {
                return {
                    status: types_1.AppStatus.inaccessible,
                    navLinkStatus: types_1.AppNavLinkStatus.hidden,
                    tooltip: 'App inaccessible due to reason',
                };
            }));
            const start = await service.start(startDeps);
            const applications = await start.applications$.pipe(operators_1.take(1)).toPromise();
            expect(applications.size).toEqual(1);
            expect(applications.get('app1')).toEqual(expect.objectContaining({
                id: 'app1',
                legacy: true,
                status: types_1.AppStatus.inaccessible,
                navLinkStatus: types_1.AppNavLinkStatus.hidden,
                tooltip: 'App inaccessible due to reason',
            }));
        });
        it('allows to update the basePath', async () => {
            const setup = service.setup(setupDeps);
            const pluginId = Symbol('plugin');
            setup.register(pluginId, createApp({ id: 'app1' }));
            const updater = new rxjs_1.BehaviorSubject(app => ({}));
            setup.registerAppUpdater(updater);
            const start = await service.start(startDeps);
            await start.navigateToApp('app1');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/app1', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
            updater.next(app => ({ defaultPath: 'default-path' }));
            await start.navigateToApp('app1');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/app1/default-path', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
            updater.next(app => ({ defaultPath: 'another-path' }));
            await start.navigateToApp('app1');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/app1/another-path', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
            updater.next(app => ({}));
            await start.navigateToApp('app1');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/app1', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
        });
    });
    it("`registerMountContext` calls context container's registerContext", () => {
        const { registerMountContext } = service.setup(setupDeps);
        const container = setupDeps.context.createContextContainer.mock.results[0].value;
        const pluginId = Symbol();
        const mount = () => () => undefined;
        registerMountContext(pluginId, 'test', mount);
        expect(container.registerContext).toHaveBeenCalledWith(pluginId, 'test', mount);
    });
});
describe('#start()', () => {
    beforeEach(() => {
        application_service_test_mocks_1.MockHistory.push.mockReset();
        const http = http_service_mock_1.httpServiceMock.createSetupContract({ basePath: '/base-path' });
        setupDeps = {
            http,
            context: context_service_mock_1.contextServiceMock.createSetupContract(),
            injectedMetadata: injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract(),
        };
        setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(false);
        startDeps = { http, overlays: overlay_service_mock_1.overlayServiceMock.createStartContract() };
        service = new application_service_1.ApplicationService();
    });
    it('rejects if called prior to #setup()', async () => {
        await expect(service.start(startDeps)).rejects.toThrowErrorMatchingInlineSnapshot(`"ApplicationService#setup() must be invoked before start."`);
    });
    it('exposes available apps', async () => {
        setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(true);
        const { register, registerLegacyApp } = service.setup(setupDeps);
        register(Symbol(), createApp({ id: 'app1' }));
        registerLegacyApp(createLegacyApp({ id: 'app2' }));
        const { applications$ } = await service.start(startDeps);
        const availableApps = await applications$.pipe(operators_1.take(1)).toPromise();
        expect(availableApps.size).toEqual(2);
        expect([...availableApps.keys()]).toEqual(['app1', 'app2']);
        expect(availableApps.get('app1')).toEqual(expect.objectContaining({
            appRoute: '/app/app1',
            id: 'app1',
            legacy: false,
            navLinkStatus: types_1.AppNavLinkStatus.default,
            status: types_1.AppStatus.accessible,
        }));
        expect(availableApps.get('app2')).toEqual(expect.objectContaining({
            appUrl: '/my-url',
            id: 'app2',
            legacy: true,
            navLinkStatus: types_1.AppNavLinkStatus.default,
            status: types_1.AppStatus.accessible,
        }));
    });
    it('passes appIds to capabilities', async () => {
        const { register } = service.setup(setupDeps);
        register(Symbol(), createApp({ id: 'app1' }));
        register(Symbol(), createApp({ id: 'app2' }));
        register(Symbol(), createApp({ id: 'app3' }));
        await service.start(startDeps);
        expect(application_service_test_mocks_1.MockCapabilitiesService.start).toHaveBeenCalledWith({
            appIds: ['app1', 'app2', 'app3'],
            http: setupDeps.http,
        });
    });
    it('filters available applications based on capabilities', async () => {
        application_service_test_mocks_1.MockCapabilitiesService.start.mockResolvedValueOnce({
            capabilities: {
                navLinks: {
                    app1: true,
                    app2: false,
                    legacyApp1: true,
                    legacyApp2: false,
                },
            },
        });
        const { register, registerLegacyApp } = service.setup(setupDeps);
        register(Symbol(), createApp({ id: 'app1' }));
        registerLegacyApp(createLegacyApp({ id: 'legacyApp1' }));
        register(Symbol(), createApp({ id: 'app2' }));
        registerLegacyApp(createLegacyApp({ id: 'legacyApp2' }));
        const { applications$ } = await service.start(startDeps);
        const availableApps = await applications$.pipe(operators_1.take(1)).toPromise();
        expect([...availableApps.keys()]).toEqual(['app1', 'legacyApp1']);
    });
    describe('currentAppId$', () => {
        it('emits the legacy app id when in legacy mode', async () => {
            setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(true);
            setupDeps.injectedMetadata.getLegacyMetadata.mockReturnValue({
                app: {
                    id: 'legacy',
                    title: 'Legacy App',
                },
            });
            await service.setup(setupDeps);
            const { currentAppId$ } = await service.start(startDeps);
            expect(await currentAppId$.pipe(operators_1.take(1)).toPromise()).toEqual('legacy');
        });
    });
    describe('getComponent', () => {
        it('returns renderable JSX tree', async () => {
            service.setup(setupDeps);
            const { getComponent } = await service.start(startDeps);
            expect(() => enzyme_1.shallow(react_1.createElement(getComponent))).not.toThrow();
            expect(getComponent()).toMatchSnapshot();
        });
        it('renders null when in legacy mode', async () => {
            setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(true);
            service.setup(setupDeps);
            const { getComponent } = await service.start(startDeps);
            expect(() => enzyme_1.shallow(react_1.createElement(getComponent))).not.toThrow();
            expect(getComponent()).toBe(null);
        });
    });
    describe('getUrlForApp', () => {
        it('creates URL for unregistered appId', async () => {
            service.setup(setupDeps);
            const { getUrlForApp } = await service.start(startDeps);
            expect(getUrlForApp('app1')).toBe('/base-path/app/app1');
        });
        it('creates URL for registered appId', async () => {
            const { register, registerLegacyApp } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app1' }));
            registerLegacyApp(createLegacyApp({ id: 'legacyApp1' }));
            register(Symbol(), createApp({ id: 'app2', appRoute: '/custom/path' }));
            const { getUrlForApp } = await service.start(startDeps);
            expect(getUrlForApp('app1')).toBe('/base-path/app/app1');
            expect(getUrlForApp('legacyApp1')).toBe('/base-path/app/legacyApp1');
            expect(getUrlForApp('app2')).toBe('/base-path/custom/path');
        });
        it('creates URLs with path parameter', async () => {
            service.setup(setupDeps);
            const { getUrlForApp } = await service.start(startDeps);
            expect(getUrlForApp('app1', { path: 'deep/link' })).toBe('/base-path/app/app1/deep/link');
            expect(getUrlForApp('app1', { path: '/deep//link/' })).toBe('/base-path/app/app1/deep/link');
            expect(getUrlForApp('app1', { path: '//deep/link//' })).toBe('/base-path/app/app1/deep/link');
            expect(getUrlForApp('app1', { path: 'deep/link///' })).toBe('/base-path/app/app1/deep/link');
        });
        it('does not append trailing slash if hash is provided in path parameter', async () => {
            service.setup(setupDeps);
            const { getUrlForApp } = await service.start(startDeps);
            expect(getUrlForApp('app1', { path: '#basic-hash' })).toBe('/base-path/app/app1#basic-hash');
            expect(getUrlForApp('app1', { path: '#/hash/router/path' })).toBe('/base-path/app/app1#/hash/router/path');
        });
        it('creates absolute URLs when `absolute` parameter is true', async () => {
            service.setup(setupDeps);
            const { getUrlForApp } = await service.start(startDeps);
            expect(getUrlForApp('app1', { absolute: true })).toBe('http://localhost/base-path/app/app1');
            expect(getUrlForApp('app2', { path: 'deep/link', absolute: true })).toBe('http://localhost/base-path/app/app2/deep/link');
        });
    });
    describe('navigateToApp', () => {
        it('changes the browser history to /app/:appId', async () => {
            service.setup(setupDeps);
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('myTestApp');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/myTestApp', undefined);
            await navigateToApp('myOtherApp');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/myOtherApp', undefined);
        });
        it('changes the browser history for custom appRoutes', async () => {
            const { register } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app2', appRoute: '/custom/path' }));
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('myTestApp');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/myTestApp', undefined);
            await navigateToApp('app2');
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/path', undefined);
        });
        it('appends a path if specified', async () => {
            const { register } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app2', appRoute: '/custom/path' }));
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('myTestApp', { path: 'deep/link/to/location/2' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/myTestApp/deep/link/to/location/2', undefined);
            await navigateToApp('app2', { path: 'deep/link/to/location/2' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/path/deep/link/to/location/2', undefined);
        });
        it('appends a path if specified with hash', async () => {
            const { register } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app2', appRoute: '/custom/path' }));
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('myTestApp', { path: '#basic-hash' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/myTestApp#basic-hash', undefined);
            await navigateToApp('myTestApp', { path: '#/hash/router/path' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/myTestApp#/hash/router/path', undefined);
            await navigateToApp('app2', { path: '#basic-hash' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/path#basic-hash', undefined);
            await navigateToApp('app2', { path: '#/hash/router/path' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/path#/hash/router/path', undefined);
        });
        it('preserves trailing slash when path contains a hash', async () => {
            const { register } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app2', appRoute: '/custom/app-path' }));
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('app2', { path: '#/' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/app-path#/', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
            await navigateToApp('app2', { path: '#/foo/bar/' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/app-path#/foo/bar/', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
            await navigateToApp('app2', { path: '/path#/' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/app-path/path#/', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
            await navigateToApp('app2', { path: '/path#/hash/' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/app-path/path#/hash/', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
            await navigateToApp('app2', { path: '/path/' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/app-path/path', undefined);
            application_service_test_mocks_1.MockHistory.push.mockClear();
        });
        it('appends the defaultPath when the path parameter is not specified', async () => {
            const { register } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app1', defaultPath: 'default/path' }));
            register(Symbol(), createApp({ id: 'app2', appRoute: '/custom-app-path', defaultPath: '/my-base' }));
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('app1', { path: 'defined-path' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/app1/defined-path', undefined);
            await navigateToApp('app1', {});
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/app1/default/path', undefined);
            await navigateToApp('app2', { path: 'defined-path' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom-app-path/defined-path', undefined);
            await navigateToApp('app2', {});
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom-app-path/my-base', undefined);
        });
        it('includes state if specified', async () => {
            const { register } = service.setup(setupDeps);
            register(Symbol(), createApp({ id: 'app2', appRoute: '/custom/path' }));
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('myTestApp', { state: 'my-state' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/app/myTestApp', 'my-state');
            await navigateToApp('app2', { state: 'my-state' });
            expect(application_service_test_mocks_1.MockHistory.push).toHaveBeenCalledWith('/custom/path', 'my-state');
        });
        it('redirects when in legacyMode', async () => {
            setupDeps.redirectTo = jest.fn();
            setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(true);
            service.setup(setupDeps);
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('myTestApp');
            expect(setupDeps.redirectTo).toHaveBeenCalledWith('/base-path/app/myTestApp');
        });
        it('updates currentApp$ after mounting', async () => {
            service.setup(setupDeps);
            const { currentAppId$, navigateToApp } = await service.start(startDeps);
            const stop$ = new rxjs_1.Subject();
            const promise = currentAppId$.pipe(operators_1.bufferCount(4), operators_1.takeUntil(stop$)).toPromise();
            await navigateToApp('alpha');
            await navigateToApp('beta');
            await navigateToApp('gamma');
            await navigateToApp('delta');
            stop$.next();
            const appIds = await promise;
            expect(appIds).toMatchInlineSnapshot(`
        Array [
          "alpha",
          "beta",
          "gamma",
          "delta",
        ]
      `);
        });
        it('sets window.location.href when navigating to legacy apps', async () => {
            setupDeps.http = http_service_mock_1.httpServiceMock.createSetupContract({ basePath: '/test' });
            setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(true);
            setupDeps.redirectTo = jest.fn();
            service.setup(setupDeps);
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('alpha');
            expect(setupDeps.redirectTo).toHaveBeenCalledWith('/test/app/alpha');
        });
        it('handles legacy apps with subapps', async () => {
            setupDeps.http = http_service_mock_1.httpServiceMock.createSetupContract({ basePath: '/test' });
            setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(true);
            setupDeps.redirectTo = jest.fn();
            const { registerLegacyApp } = service.setup(setupDeps);
            registerLegacyApp(createLegacyApp({ id: 'baseApp:legacyApp1' }));
            const { navigateToApp } = await service.start(startDeps);
            await navigateToApp('baseApp:legacyApp1');
            expect(setupDeps.redirectTo).toHaveBeenCalledWith('/test/app/baseApp');
        });
    });
});
describe('#stop()', () => {
    let addListenerSpy;
    let removeListenerSpy;
    beforeEach(() => {
        addListenerSpy = jest.spyOn(window, 'addEventListener');
        removeListenerSpy = jest.spyOn(window, 'removeEventListener');
        application_service_test_mocks_1.MockHistory.push.mockReset();
        const http = http_service_mock_1.httpServiceMock.createSetupContract({ basePath: '/test' });
        setupDeps = {
            http,
            context: context_service_mock_1.contextServiceMock.createSetupContract(),
            injectedMetadata: injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract(),
        };
        setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(false);
        startDeps = { http, overlays: overlay_service_mock_1.overlayServiceMock.createStartContract() };
        service = new application_service_1.ApplicationService();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('removes the beforeunload listener', async () => {
        service.setup(setupDeps);
        await service.start(startDeps);
        expect(addListenerSpy).toHaveBeenCalledTimes(1);
        expect(addListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
        const handler = addListenerSpy.mock.calls[0][1];
        service.stop();
        expect(removeListenerSpy).toHaveBeenCalledTimes(1);
        expect(removeListenerSpy).toHaveBeenCalledWith('beforeunload', handler);
    });
});
