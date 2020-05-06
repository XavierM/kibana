"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const banners_service_mock_1 = require("./banners/banners_service.mock");
const flyout_service_mock_1 = require("./flyout/flyout_service.mock");
const modal_service_mock_1 = require("./modal/modal_service.mock");
const createStartContractMock = () => {
    const overlayStart = modal_service_mock_1.overlayModalServiceMock.createStartContract();
    const startContract = {
        openFlyout: flyout_service_mock_1.overlayFlyoutServiceMock.createStartContract().open,
        openModal: overlayStart.open,
        openConfirm: overlayStart.openConfirm,
        banners: banners_service_mock_1.overlayBannersServiceMock.createStartContract(),
    };
    return startContract;
};
const createMock = () => {
    const mocked = {
        start: jest.fn(),
    };
    mocked.start.mockReturnValue(createStartContractMock());
    return mocked;
};
exports.overlayServiceMock = {
    create: createMock,
    createStartContract: createStartContractMock,
};
