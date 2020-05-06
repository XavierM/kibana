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
const management_section_1 = require("./management_section");
// @ts-ignore
const legacy_1 = require("./legacy");
const mocks_1 = require("../../../core/public/mocks");
function createSection(registerLegacyApp) {
    const legacySection = new legacy_1.LegacyManagementSection('legacy');
    const getLegacySection = () => legacySection;
    const getManagementSections = () => [];
    const testSectionConfig = { id: 'test-section', title: 'Test Section' };
    return new management_section_1.ManagementSection(testSectionConfig, getManagementSections, registerLegacyApp, getLegacySection, mocks_1.coreMock.createSetup().getStartServices);
}
test('cannot register two apps with the same id', () => {
    const registerLegacyApp = jest.fn();
    const section = createSection(registerLegacyApp);
    const testAppConfig = { id: 'test-app', title: 'Test App', mount: () => () => { } };
    section.registerApp(testAppConfig);
    expect(registerLegacyApp).toHaveBeenCalled();
    expect(section.apps.length).toEqual(1);
    expect(() => {
        section.registerApp(testAppConfig);
    }).toThrow();
});
test('can enable and disable apps', () => {
    const registerLegacyApp = jest.fn();
    const section = createSection(registerLegacyApp);
    const testAppConfig = { id: 'test-app', title: 'Test App', mount: () => () => { } };
    const app = section.registerApp(testAppConfig);
    expect(section.getAppsEnabled().length).toEqual(1);
    app.disable();
    expect(section.getAppsEnabled().length).toEqual(0);
});
