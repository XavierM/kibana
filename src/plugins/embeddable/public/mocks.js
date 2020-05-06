"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
const mocks_1 = require("../../../core/public/mocks");
// eslint-disable-next-line
const mocks_2 = require("../../inspector/public/mocks");
// eslint-disable-next-line
const mocks_3 = require("../../ui_actions/public/mocks");
const createSetupContract = () => {
    const setupContract = {
        registerEmbeddableFactory: jest.fn(),
        setCustomEmbeddableFactoryProvider: jest.fn(),
    };
    return setupContract;
};
const createStartContract = () => {
    const startContract = {
        getEmbeddableFactories: jest.fn(),
        getEmbeddableFactory: jest.fn(),
        EmbeddablePanel: jest.fn(),
    };
    return startContract;
};
const createInstance = () => {
    const plugin = new plugin_1.EmbeddablePublicPlugin({});
    const setup = plugin.setup(mocks_1.coreMock.createSetup(), {
        uiActions: mocks_3.uiActionsPluginMock.createSetupContract(),
    });
    const doStart = () => plugin.start(mocks_1.coreMock.createStart(), {
        uiActions: mocks_3.uiActionsPluginMock.createStartContract(),
        inspector: mocks_2.inspectorPluginMock.createStartContract(),
    });
    return {
        plugin,
        setup,
        doStart,
    };
};
exports.embeddablePluginMock = {
    createSetupContract,
    createStartContract,
    createInstance,
};
