"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSetupContractMock = () => {
    const setupContract = {
        add: jest.fn(() => undefined),
        get$: jest.fn(),
    };
    return setupContract;
};
const createStartContractMock = createSetupContractMock;
const createMock = () => {
    const mocked = {
        setup: jest.fn(),
        start: jest.fn(),
    };
    mocked.setup.mockReturnValue(createSetupContractMock());
    mocked.start.mockReturnValue(createStartContractMock());
    return mocked;
};
exports.fatalErrorsServiceMock = {
    create: createMock,
    createSetupContract: createSetupContractMock,
    createStartContract: createStartContractMock,
};
