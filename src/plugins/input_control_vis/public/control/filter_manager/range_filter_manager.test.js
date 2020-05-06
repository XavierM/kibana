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
const range_filter_manager_1 = require("./range_filter_manager");
describe('RangeFilterManager', function () {
    const controlId = 'control1';
    describe('createFilter', function () {
        const indexPatternId = '1';
        const fieldMock = {
            name: 'field1',
        };
        const indexPatternMock = {
            id: indexPatternId,
            fields: {
                getByName: (name) => {
                    const fields = {
                        field1: fieldMock,
                    };
                    return fields[name];
                },
            },
        };
        const queryFilterMock = {};
        let filterManager;
        beforeEach(() => {
            filterManager = new range_filter_manager_1.RangeFilterManager(controlId, 'field1', indexPatternMock, queryFilterMock);
        });
        test('should create range filter from slider value', function () {
            const newFilter = filterManager.createFilter({ min: 1, max: 3 });
            expect_1.default(newFilter).to.have.property('meta');
            expect_1.default(newFilter.meta.index).to.be(indexPatternId);
            expect_1.default(newFilter.meta.controlledBy).to.be(controlId);
            expect_1.default(newFilter.meta.key).to.be('field1');
            expect_1.default(newFilter).to.have.property('range');
            expect_1.default(JSON.stringify(newFilter.range, null, '')).to.be('{"field1":{"gte":1,"lte":3}}');
        });
    });
    describe('getValueFromFilterBar', function () {
        class MockFindFiltersRangeFilterManager extends range_filter_manager_1.RangeFilterManager {
            constructor(id, fieldName, indexPattern, queryFilter) {
                super(id, fieldName, indexPattern, queryFilter);
                this.mockFilters = [];
            }
            findFilters() {
                return this.mockFilters;
            }
            setMockFilters(mockFilters) {
                this.mockFilters = mockFilters;
            }
        }
        const indexPatternMock = {};
        const queryFilterMock = {};
        let filterManager;
        beforeEach(() => {
            filterManager = new MockFindFiltersRangeFilterManager(controlId, 'field1', indexPatternMock, queryFilterMock);
        });
        test('should extract value from range filter', function () {
            filterManager.setMockFilters([
                {
                    range: {
                        field1: {
                            gt: 1,
                            lt: 3,
                        },
                    },
                    meta: {},
                },
            ]);
            const value = filterManager.getValueFromFilterBar();
            expect_1.default(value).to.be.a('object');
            expect_1.default(value).to.have.property('min');
            expect_1.default(value?.min).to.be(1);
            expect_1.default(value).to.have.property('max');
            expect_1.default(value?.max).to.be(3);
        });
        test('should return undefined when filter value can not be extracted from Kibana filter', function () {
            filterManager.setMockFilters([
                {
                    range: {
                        myFieldWhichIsNotField1: {
                            gte: 1,
                            lte: 3,
                        },
                    },
                    meta: {},
                },
            ]);
            expect_1.default(filterManager.getValueFromFilterBar()).to.eql(undefined);
        });
    });
});
