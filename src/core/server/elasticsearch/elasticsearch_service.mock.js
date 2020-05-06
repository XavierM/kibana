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
const status_1 = require("../status");
const createScopedClusterClientMock = () => ({
    callAsInternalUser: jest.fn(),
    callAsCurrentUser: jest.fn(),
});
const createCustomClusterClientMock = () => ({
    ...createClusterClientMock(),
    close: jest.fn(),
});
function createClusterClientMock() {
    const client = {
        callAsInternalUser: jest.fn(),
        asScoped: jest.fn(),
    };
    client.asScoped.mockReturnValue(createScopedClusterClientMock());
    return client;
}
const createSetupContractMock = () => {
    const setupContract = {
        createClient: jest.fn(),
        adminClient: createClusterClientMock(),
        dataClient: createClusterClientMock(),
    };
    setupContract.createClient.mockReturnValue(createCustomClusterClientMock());
    setupContract.adminClient.asScoped.mockReturnValue(createScopedClusterClientMock());
    setupContract.dataClient.asScoped.mockReturnValue(createScopedClusterClientMock());
    return setupContract;
};
const createStartContractMock = () => {
    const startContract = {
        legacy: {
            createClient: jest.fn(),
            client: createClusterClientMock(),
        },
    };
    startContract.legacy.createClient.mockReturnValue(createCustomClusterClientMock());
    startContract.legacy.client.asScoped.mockReturnValue(createScopedClusterClientMock());
    return startContract;
};
const createInternalSetupContractMock = () => {
    const setupContract = {
        ...createSetupContractMock(),
        esNodesCompatibility$: new rxjs_1.BehaviorSubject({
            isCompatible: true,
            incompatibleNodes: [],
            warningNodes: [],
            kibanaVersion: '8.0.0',
        }),
        status$: new rxjs_1.BehaviorSubject({
            level: status_1.ServiceStatusLevels.available,
            summary: 'Elasticsearch is available',
        }),
        legacy: {
            config$: new rxjs_1.BehaviorSubject({}),
        },
    };
    setupContract.adminClient.asScoped.mockReturnValue(createScopedClusterClientMock());
    setupContract.dataClient.asScoped.mockReturnValue(createScopedClusterClientMock());
    return setupContract;
};
const createMock = () => {
    const mocked = {
        setup: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
    };
    mocked.setup.mockResolvedValue(createInternalSetupContractMock());
    mocked.start.mockResolvedValueOnce(createStartContractMock());
    mocked.stop.mockResolvedValue();
    return mocked;
};
exports.elasticsearchServiceMock = {
    create: createMock,
    createInternalSetup: createInternalSetupContractMock,
    createSetup: createSetupContractMock,
    createStart: createStartContractMock,
    createClusterClient: createClusterClientMock,
    createCustomClusterClient: createCustomClusterClientMock,
    createScopedClusterClient: createScopedClusterClientMock,
};
