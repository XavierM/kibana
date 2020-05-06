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
const _1 = require(".");
const mocks_1 = require("../../../core/public/mocks");
const createSetupContract = () => {
    const setupContract = {
        attachAction: jest.fn(),
        detachAction: jest.fn(),
        registerAction: jest.fn(),
        registerTrigger: jest.fn(),
    };
    return setupContract;
};
const createStartContract = () => {
    const startContract = {
        attachAction: jest.fn(),
        registerAction: jest.fn(),
        registerTrigger: jest.fn(),
        getAction: jest.fn(),
        detachAction: jest.fn(),
        executeTriggerActions: jest.fn(),
        getTrigger: jest.fn(),
        getTriggerActions: jest.fn((id) => []),
        getTriggerCompatibleActions: jest.fn(),
        clear: jest.fn(),
        fork: jest.fn(),
    };
    return startContract;
};
const createPlugin = (coreSetup = mocks_1.coreMock.createSetup(), coreStart = mocks_1.coreMock.createStart()) => {
    const pluginInitializerContext = mocks_1.coreMock.createPluginInitializerContext();
    const plugin = _1.plugin(pluginInitializerContext);
    const setup = plugin.setup(coreSetup);
    return {
        pluginInitializerContext,
        coreSetup,
        coreStart,
        plugin,
        setup,
        doStart: (anotherCoreStart = coreStart) => plugin.start(anotherCoreStart),
    };
};
exports.uiActionsPluginMock = {
    createSetupContract,
    createStartContract,
    createPlugin,
};
