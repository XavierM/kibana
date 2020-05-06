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
const saved_objects_service_test_mocks_1 = require("./saved_objects_service.test.mocks");
const rxjs_1 = require("rxjs");
const config_schema_1 = require("@kbn/config-schema");
const saved_objects_service_1 = require("./saved_objects_service");
const core_context_mock_1 = require("../core_context.mock");
const legacyElasticsearch = tslib_1.__importStar(require("elasticsearch"));
const mocks_1 = require("../mocks");
const elasticsearch_service_mock_1 = require("../elasticsearch/elasticsearch_service.mock");
const legacy_service_mock_1 = require("../legacy/legacy_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
describe('SavedObjectsService', () => {
    const createCoreContext = ({ skipMigration = true, env, } = {}) => {
        const configService = mocks_1.configServiceMock.create({ atPath: { skip: true } });
        configService.atPath.mockImplementation(path => {
            if (path === 'migrations') {
                return new rxjs_1.BehaviorSubject({ skip: skipMigration });
            }
            return new rxjs_1.BehaviorSubject({
                maxImportPayloadBytes: new config_schema_1.ByteSizeValue(0),
                maxImportExportSize: new config_schema_1.ByteSizeValue(0),
            });
        });
        return core_context_mock_1.mockCoreContext.create({ configService, env });
    };
    const createSetupDeps = () => {
        const elasticsearchMock = elasticsearch_service_mock_1.elasticsearchServiceMock.createInternalSetup();
        return {
            http: http_service_mock_1.httpServiceMock.createSetupContract(),
            elasticsearch: elasticsearchMock,
            legacyPlugins: legacy_service_mock_1.legacyServiceMock.createDiscoverPlugins(),
        };
    };
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('#setup()', () => {
        describe('#setClientFactoryProvider', () => {
            it('registers the factory to the clientProvider', async () => {
                const coreContext = createCoreContext();
                const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
                const setup = await soService.setup(createSetupDeps());
                const factory = jest.fn();
                const factoryProvider = () => factory;
                setup.setClientFactoryProvider(factoryProvider);
                await soService.start({});
                expect(saved_objects_service_test_mocks_1.clientProviderInstanceMock.setClientFactory).toHaveBeenCalledWith(factory);
            });
            it('throws if a factory is already registered', async () => {
                const coreContext = createCoreContext();
                const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
                const setup = await soService.setup(createSetupDeps());
                const firstFactory = () => jest.fn();
                const secondFactory = () => jest.fn();
                setup.setClientFactoryProvider(firstFactory);
                expect(() => {
                    setup.setClientFactoryProvider(secondFactory);
                }).toThrowErrorMatchingInlineSnapshot(`"custom client factory is already set, and can only be set once"`);
            });
        });
        describe('#addClientWrapper', () => {
            it('registers the wrapper to the clientProvider', async () => {
                const coreContext = createCoreContext();
                const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
                const setup = await soService.setup(createSetupDeps());
                const wrapperA = jest.fn();
                const wrapperB = jest.fn();
                setup.addClientWrapper(1, 'A', wrapperA);
                setup.addClientWrapper(2, 'B', wrapperB);
                await soService.start({});
                expect(saved_objects_service_test_mocks_1.clientProviderInstanceMock.addClientWrapperFactory).toHaveBeenCalledTimes(2);
                expect(saved_objects_service_test_mocks_1.clientProviderInstanceMock.addClientWrapperFactory).toHaveBeenCalledWith(1, 'A', wrapperA);
                expect(saved_objects_service_test_mocks_1.clientProviderInstanceMock.addClientWrapperFactory).toHaveBeenCalledWith(2, 'B', wrapperB);
            });
        });
        describe('#registerType', () => {
            it('registers the type to the internal typeRegistry', async () => {
                const coreContext = createCoreContext();
                const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
                const setup = await soService.setup(createSetupDeps());
                const type = {
                    name: 'someType',
                    hidden: false,
                    namespaceType: 'single',
                    mappings: { properties: {} },
                };
                setup.registerType(type);
                expect(saved_objects_service_test_mocks_1.typeRegistryInstanceMock.registerType).toHaveBeenCalledTimes(1);
                expect(saved_objects_service_test_mocks_1.typeRegistryInstanceMock.registerType).toHaveBeenCalledWith(type);
            });
        });
    });
    describe('#start()', () => {
        it('creates a KibanaMigrator which retries NoConnections errors from callAsInternalUser', async () => {
            const coreContext = createCoreContext();
            const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
            const coreSetup = createSetupDeps();
            let i = 0;
            coreSetup.elasticsearch.adminClient.callAsInternalUser = jest
                .fn()
                .mockImplementation(() => i++ <= 2
                ? Promise.reject(new legacyElasticsearch.errors.NoConnections())
                : Promise.resolve('success'));
            await soService.setup(coreSetup);
            await soService.start({}, 1);
            return expect(saved_objects_service_test_mocks_1.KibanaMigratorMock.mock.calls[0][0].callCluster()).resolves.toMatch('success');
        });
        it('skips KibanaMigrator migrations when pluginsInitialized=false', async () => {
            const coreContext = createCoreContext({ skipMigration: false });
            const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
            await soService.setup(createSetupDeps());
            await soService.start({ pluginsInitialized: false });
            expect(saved_objects_service_test_mocks_1.migratorInstanceMock.runMigrations).not.toHaveBeenCalled();
        });
        it('skips KibanaMigrator migrations when migrations.skip=true', async () => {
            const coreContext = createCoreContext({ skipMigration: true });
            const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
            await soService.setup(createSetupDeps());
            await soService.start({});
            expect(saved_objects_service_test_mocks_1.migratorInstanceMock.runMigrations).not.toHaveBeenCalled();
        });
        it('waits for all es nodes to be compatible before running migrations', async (done) => {
            expect.assertions(2);
            const coreContext = createCoreContext({ skipMigration: false });
            const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
            const setupDeps = createSetupDeps();
            // Create an new subject so that we can control when isCompatible=true
            // is emitted.
            setupDeps.elasticsearch.esNodesCompatibility$ = new rxjs_1.BehaviorSubject({
                isCompatible: false,
                incompatibleNodes: [],
                warningNodes: [],
                kibanaVersion: '8.0.0',
            });
            await soService.setup(setupDeps);
            soService.start({});
            expect(saved_objects_service_test_mocks_1.migratorInstanceMock.runMigrations).toHaveBeenCalledTimes(0);
            setupDeps.elasticsearch.esNodesCompatibility$.next({
                isCompatible: true,
                incompatibleNodes: [],
                warningNodes: [],
                kibanaVersion: '8.0.0',
            });
            setImmediate(() => {
                expect(saved_objects_service_test_mocks_1.migratorInstanceMock.runMigrations).toHaveBeenCalledTimes(1);
                done();
            });
        });
        it('resolves with KibanaMigrator after waiting for migrations to complete', async () => {
            const coreContext = createCoreContext({ skipMigration: false });
            const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
            await soService.setup(createSetupDeps());
            expect(saved_objects_service_test_mocks_1.migratorInstanceMock.runMigrations).toHaveBeenCalledTimes(0);
            const startContract = await soService.start({});
            expect(startContract.migrator).toBe(saved_objects_service_test_mocks_1.migratorInstanceMock);
            expect(saved_objects_service_test_mocks_1.migratorInstanceMock.runMigrations).toHaveBeenCalledTimes(1);
        });
        it('throws when calling setup APIs once started', async () => {
            const coreContext = createCoreContext({ skipMigration: false });
            const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
            const setup = await soService.setup(createSetupDeps());
            await soService.start({});
            expect(() => {
                setup.setClientFactoryProvider(jest.fn());
            }).toThrowErrorMatchingInlineSnapshot(`"cannot call \`setClientFactoryProvider\` after service startup."`);
            expect(() => {
                setup.addClientWrapper(0, 'dummy', jest.fn());
            }).toThrowErrorMatchingInlineSnapshot(`"cannot call \`addClientWrapper\` after service startup."`);
            expect(() => {
                setup.registerType({
                    name: 'someType',
                    hidden: false,
                    namespaceType: 'single',
                    mappings: { properties: {} },
                });
            }).toThrowErrorMatchingInlineSnapshot(`"cannot call \`registerType\` after service startup."`);
        });
        describe('#getTypeRegistry', () => {
            it('returns the internal type registry of the service', async () => {
                const coreContext = createCoreContext({ skipMigration: false });
                const soService = new saved_objects_service_1.SavedObjectsService(coreContext);
                await soService.setup(createSetupDeps());
                const { getTypeRegistry } = await soService.start({});
                expect(getTypeRegistry()).toBe(saved_objects_service_test_mocks_1.typeRegistryInstanceMock);
            });
        });
    });
});
