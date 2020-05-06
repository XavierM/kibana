"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSetupContractMock = () => {
    const setupContract = {
        getBasePath: jest.fn(),
        getServerBasePath: jest.fn(),
        getKibanaVersion: jest.fn(),
        getKibanaBranch: jest.fn(),
        getCspConfig: jest.fn(),
        getLegacyMode: jest.fn(),
        getLegacyMetadata: jest.fn(),
        getPlugins: jest.fn(),
        getInjectedVar: jest.fn(),
        getInjectedVars: jest.fn(),
        getKibanaBuildNumber: jest.fn(),
    };
    setupContract.getCspConfig.mockReturnValue({ warnLegacyBrowsers: true });
    setupContract.getKibanaVersion.mockReturnValue('kibanaVersion');
    setupContract.getLegacyMode.mockReturnValue(true);
    setupContract.getLegacyMetadata.mockReturnValue({
        app: {
            id: 'foo',
            title: 'Foo App',
        },
        nav: [],
        uiSettings: {
            defaults: { legacyInjectedUiSettingDefaults: true },
            user: { legacyInjectedUiSettingUserValues: true },
        },
    });
    setupContract.getPlugins.mockReturnValue([]);
    return setupContract;
};
const createStartContractMock = createSetupContractMock;
const createMock = () => ({
    setup: jest.fn().mockReturnValue(createSetupContractMock()),
    start: jest.fn().mockReturnValue(createStartContractMock()),
});
exports.injectedMetadataServiceMock = {
    create: createMock,
    createSetupContract: createSetupContractMock,
    createStartContract: createStartContractMock,
};
