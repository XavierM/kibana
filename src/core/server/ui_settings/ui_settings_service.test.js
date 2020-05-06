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
const config_schema_1 = require("@kbn/config-schema");
const ui_settings_service_test_mock_1 = require("./ui_settings_service.test.mock");
const ui_settings_service_1 = require("./ui_settings_service");
const http_service_mock_1 = require("../http/http_service.mock");
const mocks_1 = require("../mocks");
const saved_objects_service_mock_1 = require("../saved_objects/saved_objects_service.mock");
const core_context_mock_1 = require("../core_context.mock");
const saved_objects_1 = require("./saved_objects");
const overrides = {
    overrideBaz: 'baz',
};
const defaults = {
    foo: {
        name: 'foo',
        value: 'bar',
        category: [],
        description: '',
        schema: config_schema_1.schema.string(),
    },
};
describe('uiSettings', () => {
    let service;
    let setupDeps;
    let savedObjectsClient;
    beforeEach(() => {
        const coreContext = core_context_mock_1.mockCoreContext.create();
        coreContext.configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({ overrides }));
        const httpSetup = http_service_mock_1.httpServiceMock.createSetupContract();
        const savedObjectsSetup = saved_objects_service_mock_1.savedObjectsServiceMock.createInternalSetupContract();
        setupDeps = { http: httpSetup, savedObjects: savedObjectsSetup };
        savedObjectsClient = mocks_1.savedObjectsClientMock.create();
        service = new ui_settings_service_1.UiSettingsService(coreContext);
    });
    afterEach(() => {
        ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mockClear();
    });
    describe('#setup', () => {
        it('registers the uiSettings type to the savedObjects registry', async () => {
            await service.setup(setupDeps);
            expect(setupDeps.savedObjects.registerType).toHaveBeenCalledTimes(1);
            expect(setupDeps.savedObjects.registerType).toHaveBeenCalledWith(saved_objects_1.uiSettingsType);
        });
        describe('#asScopedToClient', () => {
            it('passes saved object type "config" to UiSettingsClient', async () => {
                const setup = await service.setup(setupDeps);
                setup.asScopedToClient(savedObjectsClient);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor).toBeCalledTimes(1);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].type).toBe('config');
            });
            it('passes overrides to UiSettingsClient', async () => {
                const setup = await service.setup(setupDeps);
                setup.asScopedToClient(savedObjectsClient);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor).toBeCalledTimes(1);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].overrides).toBe(overrides);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].overrides).toEqual(overrides);
            });
            it('passes a copy of set defaults to UiSettingsClient', async () => {
                const setup = await service.setup(setupDeps);
                setup.register(defaults);
                setup.asScopedToClient(savedObjectsClient);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor).toBeCalledTimes(1);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].defaults).toEqual(defaults);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].defaults).not.toBe(defaults);
            });
        });
        describe('#register', () => {
            it('throws if registers the same key twice', async () => {
                const setup = await service.setup(setupDeps);
                setup.register(defaults);
                expect(() => setup.register(defaults)).toThrowErrorMatchingInlineSnapshot(`"uiSettings for the key [foo] has been already registered"`);
            });
        });
    });
    describe('#start', () => {
        describe('validation', () => {
            it('validates registered definitions', async () => {
                const { register } = await service.setup(setupDeps);
                register({
                    custom: {
                        value: 42,
                        schema: config_schema_1.schema.string(),
                    },
                });
                await expect(service.start()).rejects.toMatchInlineSnapshot(`[Error: [ui settings defaults [custom]]: expected value of type [string] but got [number]]`);
            });
            it('validates overrides', async () => {
                const coreContext = core_context_mock_1.mockCoreContext.create();
                coreContext.configService.atPath.mockReturnValueOnce(new rxjs_1.BehaviorSubject({
                    overrides: {
                        custom: 42,
                    },
                }));
                const customizedService = new ui_settings_service_1.UiSettingsService(coreContext);
                const { register } = await customizedService.setup(setupDeps);
                register({
                    custom: {
                        value: '42',
                        schema: config_schema_1.schema.string(),
                    },
                });
                await expect(customizedService.start()).rejects.toMatchInlineSnapshot(`[Error: [ui settings overrides [custom]]: expected value of type [string] but got [number]]`);
            });
        });
        describe('#asScopedToClient', () => {
            it('passes saved object type "config" to UiSettingsClient', async () => {
                await service.setup(setupDeps);
                const start = await service.start();
                start.asScopedToClient(savedObjectsClient);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor).toBeCalledTimes(1);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].type).toBe('config');
            });
            it('passes overrides to UiSettingsClient', async () => {
                await service.setup(setupDeps);
                const start = await service.start();
                start.asScopedToClient(savedObjectsClient);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor).toBeCalledTimes(1);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].overrides).toBe(overrides);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].overrides).toEqual(overrides);
            });
            it('passes a copy of set defaults to UiSettingsClient', async () => {
                const setup = await service.setup(setupDeps);
                setup.register(defaults);
                const start = await service.start();
                start.asScopedToClient(savedObjectsClient);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor).toBeCalledTimes(1);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].defaults).toEqual(defaults);
                expect(ui_settings_service_test_mock_1.MockUiSettingsClientConstructor.mock.calls[0][0].defaults).not.toBe(defaults);
            });
        });
    });
});
