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
const enzyme_1 = require("enzyme");
jest.mock('@elastic/eui', () => {
    return {
        EuiContext: function MockEuiContext() {
            // no-op
        },
    };
});
jest.mock('@kbn/i18n/react', () => {
    return {
        I18nProvider: function MockI18nProvider() {
            // no-op
        },
    };
});
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_service_1 = require("./i18n_service");
afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
});
describe('#start()', () => {
    it('returns `Context` component', () => {
        const i18nService = new i18n_service_1.I18nService();
        const i18n = i18nService.start();
        expect(enzyme_1.shallow(react_1.default.createElement(i18n.Context, null, "content"))).toMatchSnapshot();
    });
});
