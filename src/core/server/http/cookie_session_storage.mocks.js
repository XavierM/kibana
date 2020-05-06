"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSessionStorageMock = () => ({
    get: jest.fn().mockResolvedValue({}),
    set: jest.fn(),
    clear: jest.fn(),
});
const creatSessionStorageFactoryMock = () => {
    const mocked = {
        asScoped: jest.fn(),
    };
    mocked.asScoped.mockImplementation(createSessionStorageMock);
    return mocked;
};
exports.sessionStorageMock = {
    create: createSessionStorageMock,
    createFactory: creatSessionStorageFactoryMock,
};
