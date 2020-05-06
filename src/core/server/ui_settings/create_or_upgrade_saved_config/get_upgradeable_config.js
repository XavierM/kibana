"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_config_version_upgradeable_1 = require("./is_config_version_upgradeable");
/**
 *  Find the most recent SavedConfig that is upgradeable to the specified version
 *  @param {Object} options
 *  @property {SavedObjectsClient} savedObjectsClient
 *  @property {string} version
 *  @return {Promise<SavedConfig|undefined>}
 */
async function getUpgradeableConfig({ savedObjectsClient, version, }) {
    // attempt to find a config we can upgrade
    const { saved_objects: savedConfigs } = await savedObjectsClient.find({
        type: 'config',
        page: 1,
        perPage: 1000,
        sortField: 'buildNum',
        sortOrder: 'desc',
    });
    // try to find a config that we can upgrade
    return savedConfigs.find(savedConfig => is_config_version_upgradeable_1.isConfigVersionUpgradeable(savedConfig.id, version));
}
exports.getUpgradeableConfig = getUpgradeableConfig;
