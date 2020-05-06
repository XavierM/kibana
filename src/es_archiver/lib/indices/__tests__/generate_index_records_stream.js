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
const utils_1 = require("../../../../legacy/utils");
const stubs_1 = require("./stubs");
const generate_index_records_stream_1 = require("../generate_index_records_stream");
describe('esArchiver: createGenerateIndexRecordsStream()', () => {
    it('consumes index names and queries for the mapping of each', async () => {
        const indices = ['index1', 'index2', 'index3', 'index4'];
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient(indices);
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(indices),
            generate_index_records_stream_1.createGenerateIndexRecordsStream(client, stats),
        ]);
        expect_1.default(stats.getTestSummary()).to.eql({
            archivedIndex: 4,
        });
        sinon_1.default.assert.callCount(client.indices.get, 4);
        sinon_1.default.assert.notCalled(client.indices.create);
        sinon_1.default.assert.notCalled(client.indices.delete);
        sinon_1.default.assert.notCalled(client.indices.exists);
    });
    it('filters index metadata from settings', async () => {
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient(['index1']);
        await utils_1.createPromiseFromStreams([
            utils_1.createListStream(['index1']),
            generate_index_records_stream_1.createGenerateIndexRecordsStream(client, stats),
        ]);
        const params = client.indices.get.args[0][0];
        expect_1.default(params).to.have.property('filterPath');
        const filters = params.filterPath;
        expect_1.default(filters.some(path => path.includes('index.creation_date'))).to.be(true);
        expect_1.default(filters.some(path => path.includes('index.uuid'))).to.be(true);
        expect_1.default(filters.some(path => path.includes('index.version'))).to.be(true);
        expect_1.default(filters.some(path => path.includes('index.provided_name'))).to.be(true);
    });
    it('produces one index record for each index name it receives', async () => {
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient(['index1', 'index2', 'index3']);
        const indexRecords = await utils_1.createPromiseFromStreams([
            utils_1.createListStream(['index1', 'index2', 'index3']),
            generate_index_records_stream_1.createGenerateIndexRecordsStream(client, stats),
            utils_1.createConcatStream([]),
        ]);
        expect_1.default(indexRecords).to.have.length(3);
        expect_1.default(indexRecords[0]).to.have.property('type', 'index');
        expect_1.default(indexRecords[0]).to.have.property('value');
        expect_1.default(indexRecords[0].value).to.have.property('index', 'index1');
        expect_1.default(indexRecords[1]).to.have.property('type', 'index');
        expect_1.default(indexRecords[1]).to.have.property('value');
        expect_1.default(indexRecords[1].value).to.have.property('index', 'index2');
        expect_1.default(indexRecords[2]).to.have.property('type', 'index');
        expect_1.default(indexRecords[2]).to.have.property('value');
        expect_1.default(indexRecords[2].value).to.have.property('index', 'index3');
    });
    it('understands aliases', async () => {
        const stats = stubs_1.createStubStats();
        const client = stubs_1.createStubClient(['index1'], { foo: 'index1' });
        const indexRecords = await utils_1.createPromiseFromStreams([
            utils_1.createListStream(['index1']),
            generate_index_records_stream_1.createGenerateIndexRecordsStream(client, stats),
            utils_1.createConcatStream([]),
        ]);
        expect_1.default(indexRecords).to.eql([
            {
                type: 'index',
                value: {
                    index: 'index1',
                    settings: {},
                    mappings: {},
                    aliases: { foo: {} },
                },
            },
        ]);
    });
});
