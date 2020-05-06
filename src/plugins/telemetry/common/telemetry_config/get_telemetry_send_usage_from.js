"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTelemetrySendUsageFrom({ telemetrySavedObject, configTelemetrySendUsageFrom, }) {
    if (!telemetrySavedObject) {
        return configTelemetrySendUsageFrom;
    }
    if (typeof telemetrySavedObject.sendUsageFrom === 'undefined') {
        return configTelemetrySendUsageFrom;
    }
    return telemetrySavedObject.sendUsageFrom;
}
exports.getTelemetrySendUsageFrom = getTelemetrySendUsageFrom;
