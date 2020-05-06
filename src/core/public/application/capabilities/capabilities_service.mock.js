"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const createStartContractMock = () => ({
    capabilities: utils_1.deepFreeze({
        catalogue: {},
        management: {},
        navLinks: {},
    }),
});
const createMock = () => ({
    start: jest.fn().mockImplementation(createStartContractMock),
});
exports.capabilitiesServiceMock = {
    create: createMock,
    createStartContract: createStartContractMock,
};
