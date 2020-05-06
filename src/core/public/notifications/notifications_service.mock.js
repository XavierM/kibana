"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toasts_service_mock_1 = require("./toasts/toasts_service.mock");
const createSetupContractMock = () => {
    const setupContract = {
        // we have to suppress type errors until decide how to mock es6 class
        toasts: toasts_service_mock_1.toastsServiceMock.createSetupContract(),
    };
    return setupContract;
};
const createStartContractMock = () => {
    const startContract = {
        // we have to suppress type errors until decide how to mock es6 class
        toasts: toasts_service_mock_1.toastsServiceMock.createStartContract(),
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
    return mocked;
};
exports.notificationServiceMock = {
    create: createMock,
    createSetupContract: createSetupContractMock,
    createStartContract: createStartContractMock,
};
