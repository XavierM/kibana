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
const object_to_config_adapter_1 = require("./object_to_config_adapter");
const createConfigServiceMock = ({ atPath = {}, getConfig$ = {}, } = {}) => {
    const mocked = {
        atPath: jest.fn(),
        getConfig$: jest.fn(),
        optionalAtPath: jest.fn(),
        getUsedPaths: jest.fn(),
        getUnusedPaths: jest.fn(),
        isEnabledAtPath: jest.fn(),
        setSchema: jest.fn(),
        addDeprecationProvider: jest.fn(),
        validate: jest.fn(),
    };
    mocked.atPath.mockReturnValue(new rxjs_1.BehaviorSubject(atPath));
    mocked.getConfig$.mockReturnValue(new rxjs_1.BehaviorSubject(new object_to_config_adapter_1.ObjectToConfigAdapter(getConfig$)));
    mocked.getUsedPaths.mockResolvedValue([]);
    mocked.getUnusedPaths.mockResolvedValue([]);
    mocked.isEnabledAtPath.mockResolvedValue(true);
    return mocked;
};
exports.configServiceMock = {
    create: createConfigServiceMock,
};
