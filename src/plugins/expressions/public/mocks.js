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
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const _1 = require(".");
/* eslint-disable */
const mocks_1 = require("../../../core/public/mocks");
const mocks_2 = require("../../bfetch/public/mocks");
const createSetupContract = () => {
    const setupContract = {
        fork: jest.fn(),
        getFunction: jest.fn(),
        getFunctions: jest.fn(),
        getRenderer: jest.fn(),
        getRenderers: jest.fn(),
        getType: jest.fn(),
        getTypes: jest.fn(),
        registerFunction: jest.fn(),
        registerRenderer: jest.fn(),
        registerType: jest.fn(),
        run: jest.fn(),
        __LEGACY: {
            functions: {
                register: () => { },
            },
            renderers: {
                register: () => { },
            },
            types: {
                register: () => { },
            },
            getExecutor: () => ({
                interpreter: {
                    interpretAst: (() => { }),
                },
            }),
            loadLegacyServerFunctionWrappers: () => Promise.resolve(),
        },
    };
    return setupContract;
};
const createStartContract = () => {
    return {
        execute: jest.fn(),
        ExpressionLoader: jest.fn(),
        ExpressionRenderHandler: jest.fn(),
        fork: jest.fn(),
        getFunction: jest.fn(),
        getFunctions: jest.fn(),
        getRenderer: jest.fn(),
        getRenderers: jest.fn(),
        getType: jest.fn(),
        getTypes: jest.fn(),
        loader: jest.fn(),
        ReactExpressionRenderer: jest.fn(props => react_1.default.createElement(react_1.default.Fragment, null)),
        render: jest.fn(),
        run: jest.fn(),
    };
};
const createPlugin = async () => {
    const pluginInitializerContext = mocks_1.coreMock.createPluginInitializerContext();
    const coreSetup = mocks_1.coreMock.createSetup();
    const coreStart = mocks_1.coreMock.createStart();
    const plugin = _1.plugin(pluginInitializerContext);
    const setup = await plugin.setup(coreSetup, {
        bfetch: mocks_2.bfetchPluginMock.createSetupContract(),
    });
    return {
        pluginInitializerContext,
        coreSetup,
        coreStart,
        plugin,
        setup,
        doStart: async () => await plugin.start(coreStart, {
            bfetch: mocks_2.bfetchPluginMock.createStartContract(),
        }),
    };
};
exports.expressionsPluginMock = {
    createSetupContract,
    createStartContract,
    createPlugin,
};
