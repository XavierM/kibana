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
const kibana_migrator_mock_1 = require("./migrations/kibana/kibana_migrator.mock");
const scoped_client_provider_mock_1 = require("./service/lib/scoped_client_provider.mock");
const repository_mock_1 = require("./service/lib/repository.mock");
const saved_objects_client_mock_1 = require("./service/saved_objects_client.mock");
const saved_objects_type_registry_mock_1 = require("./saved_objects_type_registry.mock");
const mocks_1 = require("./migrations/mocks");
const status_1 = require("../status");
const createStartContractMock = () => {
    const startContrat = {
        getScopedClient: jest.fn(),
        createInternalRepository: jest.fn(),
        createScopedRepository: jest.fn(),
        createSerializer: jest.fn(),
        getTypeRegistry: jest.fn(),
    };
    startContrat.getScopedClient.mockReturnValue(saved_objects_client_mock_1.savedObjectsClientMock.create());
    startContrat.createInternalRepository.mockReturnValue(repository_mock_1.savedObjectsRepositoryMock.create());
    startContrat.createScopedRepository.mockReturnValue(repository_mock_1.savedObjectsRepositoryMock.create());
    startContrat.getTypeRegistry.mockReturnValue(saved_objects_type_registry_mock_1.typeRegistryMock.create());
    return startContrat;
};
const createInternalStartContractMock = () => {
    const internalStartContract = {
        ...createStartContractMock(),
        clientProvider: scoped_client_provider_mock_1.savedObjectsClientProviderMock.create(),
        migrator: kibana_migrator_mock_1.mockKibanaMigrator.create(),
    };
    return internalStartContract;
};
const createSetupContractMock = () => {
    const setupContract = {
        setClientFactoryProvider: jest.fn(),
        addClientWrapper: jest.fn(),
        registerType: jest.fn(),
        getImportExportObjectLimit: jest.fn(),
    };
    setupContract.getImportExportObjectLimit.mockReturnValue(100);
    return setupContract;
};
const createInternalSetupContractMock = () => {
    const internalSetupContract = {
        ...createSetupContractMock(),
        status$: new rxjs_1.BehaviorSubject({
            level: status_1.ServiceStatusLevels.available,
            summary: `SavedObjects is available`,
        }),
    };
    return internalSetupContract;
};
const createSavedObjectsServiceMock = () => {
    const mocked = {
        setup: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
    };
    mocked.setup.mockResolvedValue(createInternalSetupContractMock());
    mocked.start.mockResolvedValue(createInternalStartContractMock());
    mocked.stop.mockResolvedValue();
    return mocked;
};
exports.savedObjectsServiceMock = {
    create: createSavedObjectsServiceMock,
    createInternalSetupContract: createInternalSetupContractMock,
    createSetupContract: createSetupContractMock,
    createInternalStartContract: createInternalStartContractMock,
    createStartContract: createStartContractMock,
    createMigrationContext: mocks_1.migrationMocks.createContext,
};
