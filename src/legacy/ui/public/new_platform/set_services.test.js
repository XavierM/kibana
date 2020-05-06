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
const new_platform_1 = require("./new_platform");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const dataServices = tslib_1.__importStar(require("../../../../plugins/data/public/services"));
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const visualizationsServices = tslib_1.__importStar(require("../../../../plugins/visualizations/public/services"));
const mocks_1 = require("../../../../core/public/mocks");
const __mocks__1 = require("./__mocks__");
describe('ui/new_platform', () => {
    describe('set service getters', () => {
        const testServiceGetters = (name, services) => {
            const getters = Object.keys(services).filter(k => k.substring(0, 3) === 'get');
            getters.forEach(g => {
                it(`ui/new_platform sets a value for ${name} getter ${g}`, () => {
                    new_platform_1.__reset__();
                    new_platform_1.__setup__(mocks_1.coreMock.createSetup(), __mocks__1.npSetup.plugins);
                    new_platform_1.__start__(mocks_1.coreMock.createStart(), __mocks__1.npStart.plugins);
                    expect(services[g]()).toBeDefined();
                });
            });
        };
        testServiceGetters('data', dataServices);
        testServiceGetters('visualizations', visualizationsServices);
    });
});
