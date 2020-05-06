"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const migrate_match_all_query_1 = require("./migrate_match_all_query");
const savedObjectMigrationContext = null;
describe('migrate match_all query', () => {
    test('should migrate obsolete match_all query', () => {
        const migratedDoc = migrate_match_all_query_1.migrateMatchAllQuery({
            attributes: {
                kibanaSavedObjectMeta: {
                    searchSourceJSON: JSON.stringify({
                        query: {
                            match_all: {},
                        },
                    }),
                },
            },
        }, savedObjectMigrationContext);
        const migratedSearchSource = JSON.parse(migratedDoc.attributes.kibanaSavedObjectMeta.searchSourceJSON);
        expect(migratedSearchSource).toEqual({
            query: {
                query: '',
                language: 'kuery',
            },
        });
    });
});
