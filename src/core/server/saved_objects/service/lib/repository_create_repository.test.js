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
const repository_1 = require("./repository");
const kibana_migrator_mock_1 = require("../../migrations/kibana/kibana_migrator.mock");
const saved_objects_type_registry_1 = require("../../saved_objects_type_registry");
jest.mock('./repository');
const { SavedObjectsRepository: originalRepository } = jest.requireActual('./repository');
describe('SavedObjectsRepository#createRepository', () => {
    const callAdminCluster = jest.fn();
    const typeRegistry = new saved_objects_type_registry_1.SavedObjectTypeRegistry();
    typeRegistry.registerType({
        name: 'nsAgnosticType',
        hidden: false,
        namespaceType: 'agnostic',
        mappings: {
            properties: {
                name: { type: 'keyword' },
            },
        },
        migrations: {},
    });
    typeRegistry.registerType({
        name: 'nsType',
        hidden: false,
        namespaceType: 'single',
        indexPattern: 'beats',
        mappings: {
            properties: {
                name: { type: 'keyword' },
            },
        },
        migrations: {},
    });
    typeRegistry.registerType({
        name: 'hiddenType',
        hidden: true,
        namespaceType: 'agnostic',
        mappings: {
            properties: {
                name: { type: 'keyword' },
            },
        },
        migrations: {},
    });
    const migrator = kibana_migrator_mock_1.mockKibanaMigrator.create({ types: typeRegistry.getAllTypes() });
    const RepositoryConstructor = repository_1.SavedObjectsRepository;
    beforeEach(() => {
        RepositoryConstructor.mockClear();
    });
    it('should not allow a repository with an undefined type', () => {
        try {
            originalRepository.createRepository(migrator, typeRegistry, '.kibana-test', callAdminCluster, ['unMappedType1', 'unmappedType2']);
        }
        catch (e) {
            expect(e).toMatchInlineSnapshot(`[Error: Missing mappings for saved objects types: 'unMappedType1, unmappedType2']`);
        }
    });
    it('should create a repository without hidden types', () => {
        const repository = originalRepository.createRepository(migrator, typeRegistry, '.kibana-test', callAdminCluster, [], repository_1.SavedObjectsRepository);
        expect(repository).toBeDefined();
        expect(RepositoryConstructor.mock.calls[0][0].allowedTypes).toMatchInlineSnapshot(`
      Array [
        "nsAgnosticType",
        "nsType",
      ]
    `);
    });
    it('should create a repository with a unique list of hidden types', () => {
        const repository = originalRepository.createRepository(migrator, typeRegistry, '.kibana-test', callAdminCluster, ['hiddenType', 'hiddenType', 'hiddenType'], repository_1.SavedObjectsRepository);
        expect(repository).toBeDefined();
        expect(RepositoryConstructor.mock.calls[0][0].allowedTypes).toMatchInlineSnapshot(`
      Array [
        "nsAgnosticType",
        "nsType",
        "hiddenType",
      ]
    `);
    });
});
