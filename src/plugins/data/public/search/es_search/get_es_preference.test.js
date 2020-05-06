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
const get_es_preference_1 = require("./get_es_preference");
const mocks_1 = require("../../../../../core/public/mocks");
describe('Get ES preference', () => {
    let mockCoreStart;
    beforeEach(() => {
        mockCoreStart = mocks_1.coreMock.createStart();
    });
    test('returns the session ID if set to sessionId', () => {
        mockCoreStart.uiSettings.get.mockImplementation((key) => {
            if (key === 'courier:setRequestPreference')
                return 'sessionId';
            if (key === 'courier:customRequestPreference')
                return 'foobar';
        });
        const preference = get_es_preference_1.getEsPreference(mockCoreStart.uiSettings, 'my_session_id');
        expect(preference).toBe('my_session_id');
    });
    test('returns the custom preference if set to custom', () => {
        mockCoreStart.uiSettings.get.mockImplementation((key) => {
            if (key === 'courier:setRequestPreference')
                return 'custom';
            if (key === 'courier:customRequestPreference')
                return 'foobar';
        });
        const preference = get_es_preference_1.getEsPreference(mockCoreStart.uiSettings);
        expect(preference).toBe('foobar');
    });
    test('returns undefined if set to none', () => {
        mockCoreStart.uiSettings.get.mockImplementation((key) => {
            if (key === 'courier:setRequestPreference')
                return 'none';
            if (key === 'courier:customRequestPreference')
                return 'foobar';
        });
        const preference = get_es_preference_1.getEsPreference(mockCoreStart.uiSettings);
        expect(preference).toBe(undefined);
    });
});
