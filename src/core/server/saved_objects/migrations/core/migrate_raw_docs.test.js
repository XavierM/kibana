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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const saved_objects_type_registry_1 = require("../../saved_objects_type_registry");
const serialization_1 = require("../../serialization");
const migrate_raw_docs_1 = require("./migrate_raw_docs");
describe('migrateRawDocs', () => {
    test('converts raw docs to saved objects', async () => {
        const transform = jest.fn((doc) => lodash_1.default.set(doc, 'attributes.name', 'HOI!'));
        const result = migrate_raw_docs_1.migrateRawDocs(new serialization_1.SavedObjectsSerializer(new saved_objects_type_registry_1.SavedObjectTypeRegistry()), transform, [
            { _id: 'a:b', _source: { type: 'a', a: { name: 'AAA' } } },
            { _id: 'c:d', _source: { type: 'c', c: { name: 'DDD' } } },
        ]);
        expect(result).toEqual([
            {
                _id: 'a:b',
                _source: { type: 'a', a: { name: 'HOI!' }, migrationVersion: {}, references: [] },
            },
            {
                _id: 'c:d',
                _source: { type: 'c', c: { name: 'HOI!' }, migrationVersion: {}, references: [] },
            },
        ]);
        expect(transform).toHaveBeenCalled();
    });
    test('passes invalid docs through untouched', async () => {
        const transform = jest.fn((doc) => lodash_1.default.set(lodash_1.default.cloneDeep(doc), 'attributes.name', 'TADA'));
        const result = migrate_raw_docs_1.migrateRawDocs(new serialization_1.SavedObjectsSerializer(new saved_objects_type_registry_1.SavedObjectTypeRegistry()), transform, [
            { _id: 'foo:b', _source: { type: 'a', a: { name: 'AAA' } } },
            { _id: 'c:d', _source: { type: 'c', c: { name: 'DDD' } } },
        ]);
        expect(result).toEqual([
            { _id: 'foo:b', _source: { type: 'a', a: { name: 'AAA' } } },
            {
                _id: 'c:d',
                _source: { type: 'c', c: { name: 'TADA' }, migrationVersion: {}, references: [] },
            },
        ]);
        expect(transform.mock.calls).toEqual([
            [
                {
                    id: 'd',
                    type: 'c',
                    attributes: {
                        name: 'DDD',
                    },
                    migrationVersion: {},
                    references: [],
                },
            ],
        ]);
    });
});
