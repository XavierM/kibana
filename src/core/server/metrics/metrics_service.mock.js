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
const createSetupContractMock = () => {
    const setupContract = {
        getOpsMetrics$: jest.fn(),
    };
    return setupContract;
};
const createInternalSetupContractMock = () => {
    const setupContract = createSetupContractMock();
    return setupContract;
};
const createStartContractMock = () => {
    const startContract = {};
    return startContract;
};
const createInternalStartContractMock = () => {
    const startContract = createStartContractMock();
    return startContract;
};
const createMock = () => {
    const mocked = {
        setup: jest.fn().mockReturnValue(createInternalSetupContractMock()),
        start: jest.fn().mockReturnValue(createInternalStartContractMock()),
        stop: jest.fn(),
    };
    return mocked;
};
exports.metricsServiceMock = {
    create: createMock,
    createSetupContract: createSetupContractMock,
    createStartContract: createStartContractMock,
    createInternalSetupContract: createInternalSetupContractMock,
    createInternalStartContract: createInternalStartContractMock,
};
