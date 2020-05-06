"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSetupContract = () => {
    const setupContract = {
        registerMenuItem: jest.fn(),
    };
    return setupContract;
};
const createStartContract = () => {
    const startContract = {
        ui: {
            TopNavMenu: jest.fn(),
        },
    };
    return startContract;
};
exports.navigationPluginMock = {
    createSetupContract,
    createStartContract,
};
