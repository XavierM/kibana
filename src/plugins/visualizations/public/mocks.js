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
const plugin_1 = require("./plugin");
const mocks_1 = require("../../../core/public/mocks");
const mocks_2 = require("../../../plugins/embeddable/public/mocks");
const mocks_3 = require("../../../plugins/expressions/public/mocks");
const mocks_4 = require("../../../plugins/data/public/mocks");
const mocks_5 = require("../../../plugins/usage_collection/public/mocks");
const mocks_6 = require("../../../plugins/ui_actions/public/mocks");
const mocks_7 = require("../../../plugins/inspector/public/mocks");
const createSetupContract = () => ({
    createBaseVisualization: jest.fn(),
    createReactVisualization: jest.fn(),
    registerAlias: jest.fn(),
    hideTypes: jest.fn(),
});
const createStartContract = () => ({
    get: jest.fn(),
    all: jest.fn(),
    getAliases: jest.fn(),
    savedVisualizationsLoader: {},
    showNewVisModal: jest.fn(),
    createVis: jest.fn(),
    convertFromSerializedVis: jest.fn(),
    convertToSerializedVis: jest.fn(),
    __LEGACY: {
        createVisEmbeddableFromObject: jest.fn(),
    },
});
const createInstance = async () => {
    const plugin = new plugin_1.VisualizationsPlugin({});
    const setup = plugin.setup(mocks_1.coreMock.createSetup(), {
        data: mocks_4.dataPluginMock.createSetupContract(),
        embeddable: mocks_2.embeddablePluginMock.createSetupContract(),
        expressions: mocks_3.expressionsPluginMock.createSetupContract(),
        inspector: mocks_7.inspectorPluginMock.createSetupContract(),
        usageCollection: mocks_5.usageCollectionPluginMock.createSetupContract(),
    });
    const doStart = () => plugin.start(mocks_1.coreMock.createStart(), {
        data: mocks_4.dataPluginMock.createStartContract(),
        expressions: mocks_3.expressionsPluginMock.createStartContract(),
        inspector: mocks_7.inspectorPluginMock.createStartContract(),
        uiActions: mocks_6.uiActionsPluginMock.createStartContract(),
    });
    return {
        plugin,
        setup,
        doStart,
    };
};
exports.visualizationsPluginMock = {
    createSetupContract,
    createStartContract,
    createInstance,
};
