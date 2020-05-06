"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const get_telemetry_opt_in_1 = require("./get_telemetry_opt_in");
describe('getTelemetryOptIn', () => {
    it('returns null when saved object not found', () => {
        const params = getCallGetTelemetryOptInParams({
            savedObjectNotFound: true,
        });
        const result = callGetTelemetryOptIn(params);
        expect(result).toBe(null);
    });
    it('returns false when saved object forbidden', () => {
        const params = getCallGetTelemetryOptInParams({
            savedObjectForbidden: true,
        });
        const result = callGetTelemetryOptIn(params);
        expect(result).toBe(false);
    });
    it('returns null if enabled is null or undefined', () => {
        for (const enabled of [null, undefined]) {
            const params = getCallGetTelemetryOptInParams({
                enabled,
            });
            const result = callGetTelemetryOptIn(params);
            expect(result).toBe(null);
        }
    });
    it('returns true when enabled is true', () => {
        const params = getCallGetTelemetryOptInParams({
            enabled: true,
        });
        const result = callGetTelemetryOptIn(params);
        expect(result).toBe(true);
    });
    const EnabledFalseVersionChecks = [
        { lastVersionChecked: '8.0.0', currentKibanaVersion: '8.0.0', result: false },
        { lastVersionChecked: '8.0.0', currentKibanaVersion: '8.0.1', result: false },
        { lastVersionChecked: '8.0.1', currentKibanaVersion: '8.0.0', result: false },
        { lastVersionChecked: '8.0.0', currentKibanaVersion: '8.1.0', result: null },
        { lastVersionChecked: '8.0.0', currentKibanaVersion: '9.0.0', result: null },
        { lastVersionChecked: '8.0.0', currentKibanaVersion: '7.0.0', result: false },
        { lastVersionChecked: '8.1.0', currentKibanaVersion: '8.0.0', result: false },
        { lastVersionChecked: '8.0.0-X', currentKibanaVersion: '8.0.0', result: false },
        { lastVersionChecked: '8.0.0', currentKibanaVersion: '8.0.0-X', result: false },
        { lastVersionChecked: null, currentKibanaVersion: '8.0.0', result: null },
        { lastVersionChecked: undefined, currentKibanaVersion: '8.0.0', result: null },
        { lastVersionChecked: 5, currentKibanaVersion: '8.0.0', result: null },
        { lastVersionChecked: '8.0.0', currentKibanaVersion: 'beta', result: null },
        { lastVersionChecked: 'beta', currentKibanaVersion: '8.0.0', result: null },
        { lastVersionChecked: 'beta', currentKibanaVersion: 'beta', result: false },
        { lastVersionChecked: 'BETA', currentKibanaVersion: 'beta', result: null },
    ].map(el => ({ ...el, enabled: false }));
    // build a table of tests with version checks, with results for enabled true/null/undefined
    const EnabledTrueVersionChecks = EnabledFalseVersionChecks.map(el => ({
        ...el,
        enabled: true,
        result: true,
    }));
    const EnabledNullVersionChecks = EnabledFalseVersionChecks.map(el => ({
        ...el,
        enabled: null,
        result: null,
    }));
    const EnabledUndefinedVersionChecks = EnabledFalseVersionChecks.map(el => ({
        ...el,
        enabled: undefined,
        result: null,
    }));
    const AllVersionChecks = [
        ...EnabledFalseVersionChecks,
        ...EnabledTrueVersionChecks,
        ...EnabledNullVersionChecks,
        ...EnabledUndefinedVersionChecks,
    ];
    test.each(AllVersionChecks)('returns expected result for version check with %j', async (params) => {
        const result = await callGetTelemetryOptIn({ ...DefaultParams, ...params });
        expect(result).toBe(params.result);
    });
});
const DefaultParams = {
    savedObjectNotFound: false,
    savedObjectForbidden: false,
    enabled: true,
    lastVersionChecked: '8.0.0',
    currentKibanaVersion: '8.0.0',
    configTelemetryOptIn: null,
    allowChangingOptInStatus: true,
};
function getCallGetTelemetryOptInParams(overrides) {
    return { ...DefaultParams, ...overrides };
}
function callGetTelemetryOptIn(params) {
    const { currentKibanaVersion, configTelemetryOptIn, allowChangingOptInStatus } = params;
    const telemetrySavedObject = getMockTelemetrySavedObject(params);
    return get_telemetry_opt_in_1.getTelemetryOptIn({
        currentKibanaVersion,
        telemetrySavedObject,
        allowChangingOptInStatus,
        configTelemetryOptIn,
    });
}
function getMockTelemetrySavedObject(params) {
    const { savedObjectNotFound, savedObjectForbidden } = params;
    if (savedObjectForbidden) {
        return false;
    }
    if (savedObjectNotFound) {
        return null;
    }
    return {
        enabled: params.enabled,
        lastVersionChecked: params.lastVersionChecked,
    };
}
