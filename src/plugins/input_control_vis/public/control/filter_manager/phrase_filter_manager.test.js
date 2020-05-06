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
const phrase_filter_manager_1 = require("./phrase_filter_manager");
describe('PhraseFilterManager', function () {
    const controlId = 'control1';
    describe('createFilter', function () {
        const indexPatternId = '1';
        const fieldMock = {
            name: 'field1',
            format: {
                convert: (value) => value,
            },
        };
        const indexPatternMock = {
            id: indexPatternId,
            fields: {
                getByName: (name) => {
                    const fields = { field1: fieldMock };
                    return fields[name];
                },
            },
        };
        const queryFilterMock = {};
        let filterManager;
        beforeEach(() => {
            filterManager = new phrase_filter_manager_1.PhraseFilterManager(controlId, 'field1', indexPatternMock, queryFilterMock);
        });
        test('should create match phrase filter from single value', function () {
            const newFilter = filterManager.createFilter(['ios']);
            expect_1.default(newFilter).to.have.property('meta');
            expect_1.default(newFilter.meta.index).to.be(indexPatternId);
            expect_1.default(newFilter.meta.controlledBy).to.be(controlId);
            expect_1.default(newFilter.meta.key).to.be('field1');
            expect_1.default(newFilter).to.have.property('query');
            expect_1.default(JSON.stringify(newFilter.query, null, '')).to.be('{"match_phrase":{"field1":"ios"}}');
        });
        test('should create bool filter from multiple values', function () {
            const newFilter = filterManager.createFilter(['ios', 'win xp']);
            expect_1.default(newFilter).to.have.property('meta');
            expect_1.default(newFilter.meta.index).to.be(indexPatternId);
            expect_1.default(newFilter.meta.controlledBy).to.be(controlId);
            expect_1.default(newFilter.meta.key).to.be('field1');
            expect_1.default(newFilter).to.have.property('query');
            const query = newFilter.query;
            expect_1.default(query).to.have.property('bool');
            expect_1.default(query.bool.should.length).to.be(2);
            expect_1.default(JSON.stringify(query.bool.should[0], null, '')).to.be('{"match_phrase":{"field1":"ios"}}');
            expect_1.default(JSON.stringify(query.bool.should[1], null, '')).to.be('{"match_phrase":{"field1":"win xp"}}');
        });
    });
    describe('getValueFromFilterBar', function () {
        class MockFindFiltersPhraseFilterManager extends phrase_filter_manager_1.PhraseFilterManager {
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
            filterManager = new MockFindFiltersPhraseFilterManager(controlId, 'field1', indexPatternMock, queryFilterMock);
        });
        test('should extract value from match phrase filter', function () {
            filterManager.setMockFilters([
                {
                    query: {
                        match: {
                            field1: {
                                query: 'ios',
                                type: 'phrase',
                            },
                        },
                    },
                },
            ]);
            expect_1.default(filterManager.getValueFromFilterBar()).to.eql(['ios']);
        });
        test('should extract value from multiple filters', function () {
            filterManager.setMockFilters([
                {
                    query: {
                        match: {
                            field1: {
                                query: 'ios',
                                type: 'phrase',
                            },
                        },
                    },
                },
                {
                    query: {
                        match: {
                            field1: {
                                query: 'win xp',
                                type: 'phrase',
                            },
                        },
                    },
                },
            ]);
            expect_1.default(filterManager.getValueFromFilterBar()).to.eql(['ios', 'win xp']);
        });
        test('should extract value from bool filter', function () {
            filterManager.setMockFilters([
                {
                    query: {
                        bool: {
                            should: [
                                {
                                    match_phrase: {
                                        field1: 'ios',
                                    },
                                },
                                {
                                    match_phrase: {
                                        field1: 'win xp',
                                    },
                                },
                            ],
                        },
                    },
                },
            ]);
            expect_1.default(filterManager.getValueFromFilterBar()).to.eql(['ios', 'win xp']);
        });
        test('should return undefined when filter value can not be extracted from Kibana filter', function () {
            filterManager.setMockFilters([
                {
                    query: {
                        match: {
                            myFieldWhichIsNotField1: {
                                query: 'ios',
                                type: 'phrase',
                            },
                        },
                    },
                },
            ]);
            expect_1.default(filterManager.getValueFromFilterBar()).to.eql(undefined);
        });
    });
});
