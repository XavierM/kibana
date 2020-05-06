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
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const filter_manager_1 = require("./filter_manager");
const mocks_1 = require("../../../../../core/public/mocks");
const public_1 = require("../../../../data/public");
const setupMock = mocks_1.coreMock.createSetup();
class FilterManagerTest extends filter_manager_1.FilterManager {
    createFilter() {
        return {};
    }
    getValueFromFilterBar() {
        return null;
    }
}
describe('FilterManager', function () {
    const controlId = 'control1';
    describe('findFilters', function () {
        const indexPatternMock = {};
        let kbnFilters;
        const queryFilterMock = new public_1.FilterManager(setupMock.uiSettings);
        queryFilterMock.getAppFilters = () => kbnFilters;
        queryFilterMock.getGlobalFilters = () => [];
        let filterManager;
        beforeEach(() => {
            kbnFilters = [];
            filterManager = new FilterManagerTest(controlId, 'field1', indexPatternMock, queryFilterMock);
        });
        test('should not find filters that are not controlled by any visualization', function () {
            kbnFilters.push({});
            const foundFilters = filterManager.findFilters();
            expect_1.default(foundFilters.length).to.be(0);
        });
        test('should not find filters that are controlled by other Visualizations', function () {
            kbnFilters.push({
                meta: {
                    controlledBy: 'anotherControl',
                },
            });
            const foundFilters = filterManager.findFilters();
            expect_1.default(foundFilters.length).to.be(0);
        });
        test('should find filter that is controlled by target Visualization', function () {
            kbnFilters.push({
                meta: {
                    controlledBy: controlId,
                },
            });
            const foundFilters = filterManager.findFilters();
            expect_1.default(foundFilters.length).to.be(1);
        });
    });
});
