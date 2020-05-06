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
const sinon_1 = tslib_1.__importDefault(require("sinon"));
const chance_1 = tslib_1.__importDefault(require("chance"));
const utils_1 = require("../../../../legacy/utils");
const create_index_stream_1 = require("../create_index_stream");
const stubs_1 = require("./stubs");
const chance = new chance_1.default();
const log = stubs_1.createStubLogger();
describe('esArchiver: createCreateIndexStream()', () => {
    describe('defaults', () => {
        it('deletes existing indices, creates all', async () => {
            const client = stubs_1.createStubClient(['existing-index']);
            const stats = stubs_1.createStubStats();
            await utils_1.createPromiseFromStreams([
                utils_1.createListStream([
                    stubs_1.createStubIndexRecord('existing-index'),
                    stubs_1.createStubIndexRecord('new-index'),
                ]),
                create_index_stream_1.createCreateIndexStream({ client, stats, log }),
            ]);
            expect_1.default(stats.getTestSummary()).to.eql({
                deletedIndex: 1,
                createdIndex: 2,
            });
            sinon_1.default.assert.callCount(client.indices.delete, 1);
            sinon_1.default.assert.callCount(client.indices.create, 3); // one failed create because of existing
        });
        it('deletes existing aliases, creates all', async () => {
            const client = stubs_1.createStubClient(['actual-index'], { 'existing-index': 'actual-index' });
            const stats = stubs_1.createStubStats();
            await utils_1.createPromiseFromStreams([
                utils_1.createListStream([
                    stubs_1.createStubIndexRecord('existing-index'),
                    stubs_1.createStubIndexRecord('new-index'),
                ]),
                create_index_stream_1.createCreateIndexStream({ client, stats, log }),
            ]);
            expect_1.default(client.indices.getAlias.calledOnce).to.be.ok();
            expect_1.default(client.indices.getAlias.args[0][0]).to.eql({
                name: 'existing-index',
                ignore: [404],
            });
            expect_1.default(client.indices.delete.calledOnce).to.be.ok();
            expect_1.default(client.indices.delete.args[0][0]).to.eql({
                index: ['actual-index'],
            });
            sinon_1.default.assert.callCount(client.indices.create, 3); // one failed create because of existing
        });
        it('passes through "hit" records', async () => {
            const client = stubs_1.createStubClient();
            const stats = stubs_1.createStubStats();
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream([
                    stubs_1.createStubIndexRecord('index'),
                    stubs_1.createStubDocRecord('index', 1),
                    stubs_1.createStubDocRecord('index', 2),
                ]),
                create_index_stream_1.createCreateIndexStream({ client, stats, log }),
                utils_1.createConcatStream([]),
            ]);
            expect_1.default(output).to.eql([stubs_1.createStubDocRecord('index', 1), stubs_1.createStubDocRecord('index', 2)]);
        });
        it('creates aliases', async () => {
            const client = stubs_1.createStubClient();
            const stats = stubs_1.createStubStats();
            await utils_1.createPromiseFromStreams([
                utils_1.createListStream([
                    stubs_1.createStubIndexRecord('index', { foo: {} }),
                    stubs_1.createStubDocRecord('index', 1),
                ]),
                create_index_stream_1.createCreateIndexStream({ client, stats, log }),
                utils_1.createConcatStream([]),
            ]);
            sinon_1.default.assert.calledWith(client.indices.create, {
                method: 'PUT',
                index: 'index',
                body: {
                    settings: undefined,
                    mappings: undefined,
                    aliases: { foo: {} },
                },
            });
        });
        it('passes through records with unknown types', async () => {
            const client = stubs_1.createStubClient();
            const stats = stubs_1.createStubStats();
            const randoms = [
                { type: chance.word(), value: chance.hashtag() },
                { type: chance.word(), value: chance.hashtag() },
            ];
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream([stubs_1.createStubIndexRecord('index'), ...randoms]),
                create_index_stream_1.createCreateIndexStream({ client, stats, log }),
                utils_1.createConcatStream([]),
            ]);
            expect_1.default(output).to.eql(randoms);
        });
        it('passes through non-record values', async () => {
            const client = stubs_1.createStubClient();
            const stats = stubs_1.createStubStats();
            const nonRecordValues = [undefined, chance.email(), 12345, Infinity, /abc/, new Date()];
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream(nonRecordValues),
                create_index_stream_1.createCreateIndexStream({ client, stats, log }),
                utils_1.createConcatStream([]),
            ]);
            expect_1.default(output).to.eql(nonRecordValues);
        });
    });
    describe('skipExisting = true', () => {
        it('ignores preexisting indexes', async () => {
            const client = stubs_1.createStubClient(['existing-index']);
            const stats = stubs_1.createStubStats();
            await utils_1.createPromiseFromStreams([
                utils_1.createListStream([
                    stubs_1.createStubIndexRecord('new-index'),
                    stubs_1.createStubIndexRecord('existing-index'),
                ]),
                create_index_stream_1.createCreateIndexStream({
                    client,
                    stats,
                    log,
                    skipExisting: true,
                }),
            ]);
            expect_1.default(stats.getTestSummary()).to.eql({
                skippedIndex: 1,
                createdIndex: 1,
            });
            sinon_1.default.assert.callCount(client.indices.delete, 0);
            sinon_1.default.assert.callCount(client.indices.create, 2); // one failed create because of existing
            expect_1.default(client.indices.create.args[0][0]).to.have.property('index', 'new-index');
        });
        it('filters documents for skipped indices', async () => {
            const client = stubs_1.createStubClient(['existing-index']);
            const stats = stubs_1.createStubStats();
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream([
                    stubs_1.createStubIndexRecord('new-index'),
                    stubs_1.createStubDocRecord('new-index', 1),
                    stubs_1.createStubDocRecord('new-index', 2),
                    stubs_1.createStubIndexRecord('existing-index'),
                    stubs_1.createStubDocRecord('existing-index', 1),
                    stubs_1.createStubDocRecord('existing-index', 2),
                ]),
                create_index_stream_1.createCreateIndexStream({
                    client,
                    stats,
                    log,
                    skipExisting: true,
                }),
                utils_1.createConcatStream([]),
            ]);
            expect_1.default(stats.getTestSummary()).to.eql({
                skippedIndex: 1,
                createdIndex: 1,
            });
            sinon_1.default.assert.callCount(client.indices.delete, 0);
            sinon_1.default.assert.callCount(client.indices.create, 2); // one failed create because of existing
            expect_1.default(output).to.have.length(2);
            expect_1.default(output).to.eql([
                stubs_1.createStubDocRecord('new-index', 1),
                stubs_1.createStubDocRecord('new-index', 2),
            ]);
        });
    });
});
