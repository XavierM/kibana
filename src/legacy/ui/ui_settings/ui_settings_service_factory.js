"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Create an instance of UiSettingsClient that will use the
 *  passed `savedObjectsClient` to communicate with elasticsearch
 *
 *  @return {IUiSettingsClient}
 */
function uiSettingsServiceFactory(server, options) {
    return server.newPlatform.__internals.uiSettings.asScopedToClient(options.savedObjectsClient);
}
exports.uiSettingsServiceFactory = uiSettingsServiceFactory;
