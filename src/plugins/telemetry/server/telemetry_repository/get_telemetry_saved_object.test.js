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
const get_telemetry_saved_object_1 = require("./get_telemetry_saved_object");
const server_1 = require("../../../../core/server");
describe('getTelemetrySavedObject', () => {
    it('returns null when saved object not found', async () => {
        const params = getCallGetTelemetrySavedObjectParams({
            savedObjectNotFound: true,
        });
        const result = await callGetTelemetrySavedObject(params);
        expect(result).toBe(null);
    });
    it('returns false when saved object forbidden', async () => {
        const params = getCallGetTelemetrySavedObjectParams({
            savedObjectForbidden: true,
        });
        const result = await callGetTelemetrySavedObject(params);
        expect(result).toBe(false);
    });
    it('throws an error on unexpected saved object error', async () => {
        const params = getCallGetTelemetrySavedObjectParams({
            savedObjectOtherError: true,
        });
        let threw = false;
        try {
            await callGetTelemetrySavedObject(params);
        }
        catch (err) {
            threw = true;
            expect(err.message).toBe(SavedObjectOtherErrorMessage);
        }
        expect(threw).toBe(true);
    });
});
const DefaultParams = {
    savedObjectNotFound: false,
    savedObjectForbidden: false,
    savedObjectOtherError: false,
};
function getCallGetTelemetrySavedObjectParams(overrides) {
    return { ...DefaultParams, ...overrides };
}
async function callGetTelemetrySavedObject(params) {
    const savedObjectsClient = getMockSavedObjectsClient(params);
    return await get_telemetry_saved_object_1.getTelemetrySavedObject(savedObjectsClient);
}
const SavedObjectForbiddenMessage = 'savedObjectForbidden';
const SavedObjectOtherErrorMessage = 'savedObjectOtherError';
function getMockSavedObjectsClient(params) {
    return {
        async get(type, id) {
            if (params.savedObjectNotFound)
                throw server_1.SavedObjectsErrorHelpers.createGenericNotFoundError();
            if (params.savedObjectForbidden)
                throw server_1.SavedObjectsErrorHelpers.decorateForbiddenError(new Error(SavedObjectForbiddenMessage));
            if (params.savedObjectOtherError)
                throw server_1.SavedObjectsErrorHelpers.decorateGeneralError(new Error(SavedObjectOtherErrorMessage));
            return { attributes: { enabled: null } };
        },
    };
}
