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
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const welcome_1 = require("./welcome");
const mocks_1 = require("../../../../telemetry/public/mocks");
jest.mock('../kibana_services', () => ({
    getServices: () => ({
        addBasePath: (path) => `root${path}`,
        trackUiMetric: () => { },
    }),
}));
test('should render a Welcome screen with the telemetry disclaimer', () => {
    const telemetry = mocks_1.telemetryPluginMock.createSetupContract();
    const component = enzyme_1.shallow(
    // @ts-ignore
    react_1.default.createElement(welcome_1.Welcome, { urlBasePath: "/", onSkip: () => { }, telemetry: telemetry }));
    expect(component).toMatchSnapshot();
});
test('should render a Welcome screen with the telemetry disclaimer when optIn is true', () => {
    const telemetry = mocks_1.telemetryPluginMock.createSetupContract();
    telemetry.telemetryService.getIsOptedIn = jest.fn().mockReturnValue(true);
    const component = enzyme_1.shallow(
    // @ts-ignore
    react_1.default.createElement(welcome_1.Welcome, { urlBasePath: "/", onSkip: () => { }, telemetry: telemetry }));
    expect(component).toMatchSnapshot();
});
test('should render a Welcome screen with the telemetry disclaimer when optIn is false', () => {
    const telemetry = mocks_1.telemetryPluginMock.createSetupContract();
    telemetry.telemetryService.getIsOptedIn = jest.fn().mockReturnValue(false);
    const component = enzyme_1.shallow(
    // @ts-ignore
    react_1.default.createElement(welcome_1.Welcome, { urlBasePath: "/", onSkip: () => { }, telemetry: telemetry }));
    expect(component).toMatchSnapshot();
});
test('should render a Welcome screen with no telemetry disclaimer', () => {
    // @ts-ignore
    const component = enzyme_1.shallow(
    // @ts-ignore
    react_1.default.createElement(welcome_1.Welcome, { urlBasePath: "/", onSkip: () => { }, telemetry: null }));
    expect(component).toMatchSnapshot();
});
test('fires opt-in seen when mounted', () => {
    const telemetry = mocks_1.telemetryPluginMock.createSetupContract();
    const mockSetOptedInNoticeSeen = jest.fn();
    // @ts-ignore
    telemetry.telemetryNotifications.setOptedInNoticeSeen = mockSetOptedInNoticeSeen;
    enzyme_1.shallow(
    // @ts-ignore
    react_1.default.createElement(welcome_1.Welcome, { urlBasePath: "/", onSkip: () => { }, telemetry: telemetry }));
    expect(mockSetOptedInNoticeSeen).toHaveBeenCalled();
});
