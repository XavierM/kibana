"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTelemetryFailureDetails({ telemetrySavedObject, }) {
    if (!telemetrySavedObject) {
        return {
            failureVersion: undefined,
            failureCount: 0,
        };
    }
    const { reportFailureCount, reportFailureVersion } = telemetrySavedObject;
    return {
        failureCount: typeof reportFailureCount === 'number' ? reportFailureCount : 0,
        failureVersion: typeof reportFailureVersion === 'string' ? reportFailureVersion : undefined,
    };
}
exports.getTelemetryFailureDetails = getTelemetryFailureDetails;
