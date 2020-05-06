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
const sinon_1 = tslib_1.__importDefault(require("sinon"));
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const mocks_1 = require("../../../../core/server/mocks");
const uiSettingsServiceFactoryNS = tslib_1.__importStar(require("../ui_settings_service_factory"));
const getUiSettingsServiceForRequestNS = tslib_1.__importStar(require("../ui_settings_service_for_request"));
// @ts-ignore
const ui_settings_mixin_1 = require("../ui_settings_mixin");
const uiSettingDefaults = {
    application: {
        defaultProperty1: 'value1',
    },
};
describe('uiSettingsMixin()', () => {
    const sandbox = sinon_1.default.createSandbox();
    function setup() {
        // maps of decorations passed to `server.decorate()`
        const decorations = {
            server: {},
            request: {},
        };
        // mock hapi server
        const server = {
            log: sinon_1.default.stub(),
            route: sinon_1.default.stub(),
            addMemoizedFactoryToRequest(name, factory) {
                this.decorate('request', name, function () {
                    return factory(this);
                });
            },
            decorate: sinon_1.default.spy((type, name, value) => {
                decorations[type][name] = value;
            }),
        };
        // "promise" returned from kbnServer.ready()
        const readyPromise = {
            then: sinon_1.default.stub(),
        };
        const kbnServer = {
            server,
            uiExports: { uiSettingDefaults },
            ready: sinon_1.default.stub().returns(readyPromise),
            newPlatform: {
                __internals: {
                    uiSettings: {
                        register: sinon_1.default.stub(),
                    },
                },
            },
        };
        ui_settings_mixin_1.uiSettingsMixin(kbnServer, server);
        return {
            kbnServer,
            server,
            decorations,
            readyPromise,
        };
    }
    afterEach(() => sandbox.restore());
    it('passes uiSettingsDefaults to the new platform', () => {
        const { kbnServer } = setup();
        sinon_1.default.assert.calledOnce(kbnServer.newPlatform.__internals.uiSettings.register);
        sinon_1.default.assert.calledWithExactly(kbnServer.newPlatform.__internals.uiSettings.register, uiSettingDefaults);
    });
    describe('server.uiSettingsServiceFactory()', () => {
        it('decorates server with "uiSettingsServiceFactory"', () => {
            const { decorations } = setup();
            expect_1.default(decorations.server)
                .to.have.property('uiSettingsServiceFactory')
                .a('function');
            const uiSettingsServiceFactoryStub = sandbox.stub(uiSettingsServiceFactoryNS, 'uiSettingsServiceFactory');
            sinon_1.default.assert.notCalled(uiSettingsServiceFactoryStub);
            decorations.server.uiSettingsServiceFactory();
            sinon_1.default.assert.calledOnce(uiSettingsServiceFactoryStub);
        });
        it('passes `server` and `options` argument to factory', () => {
            const { decorations, server } = setup();
            expect_1.default(decorations.server)
                .to.have.property('uiSettingsServiceFactory')
                .a('function');
            const uiSettingsServiceFactoryStub = sandbox.stub(uiSettingsServiceFactoryNS, 'uiSettingsServiceFactory');
            sinon_1.default.assert.notCalled(uiSettingsServiceFactoryStub);
            const savedObjectsClient = mocks_1.savedObjectsClientMock.create();
            decorations.server.uiSettingsServiceFactory({
                savedObjectsClient,
            });
            sinon_1.default.assert.calledOnce(uiSettingsServiceFactoryStub);
            sinon_1.default.assert.calledWithExactly(uiSettingsServiceFactoryStub, server, {
                savedObjectsClient,
            });
        });
    });
    describe('request.getUiSettingsService()', () => {
        it('exposes "getUiSettingsService" on requests', () => {
            const { decorations } = setup();
            expect_1.default(decorations.request)
                .to.have.property('getUiSettingsService')
                .a('function');
            const getUiSettingsServiceForRequestStub = sandbox.stub(getUiSettingsServiceForRequestNS, 'getUiSettingsServiceForRequest');
            sinon_1.default.assert.notCalled(getUiSettingsServiceForRequestStub);
            decorations.request.getUiSettingsService();
            sinon_1.default.assert.calledOnce(getUiSettingsServiceForRequestStub);
        });
        it('passes request to getUiSettingsServiceForRequest', () => {
            const { server, decorations } = setup();
            expect_1.default(decorations.request)
                .to.have.property('getUiSettingsService')
                .a('function');
            const getUiSettingsServiceForRequestStub = sandbox.stub(getUiSettingsServiceForRequestNS, 'getUiSettingsServiceForRequest');
            sinon_1.default.assert.notCalled(getUiSettingsServiceForRequestStub);
            const request = {};
            decorations.request.getUiSettingsService.call(request);
            sinon_1.default.assert.calledWith(getUiSettingsServiceForRequestStub, server, request);
        });
    });
    describe('server.uiSettings()', () => {
        it('throws an error, links to pr', () => {
            const { decorations } = setup();
            expect_1.default(decorations.server)
                .to.have.property('uiSettings')
                .a('function');
            expect_1.default(() => {
                decorations.server.uiSettings();
            }).to.throwError('http://github.com'); // incorrect typings
        });
    });
});
