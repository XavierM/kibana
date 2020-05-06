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
const mocks_1 = require("../../../core/public/mocks");
const plugin_1 = require("./plugin");
const createSetupContract = () => ({
    creation: {
        addCreationConfig: jest.fn(),
    },
    list: {
        addListConfig: jest.fn(),
    },
});
const createStartContract = () => ({
    creation: {
        getType: jest.fn(),
        getIndexPatternCreationOptions: jest.fn(),
    },
    list: {
        getIndexPatternTags: jest.fn(),
        getFieldInfo: jest.fn(),
        areScriptedFieldsEnabled: jest.fn(),
    },
});
const createInstance = async () => {
    const plugin = new plugin_1.IndexPatternManagementPlugin({});
    const setup = plugin.setup(mocks_1.coreMock.createSetup());
    const doStart = () => plugin.start(mocks_1.coreMock.createStart(), {});
    return {
        plugin,
        setup,
        doStart,
    };
};
exports.mockManagementPlugin = {
    createSetupContract,
    createStartContract,
    createInstance,
};
