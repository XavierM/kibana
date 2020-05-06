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
const logging_service_mock_1 = require("../logging/logging_service.mock");
exports.logger = logging_service_mock_1.loggingServiceMock.create();
jest.doMock('../logging/logging_service', () => ({
    LoggingService: jest.fn(() => exports.logger),
}));
const config_service_mock_1 = require("../config/config_service.mock");
exports.configService = config_service_mock_1.configServiceMock.create();
jest.doMock('../config/config_service', () => ({
    ConfigService: jest.fn(() => exports.configService),
}));
const raw_config_service_mock_1 = require("../config/raw_config_service.mock");
exports.rawConfigService = raw_config_service_mock_1.rawConfigServiceMock.create();
jest.doMock('../config/raw_config_service', () => ({
    RawConfigService: jest.fn(() => exports.rawConfigService),
}));
exports.mockServer = {
    setupCoreConfig: jest.fn(),
    setup: jest.fn(),
    stop: jest.fn(),
    configService: exports.configService,
};
jest.mock('../server', () => ({ Server: jest.fn(() => exports.mockServer) }));
