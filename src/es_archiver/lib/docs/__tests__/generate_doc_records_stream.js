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
const sinon_1 = tslib_1.__importDefault(require("sinon"));
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const bluebird_1 = require("bluebird");
const utils_1 = require("../../../../legacy/utils");
const generate_doc_records_stream_1 = require("../generate_doc_records_stream");
const progress_1 = require("../../progress");
const stubs_1 = require("./stubs");
describe('esArchiver: createGenerateDocRecordsStream()', () => {
    it('scolls 1000 documents at a time', async () => {
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient([
            (name, params) => {
                expect_1.default(name).to.be('search');
                expect_1.default(params).to.have.property('index', 'logstash-*');
                expect_1.default(params).to.have.property('size', 1000);
                return {
                    hits: {
                        total: 0,
                        hits: [],
                    },
                };
            },
        ]);
        const progress = new progress_1.Progress();
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(['logstash-*']),
            generate_doc_records_stream_1.createGenerateDocRecordsStream(client, stats, progress),
        ]);
        expect_1.default(progress.getTotal()).to.be(0);
        expect_1.default(progress.getComplete()).to.be(0);
    });
    it('uses a 1 minute scroll timeout', async () => {
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient([
            (name, params) => {
                expect_1.default(name).to.be('search');
                expect_1.default(params).to.have.property('index', 'logstash-*');
                expect_1.default(params).to.have.property('scroll', '1m');
                expect_1.default(params).to.have.property('rest_total_hits_as_int', true);
                return {
                    hits: {
                        total: 0,
                        hits: [],
                    },
                };
            },
        ]);
        const progress = new progress_1.Progress();
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(['logstash-*']),
            generate_doc_records_stream_1.createGenerateDocRecordsStream(client, stats, progress),
        ]);
        expect_1.default(progress.getTotal()).to.be(0);
        expect_1.default(progress.getComplete()).to.be(0);
    });
    it('consumes index names and scrolls completely before continuing', async () => {
        const stats = stubs_1.createStubStats();
        let checkpoint = Date.now();
        const client = stubs_1.createStubClient([
            async (name, params) => {
                expect_1.default(name).to.be('search');
                expect_1.default(params).to.have.property('index', 'index1');
                await bluebird_1.delay(200);
                return {
                    _scroll_id: 'index1ScrollId',
                    hits: { total: 2, hits: [{ _id: 1, _index: '.kibana_foo' }] },
                };
            },
            async (name, params) => {
                expect_1.default(name).to.be('scroll');
                expect_1.default(params).to.have.property('scrollId', 'index1ScrollId');
                expect_1.default(Date.now() - checkpoint).to.not.be.lessThan(200);
                checkpoint = Date.now();
                await bluebird_1.delay(200);
                return { hits: { total: 2, hits: [{ _id: 2, _index: 'foo' }] } };
            },
            async (name, params) => {
                expect_1.default(name).to.be('search');
                expect_1.default(params).to.have.property('index', 'index2');
                expect_1.default(Date.now() - checkpoint).to.not.be.lessThan(200);
                checkpoint = Date.now();
                await bluebird_1.delay(200);
                return { hits: { total: 0, hits: [] } };
            },
        ]);
        const progress = new progress_1.Progress();
        const docRecords = await utils_1.createPromiseFromStreams([
            utils_1.createListStream(['index1', 'index2']),
            generate_doc_records_stream_1.createGenerateDocRecordsStream(client, stats, progress),
            utils_1.createConcatStream([]),
        ]);
        expect_1.default(docRecords).to.eql([
            {
                type: 'doc',
                value: {
                    index: '.kibana_1',
                    type: undefined,
                    id: 1,
                    source: undefined,
                },
            },
            {
                type: 'doc',
                value: {
                    index: 'foo',
                    type: undefined,
                    id: 2,
                    source: undefined,
                },
            },
        ]);
        sinon_1.default.assert.calledTwice(stats.archivedDoc);
        expect_1.default(progress.getTotal()).to.be(2);
        expect_1.default(progress.getComplete()).to.be(2);
    });
});
