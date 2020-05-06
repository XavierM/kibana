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
const config_schema_1 = require("@kbn/config-schema");
const config_1 = require("../config");
const env_1 = require("../config/__mocks__/env");
const http_service_1 = require("./http_service");
const config_service_mock_1 = require("../config/config_service.mock");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const coreId = Symbol('core');
const env = config_1.Env.createDefault(env_1.getEnvOptions());
const logger = logging_service_mock_1.loggingServiceMock.create();
const configService = config_service_mock_1.configServiceMock.create();
configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({
    hosts: ['localhost'],
    maxPayload: new config_schema_1.ByteSizeValue(1024),
    autoListen: true,
    ssl: {
        enabled: false,
    },
    compression: { enabled: true },
    xsrf: {
        disableProtection: true,
        whitelist: [],
    },
}));
const defaultContext = {
    coreId,
    env,
    logger,
    configService,
};
exports.createCoreContext = (overrides = {}) => ({
    ...defaultContext,
    ...overrides,
});
/**
 * Creates a concrete HttpServer with a mocked context.
 */
exports.createHttpServer = (overrides = {}) => {
    return new http_service_1.HttpService(exports.createCoreContext(overrides));
};
