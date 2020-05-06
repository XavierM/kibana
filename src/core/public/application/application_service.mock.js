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
const rxjs_1 = require("rxjs");
const capabilities_service_mock_1 = require("./capabilities/capabilities_service.mock");
const createSetupContractMock = () => ({
    register: jest.fn(),
    registerAppUpdater: jest.fn(),
    registerMountContext: jest.fn(),
});
const createInternalSetupContractMock = () => ({
    register: jest.fn(),
    registerLegacyApp: jest.fn(),
    registerAppUpdater: jest.fn(),
    registerMountContext: jest.fn(),
});
const createStartContractMock = () => {
    const currentAppId$ = new rxjs_1.Subject();
    return {
        currentAppId$: currentAppId$.asObservable(),
        capabilities: capabilities_service_mock_1.capabilitiesServiceMock.createStartContract().capabilities,
        navigateToApp: jest.fn(),
        getUrlForApp: jest.fn(),
        registerMountContext: jest.fn(),
    };
};
const createInternalStartContractMock = () => {
    const currentAppId$ = new rxjs_1.Subject();
    return {
        applications$: new rxjs_1.BehaviorSubject(new Map()),
        capabilities: capabilities_service_mock_1.capabilitiesServiceMock.createStartContract().capabilities,
        currentAppId$: currentAppId$.asObservable(),
        getComponent: jest.fn(),
        getUrlForApp: jest.fn(),
        navigateToApp: jest.fn().mockImplementation(appId => currentAppId$.next(appId)),
        registerMountContext: jest.fn(),
    };
};
const createMock = () => ({
    setup: jest.fn().mockReturnValue(createInternalSetupContractMock()),
    start: jest.fn().mockReturnValue(createInternalStartContractMock()),
    stop: jest.fn(),
});
exports.applicationServiceMock = {
    create: createMock,
    createSetupContract: createSetupContractMock,
    createStartContract: createStartContractMock,
    createInternalSetupContract: createInternalSetupContractMock,
    createInternalStartContract: createInternalStartContractMock,
};
