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
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const saved_object_1 = require("./saved_object");
// @ts-ignore
const stub_index_pattern_1 = tslib_1.__importDefault(require("test_utils/stub_index_pattern"));
const mocks_1 = require("../../../../core/public/mocks");
const mocks_2 = require("../../../../plugins/data/public/mocks");
const getConfig = (cfg) => cfg;
describe('Saved Object', () => {
    const startMock = mocks_1.coreMock.createStart();
    const dataStartMock = mocks_2.dataPluginMock.createStartContract();
    const saveOptionsMock = {};
    const savedObjectsClientStub = startMock.savedObjects.client;
    let SavedObjectClass;
    /**
     * Returns a fake doc response with the given index and id, of type dashboard
     * that can be used to stub es calls.
     * @param indexPatternId
     * @param additionalOptions - object that will be assigned to the mocked doc response.
     * @returns {{attributes: {}, type: string, id: *, _version: string}}
     */
    function getMockedDocResponse(indexPatternId, additionalOptions = {}) {
        return {
            type: 'dashboard',
            id: indexPatternId,
            _version: 'foo',
            attributes: {},
            ...additionalOptions,
        };
    }
    /**
     * Stubs some of the es retrieval calls so it returns the given response.
     * @param {Object} mockDocResponse
     */
    function stubESResponse(mockDocResponse) {
        // Stub out search for duplicate title:
        savedObjectsClientStub.get = jest.fn().mockReturnValue(bluebird_1.default.resolve(mockDocResponse));
        savedObjectsClientStub.update = jest.fn().mockReturnValue(bluebird_1.default.resolve(mockDocResponse));
        savedObjectsClientStub.find = jest
            .fn()
            .mockReturnValue(bluebird_1.default.resolve({ savedObjects: [], total: 0 }));
        savedObjectsClientStub.bulkGet = jest
            .fn()
            .mockReturnValue(bluebird_1.default.resolve({ savedObjects: [mockDocResponse] }));
    }
    function stubSavedObjectsClientCreate(resp, resolve = true) {
        savedObjectsClientStub.create = jest
            .fn()
            .mockReturnValue(resolve ? bluebird_1.default.resolve(resp) : bluebird_1.default.reject(resp));
    }
    /**
     * Creates a new saved object with the given configuration and initializes it.
     * Returns the promise that will be completed when the initialization finishes.
     *
     * @param {Object} config
     * @returns {Promise<SavedObject>} A promise that resolves with an instance of
     * SavedObject
     */
    function createInitializedSavedObject(config = {}) {
        const savedObject = new SavedObjectClass(config);
        savedObject.title = 'my saved object';
        return savedObject.init();
    }
    beforeEach(() => {
        SavedObjectClass = saved_object_1.createSavedObjectClass({
            savedObjectsClient: savedObjectsClientStub,
            indexPatterns: dataStartMock.indexPatterns,
            search: {
                ...dataStartMock.search,
                searchSource: {
                    ...dataStartMock.search.searchSource,
                    create: mocks_2.createSearchSourceMock,
                },
            },
        });
    });
    describe('save', () => {
        describe('with confirmOverwrite', () => {
            it('when false does not request overwrite', () => {
                stubESResponse(getMockedDocResponse('myId'));
                return createInitializedSavedObject({ type: 'dashboard', id: 'myId' }).then(savedObject => {
                    stubSavedObjectsClientCreate({ id: 'myId' });
                    return savedObject.save({ confirmOverwrite: false }).then(() => {
                        expect(startMock.overlays.openModal).not.toHaveBeenCalled();
                    });
                });
            });
        });
        describe('with copyOnSave', () => {
            it('as true creates a copy on save success', () => {
                stubESResponse(getMockedDocResponse('myId'));
                return createInitializedSavedObject({ type: 'dashboard', id: 'myId' }).then(savedObject => {
                    stubSavedObjectsClientCreate({
                        type: 'dashboard',
                        id: 'newUniqueId',
                    });
                    savedObject.copyOnSave = true;
                    return savedObject.save(saveOptionsMock).then(id => {
                        expect(id).toBe('newUniqueId');
                    });
                });
            });
            it('as true does not create a copy when save fails', () => {
                const originalId = 'id1';
                stubESResponse(getMockedDocResponse(originalId));
                return createInitializedSavedObject({ type: 'dashboard', id: originalId }).then(savedObject => {
                    stubSavedObjectsClientCreate('simulated error', false);
                    savedObject.copyOnSave = true;
                    return savedObject
                        .save(saveOptionsMock)
                        .then(() => {
                        expect(false).toBe(true);
                    })
                        .catch(() => {
                        expect(savedObject.id).toBe(originalId);
                    });
                });
            });
            it('as false does not create a copy', () => {
                const myId = 'myId';
                stubESResponse(getMockedDocResponse(myId));
                return createInitializedSavedObject({ type: 'dashboard', id: myId }).then(savedObject => {
                    savedObjectsClientStub.create = jest.fn().mockImplementation(() => {
                        expect(savedObject.id).toBe(myId);
                        return bluebird_1.default.resolve({ id: myId });
                    });
                    savedObject.copyOnSave = false;
                    return savedObject.save(saveOptionsMock).then(id => {
                        expect(id).toBe(myId);
                    });
                });
            });
        });
        it('returns id from server on success', () => {
            return createInitializedSavedObject({ type: 'dashboard' }).then(savedObject => {
                stubESResponse(getMockedDocResponse('myId'));
                stubSavedObjectsClientCreate({
                    type: 'dashboard',
                    id: 'myId',
                    _version: 'foo',
                });
                return savedObject.save(saveOptionsMock).then(id => {
                    expect(id).toBe('myId');
                });
            });
        });
        describe('updates isSaving variable', () => {
            it('on success', () => {
                const id = 'id';
                stubESResponse(getMockedDocResponse(id));
                return createInitializedSavedObject({ type: 'dashboard', id }).then(savedObject => {
                    savedObjectsClientStub.create = jest.fn().mockImplementation(() => {
                        expect(savedObject.isSaving).toBe(true);
                        return bluebird_1.default.resolve({
                            type: 'dashboard',
                            id,
                            _version: 'foo',
                        });
                    });
                    expect(savedObject.isSaving).toBe(false);
                    return savedObject.save(saveOptionsMock).then(() => {
                        expect(savedObject.isSaving).toBe(false);
                    });
                });
            });
            it('on failure', () => {
                stubESResponse(getMockedDocResponse('id'));
                return createInitializedSavedObject({ type: 'dashboard' }).then(savedObject => {
                    savedObjectsClientStub.create = jest.fn().mockImplementation(() => {
                        expect(savedObject.isSaving).toBe(true);
                        return bluebird_1.default.reject('');
                    });
                    expect(savedObject.isSaving).toBe(false);
                    return savedObject.save(saveOptionsMock).catch(() => {
                        expect(savedObject.isSaving).toBe(false);
                    });
                });
            });
        });
        describe('to extract references', () => {
            it('when "extractReferences" function when passed in', async () => {
                const id = '123';
                stubESResponse(getMockedDocResponse(id));
                const extractReferences = ({ attributes, references, }) => {
                    references.push({
                        name: 'test',
                        type: 'index-pattern',
                        id: 'my-index',
                    });
                    return { attributes, references };
                };
                return createInitializedSavedObject({ type: 'dashboard', extractReferences }).then(savedObject => {
                    stubSavedObjectsClientCreate({
                        id,
                        _version: 'foo',
                        type: 'dashboard',
                    });
                    return savedObject.save(saveOptionsMock).then(() => {
                        const { references } = savedObjectsClientStub.create.mock.calls[0][2];
                        expect(references).toHaveLength(1);
                        expect(references[0]).toEqual({
                            name: 'test',
                            type: 'index-pattern',
                            id: 'my-index',
                        });
                    });
                });
            });
            it('when search source references saved object', () => {
                const id = '123';
                stubESResponse(getMockedDocResponse(id));
                return createInitializedSavedObject({ type: 'dashboard', searchSource: true }).then(savedObject => {
                    stubSavedObjectsClientCreate({
                        id,
                        _version: '2',
                        type: 'dashboard',
                    });
                    const indexPattern = new stub_index_pattern_1.default('my-index', getConfig, null, [], mocks_1.coreMock.createSetup());
                    indexPattern.title = indexPattern.id;
                    savedObject.searchSource.setField('index', indexPattern);
                    return savedObject.save(saveOptionsMock).then(() => {
                        const args = savedObjectsClientStub.create.mock.calls[0];
                        expect(args[1]).toEqual({
                            kibanaSavedObjectMeta: {
                                searchSourceJSON: JSON.stringify({
                                    indexRefName: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                                }),
                            },
                        });
                        expect(args[2].references).toHaveLength(1);
                        expect(args[2].references[0]).toEqual({
                            name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                            type: 'index-pattern',
                            id: 'my-index',
                        });
                    });
                });
            });
            it('when index in searchSourceJSON is not found', () => {
                const id = '123';
                stubESResponse(getMockedDocResponse(id));
                return createInitializedSavedObject({ type: 'dashboard', searchSource: true }).then(savedObject => {
                    stubSavedObjectsClientCreate({
                        id,
                        _version: '2',
                        type: 'dashboard',
                    });
                    const indexPattern = new stub_index_pattern_1.default('non-existant-index', getConfig, null, [], mocks_1.coreMock.createSetup());
                    savedObject.searchSource.setFields({ index: indexPattern });
                    return savedObject.save(saveOptionsMock).then(() => {
                        const args = savedObjectsClientStub.create.mock.calls[0];
                        expect(args[1]).toEqual({
                            kibanaSavedObjectMeta: {
                                searchSourceJSON: JSON.stringify({
                                    indexRefName: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                                }),
                            },
                        });
                        expect(args[2].references).toHaveLength(1);
                        expect(args[2].references[0]).toEqual({
                            name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                            type: 'index-pattern',
                            id: 'non-existant-index',
                        });
                    });
                });
            });
            it('when indexes exists in filter of searchSourceJSON', () => {
                const id = '123';
                stubESResponse(getMockedDocResponse(id));
                return createInitializedSavedObject({ type: 'dashboard', searchSource: true }).then(savedObject => {
                    stubSavedObjectsClientCreate({
                        id,
                        _version: '2',
                        type: 'dashboard',
                    });
                    savedObject.searchSource.setField('filter', [
                        {
                            meta: {
                                index: 'my-index',
                            },
                        },
                    ]);
                    return savedObject.save(saveOptionsMock).then(() => {
                        const args = savedObjectsClientStub.create.mock.calls[0];
                        expect(args[1]).toEqual({
                            kibanaSavedObjectMeta: {
                                searchSourceJSON: JSON.stringify({
                                    filter: [
                                        {
                                            meta: {
                                                indexRefName: 'kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.index',
                                            },
                                        },
                                    ],
                                }),
                            },
                        });
                        expect(args[2].references).toHaveLength(1);
                        expect(args[2].references[0]).toEqual({
                            name: 'kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.index',
                            type: 'index-pattern',
                            id: 'my-index',
                        });
                    });
                });
            });
        });
    });
    describe('applyESResp', () => {
        it('throws error if not found', () => {
            return createInitializedSavedObject({ type: 'dashboard' }).then(savedObject => {
                const response = { _source: {} };
                try {
                    savedObject.applyESResp(response);
                    expect(true).toBe(false);
                }
                catch (err) {
                    expect(!!err).toBe(true);
                }
            });
        });
        it('preserves original defaults if not overridden', () => {
            const id = 'anid';
            const preserveMeValue = 'here to stay!';
            const config = {
                defaults: {
                    preserveMe: preserveMeValue,
                },
                type: 'dashboard',
                id,
            };
            const mockDocResponse = getMockedDocResponse(id);
            stubESResponse(mockDocResponse);
            const savedObject = new SavedObjectClass(config);
            return savedObject.init()
                .then(() => {
                expect(savedObject._source.preserveMe).toEqual(preserveMeValue);
                const response = { found: true, _source: {} };
                return savedObject.applyESResp(response);
            })
                .then(() => {
                expect(savedObject._source.preserveMe).toEqual(preserveMeValue);
            });
        });
        it('overrides defaults', () => {
            const id = 'anid';
            const config = {
                defaults: {
                    flower: 'rose',
                },
                type: 'dashboard',
                id,
            };
            stubESResponse(getMockedDocResponse(id));
            const savedObject = new SavedObjectClass(config);
            return savedObject.init()
                .then(() => {
                expect(savedObject._source.flower).toEqual('rose');
                const response = {
                    found: true,
                    _source: {
                        flower: 'orchid',
                    },
                };
                return savedObject.applyESResp(response);
            })
                .then(() => {
                expect(savedObject._source.flower).toEqual('orchid');
            });
        });
        it('overrides previous _source and default values', () => {
            const id = 'anid';
            const config = {
                defaults: {
                    dinosaurs: {
                        tRex: 'is the scariest',
                    },
                },
                type: 'dashboard',
                id,
            };
            const mockDocResponse = getMockedDocResponse(id, {
                attributes: { dinosaurs: { tRex: 'is not so bad' } },
            });
            stubESResponse(mockDocResponse);
            const savedObject = new SavedObjectClass(config);
            return savedObject.init()
                .then(() => {
                const response = {
                    found: true,
                    _source: { dinosaurs: { tRex: 'has big teeth' } },
                };
                return savedObject.applyESResp(response);
            })
                .then(() => {
                expect(savedObject._source.dinosaurs.tRex).toEqual('has big teeth');
            });
        });
        it('does not inject references when references array is missing', async () => {
            const injectReferences = jest.fn();
            const config = {
                type: 'dashboard',
                injectReferences,
            };
            const savedObject = new SavedObjectClass(config);
            return savedObject.init()
                .then(() => {
                const response = {
                    found: true,
                    _source: {
                        dinosaurs: { tRex: 'has big teeth' },
                    },
                };
                return savedObject.applyESResp(response);
            })
                .then(() => {
                expect(injectReferences).not.toHaveBeenCalled();
            });
        });
        it('does not inject references when references array is empty', async () => {
            const injectReferences = jest.fn();
            const config = {
                type: 'dashboard',
                injectReferences,
            };
            const savedObject = new SavedObjectClass(config);
            return savedObject.init()
                .then(() => {
                const response = {
                    found: true,
                    _source: {
                        dinosaurs: { tRex: 'has big teeth' },
                    },
                    references: [],
                };
                return savedObject.applyESResp(response);
            })
                .then(() => {
                expect(injectReferences).not.toHaveBeenCalled();
            });
        });
        it('injects references when function is provided and references exist', async () => {
            const injectReferences = jest.fn();
            const config = {
                type: 'dashboard',
                injectReferences,
            };
            const savedObject = new SavedObjectClass(config);
            return savedObject.init()
                .then(() => {
                const response = {
                    found: true,
                    _source: {
                        dinosaurs: { tRex: 'has big teeth' },
                    },
                    references: [{}],
                };
                return savedObject.applyESResp(response);
            })
                .then(() => {
                expect(injectReferences).toHaveBeenCalledTimes(1);
            });
        });
        it('passes references to search source parsing function', async () => {
            const savedObject = new SavedObjectClass({ type: 'dashboard', searchSource: true });
            await savedObject.init();
            const searchSourceJSON = JSON.stringify({
                indexRefName: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                filter: [
                    {
                        meta: {
                            indexRefName: 'kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.index',
                        },
                    },
                ],
            });
            const response = {
                found: true,
                _source: {
                    kibanaSavedObjectMeta: {
                        searchSourceJSON,
                    },
                },
                references: [
                    {
                        name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
                        type: 'index-pattern',
                        id: 'my-index-1',
                    },
                    {
                        name: 'kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.index',
                        type: 'index-pattern',
                        id: 'my-index-2',
                    },
                ],
            };
            const result = await savedObject.applyESResp(response);
            expect(result._source).toEqual({
                kibanaSavedObjectMeta: {
                    searchSourceJSON: '{"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.index","filter":[{"meta":{"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.index"}}]}',
                },
            });
        });
    });
    describe('config', () => {
        it('afterESResp is called', () => {
            const afterESRespCallback = jest.fn();
            const config = {
                type: 'dashboard',
                afterESResp: afterESRespCallback,
            };
            return createInitializedSavedObject(config).then(() => {
                expect(afterESRespCallback).toHaveBeenCalled();
            });
        });
        describe('searchSource', () => {
            it('when true, creates index', () => {
                const indexPatternId = 'testIndexPattern';
                const afterESRespCallback = jest.fn();
                const config = {
                    type: 'dashboard',
                    afterESResp: afterESRespCallback,
                    searchSource: true,
                    indexPattern: { id: indexPatternId },
                };
                stubESResponse(getMockedDocResponse(indexPatternId, {
                    attributes: {
                        title: 'testIndexPattern',
                    },
                }));
                const savedObject = new SavedObjectClass(config);
                savedObject.hydrateIndexPattern = jest.fn().mockImplementation(() => {
                    const indexPattern = new stub_index_pattern_1.default(indexPatternId, getConfig, null, [], mocks_1.coreMock.createSetup());
                    indexPattern.title = indexPattern.id;
                    savedObject.searchSource.setField('index', indexPattern);
                    return bluebird_1.default.resolve(indexPattern);
                });
                expect(!!savedObject.searchSource.getField('index')).toBe(false);
                return savedObject.init().then(() => {
                    expect(afterESRespCallback).toHaveBeenCalled();
                    const index = savedObject.searchSource.getField('index');
                    expect(index instanceof stub_index_pattern_1.default).toBe(true);
                    expect(index.id).toEqual(indexPatternId);
                });
            });
            it('when false, does not create index', () => {
                const indexPatternId = 'testIndexPattern';
                const afterESRespCallback = jest.fn();
                const config = {
                    type: 'dashboard',
                    afterESResp: afterESRespCallback,
                    searchSource: false,
                    indexPattern: { id: indexPatternId },
                };
                stubESResponse(getMockedDocResponse(indexPatternId));
                const savedObject = new SavedObjectClass(config);
                expect(!!savedObject.searchSource).toBe(false);
                return savedObject.init().then(() => {
                    expect(afterESRespCallback).toHaveBeenCalled();
                    expect(!!savedObject.searchSource).toBe(false);
                });
            });
        });
        describe('type', () => {
            it('that is not specified throws an error', done => {
                const config = {};
                const savedObject = new SavedObjectClass(config);
                savedObject.init().catch(() => {
                    done();
                });
            });
            it('that is invalid invalid throws an error', () => {
                const config = { type: 'notypeexists' };
                const savedObject = new SavedObjectClass(config);
                try {
                    savedObject.init();
                    expect(false).toBe(true);
                }
                catch (err) {
                    expect(err).not.toBeNull();
                }
            });
            it('that is valid passes', () => {
                const config = { type: 'dashboard' };
                return new SavedObjectClass(config).init();
            });
        });
        describe('defaults', () => {
            function getTestDefaultConfig(extraOptions = {}) {
                return {
                    defaults: { testDefault: 'hi' },
                    type: 'dashboard',
                    ...extraOptions,
                };
            }
            function expectDefaultApplied(config) {
                return createInitializedSavedObject(config).then(savedObject => {
                    expect(savedObject.defaults).toBe(config.defaults);
                });
            }
            describe('applied to object when id', () => {
                it('is not specified', () => {
                    expectDefaultApplied(getTestDefaultConfig());
                });
                it('is undefined', () => {
                    expectDefaultApplied(getTestDefaultConfig({ id: undefined }));
                });
                it('is 0', () => {
                    expectDefaultApplied(getTestDefaultConfig({ id: 0 }));
                });
                it('is false', () => {
                    expectDefaultApplied(getTestDefaultConfig({ id: false }));
                });
            });
            it('applied to source if an id is given', () => {
                const myId = 'myid';
                const customDefault = 'hi';
                const initialOverwriteMeValue = 'this should get overwritten by the server response';
                const config = {
                    defaults: {
                        overwriteMe: initialOverwriteMeValue,
                        customDefault,
                    },
                    type: 'dashboard',
                    id: myId,
                };
                const serverValue = 'this should override the initial default value given';
                const mockDocResponse = getMockedDocResponse(myId, {
                    attributes: { overwriteMe: serverValue },
                });
                stubESResponse(mockDocResponse);
                return createInitializedSavedObject(config).then(savedObject => {
                    expect(!!savedObject._source).toBe(true);
                    expect(savedObject.defaults).toBe(config.defaults);
                    expect(savedObject._source.overwriteMe).toBe(serverValue);
                    expect(savedObject._source.customDefault).toBe(customDefault);
                });
            });
        });
    });
});
