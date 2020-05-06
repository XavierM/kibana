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
const timefilter_service_mock_1 = require("./timefilter/timefilter_service.mock");
const createSetupContractMock = () => {
    const setupContract = {
        filterManager: jest.fn(),
        timefilter: timefilter_service_mock_1.timefilterServiceMock.createSetupContract(),
        state$: new rxjs_1.Observable(),
    };
    return setupContract;
};
const createStartContractMock = () => {
    const startContract = {
        filterManager: jest.fn(),
        timefilter: timefilter_service_mock_1.timefilterServiceMock.createStartContract(),
        savedQueries: jest.fn(),
        state$: new rxjs_1.Observable(),
    };
    return startContract;
};
const createMock = () => {
    const mocked = {
        setup: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
    };
    mocked.setup.mockReturnValue(createSetupContractMock());
    mocked.start.mockReturnValue(createStartContractMock());
    return mocked;
};
exports.queryServiceMock = {
    create: createMock,
    createSetupContract: createSetupContractMock,
    createStartContract: createStartContractMock,
};
