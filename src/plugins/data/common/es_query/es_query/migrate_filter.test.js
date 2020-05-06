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
const lodash_1 = require("lodash");
const migrate_filter_1 = require("./migrate_filter");
describe('migrateFilter', function () {
    const oldMatchPhraseFilter = {
        query: {
            match: {
                fieldFoo: {
                    query: 'foobar',
                    type: 'phrase',
                },
            },
        },
        meta: {},
    };
    const newMatchPhraseFilter = {
        query: {
            match_phrase: {
                fieldFoo: {
                    query: 'foobar',
                },
            },
        },
        meta: {},
    };
    it('should migrate match filters of type phrase', function () {
        const migratedFilter = migrate_filter_1.migrateFilter(oldMatchPhraseFilter, undefined);
        expect(migratedFilter).toEqual(newMatchPhraseFilter);
    });
    it('should not modify the original filter', function () {
        const oldMatchPhraseFilterCopy = lodash_1.clone(oldMatchPhraseFilter, true);
        migrate_filter_1.migrateFilter(oldMatchPhraseFilter, undefined);
        expect(lodash_1.isEqual(oldMatchPhraseFilter, oldMatchPhraseFilterCopy)).toBe(true);
    });
    it('should return the original filter if no migration is necessary', function () {
        const originalFilter = {
            match_all: {},
        };
        const migratedFilter = migrate_filter_1.migrateFilter(originalFilter, undefined);
        expect(migratedFilter).toBe(originalFilter);
        expect(lodash_1.isEqual(migratedFilter, originalFilter)).toBe(true);
    });
});
