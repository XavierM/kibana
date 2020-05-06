"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createMock = () => {
    const mocked = {
        legacyId: Symbol(),
        setup: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
    };
    return mocked;
};
exports.legacyPlatformServiceMock = {
    create: createMock,
};
