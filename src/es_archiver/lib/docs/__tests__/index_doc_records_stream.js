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
const bluebird_1 = require("bluebird");
const utils_1 = require("../../../../legacy/utils");
const progress_1 = require("../../progress");
const index_doc_records_stream_1 = require("../index_doc_records_stream");
const stubs_1 = require("./stubs");
const recordsToBulkBody = (records) => {
    return records.reduce((acc, record) => {
        const { index, id, source } = record.value;
        return [...acc, { index: { _index: index, _id: id } }, source];
    }, []);
};
describe('esArchiver: createIndexDocRecordsStream()', () => {
    it('consumes doc records and sends to `_bulk` api', async () => {
        const records = stubs_1.createPersonDocRecords(1);
        const client = stubs_1.createStubClient([
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params).to.eql({
                    body: recordsToBulkBody(records),
                });
                return { ok: true };
            },
        ]);
        const stats = stubs_1.createStubStats();
        const progress = new progress_1.Progress();
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(records),
            index_doc_records_stream_1.createIndexDocRecordsStream(client, stats, progress),
        ]);
        client.assertNoPendingResponses();
        expect_1.default(progress.getComplete()).to.be(1);
        expect_1.default(progress.getTotal()).to.be(undefined);
    });
    it('consumes multiple doc records and sends to `_bulk` api together', async () => {
        const records = stubs_1.createPersonDocRecords(10);
        const client = stubs_1.createStubClient([
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params).to.eql({
                    body: recordsToBulkBody(records.slice(0, 1)),
                });
                return { ok: true };
            },
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params).to.eql({
                    body: recordsToBulkBody(records.slice(1)),
                });
                return { ok: true };
            },
        ]);
        const stats = stubs_1.createStubStats();
        const progress = new progress_1.Progress();
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(records),
            index_doc_records_stream_1.createIndexDocRecordsStream(client, stats, progress),
        ]);
        client.assertNoPendingResponses();
        expect_1.default(progress.getComplete()).to.be(10);
        expect_1.default(progress.getTotal()).to.be(undefined);
    });
    it('waits until request is complete before sending more', async () => {
        const records = stubs_1.createPersonDocRecords(10);
        const stats = stubs_1.createStubStats();
        const start = Date.now();
        const delayMs = 1234;
        const client = stubs_1.createStubClient([
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params).to.eql({
                    body: recordsToBulkBody(records.slice(0, 1)),
                });
                await bluebird_1.delay(delayMs);
                return { ok: true };
            },
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params).to.eql({
                    body: recordsToBulkBody(records.slice(1)),
                });
                expect_1.default(Date.now() - start).to.not.be.lessThan(delayMs);
                return { ok: true };
            },
        ]);
        const progress = new progress_1.Progress();
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(records),
            index_doc_records_stream_1.createIndexDocRecordsStream(client, stats, progress),
        ]);
        client.assertNoPendingResponses();
        expect_1.default(progress.getComplete()).to.be(10);
        expect_1.default(progress.getTotal()).to.be(undefined);
    });
    it('sends a maximum of 300 documents at a time', async () => {
        const records = stubs_1.createPersonDocRecords(301);
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient([
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params.body.length).to.eql(1 * 2);
                return { ok: true };
            },
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params.body.length).to.eql(299 * 2);
                return { ok: true };
            },
            async (name, params) => {
                expect_1.default(name).to.be('bulk');
                expect_1.default(params.body.length).to.eql(1 * 2);
                return { ok: true };
            },
        ]);
        const progress = new progress_1.Progress();
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(records),
            index_doc_records_stream_1.createIndexDocRecordsStream(client, stats, progress),
        ]);
        client.assertNoPendingResponses();
        expect_1.default(progress.getComplete()).to.be(301);
        expect_1.default(progress.getTotal()).to.be(undefined);
    });
    it('emits an error if any request fails', async () => {
        const records = stubs_1.createPersonDocRecords(2);
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient([
            async () => ({ ok: true }),
            async () => ({ errors: true, forcedError: true }),
        ]);
        const progress = new progress_1.Progress();
        try {
            await utils_1.createPromiseFromStreams([
                utils_1.createListStream(records),
                index_doc_records_stream_1.createIndexDocRecordsStream(client, stats, progress),
            ]);
            throw new Error('expected stream to emit error');
        }
        catch (err) {
            expect_1.default(err.message).to.match(/"forcedError":\s*true/);
        }
        client.assertNoPendingResponses();
        expect_1.default(progress.getComplete()).to.be(1);
        expect_1.default(progress.getTotal()).to.be(undefined);
    });
});
