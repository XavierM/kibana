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
const action_service_mock_1 = require("./services/action_service.mock");
const service_registry_mock_1 = require("./services/service_registry.mock");
const createSetupContractMock = () => {
    const mock = {
        actions: action_service_mock_1.actionServiceMock.createSetup(),
        serviceRegistry: service_registry_mock_1.serviceRegistryMock.create(),
    };
    return mock;
};
const createStartContractMock = () => {
    const mock = {
        actions: action_service_mock_1.actionServiceMock.createStart(),
    };
    return mock;
};
exports.savedObjectsManagementPluginMock = {
    createServiceRegistry: service_registry_mock_1.serviceRegistryMock.create,
    createSetupContract: createSetupContractMock,
    createStartContract: createStartContractMock,
};
