"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNpUiPluginPublicDirs(kbnServer) {
    return Array.from(kbnServer.newPlatform.__internals.uiPlugins.internal.entries()).map(([id, { publicTargetDir }]) => ({
        id,
        path: publicTargetDir,
    }));
}
exports.getNpUiPluginPublicDirs = getNpUiPluginPublicDirs;
function isNpUiPluginPublicDirs(x) {
    return (Array.isArray(x) &&
        x.every(s => typeof s === 'object' && s && typeof s.id === 'string' && typeof s.path === 'string'));
}
exports.isNpUiPluginPublicDirs = isNpUiPluginPublicDirs;
function assertIsNpUiPluginPublicDirs(x) {
    if (!isNpUiPluginPublicDirs(x)) {
        throw new TypeError('npUiPluginPublicDirs must be an array of objects with string `id` and `path` properties');
    }
}
exports.assertIsNpUiPluginPublicDirs = assertIsNpUiPluginPublicDirs;
