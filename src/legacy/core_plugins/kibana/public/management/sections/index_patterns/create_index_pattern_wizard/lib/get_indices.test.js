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
const get_indices_1 = require("./get_indices");
const public_1 = require("../../../../../../../../../plugins/index_pattern_management/public");
exports.successfulResponse = {
    hits: {
        total: 1,
        max_score: 0.0,
        hits: [],
    },
    aggregations: {
        indices: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
                {
                    key: '1',
                    doc_count: 1,
                },
                {
                    key: '2',
                    doc_count: 1,
                },
            ],
        },
    },
};
exports.exceptionResponse = {
    body: {
        error: {
            root_cause: [
                {
                    type: 'index_not_found_exception',
                    reason: 'no such index',
                    index_uuid: '_na_',
                    'resource.type': 'index_or_alias',
                    'resource.id': 't',
                    index: 't',
                },
            ],
            type: 'transport_exception',
            reason: 'unable to communicate with remote cluster [cluster_one]',
            caused_by: {
                type: 'index_not_found_exception',
                reason: 'no such index',
                index_uuid: '_na_',
                'resource.type': 'index_or_alias',
                'resource.id': 't',
                index: 't',
            },
        },
    },
    status: 500,
};
exports.errorResponse = {
    statusCode: 400,
    error: 'Bad Request',
};
const mockIndexPatternCreationType = new public_1.IndexPatternCreationConfig({
    type: 'default',
    name: 'name',
    showSystemIndices: false,
    httpClient: {},
    isBeta: false,
});
function esClientFactory(search) {
    return {
        search,
        msearch: () => ({
            abort: () => { },
            ...new Promise(resolve => resolve({})),
        }),
    };
}
const es = esClientFactory(() => exports.successfulResponse);
describe('getIndices', () => {
    it('should work in a basic case', async () => {
        const result = await get_indices_1.getIndices(es, mockIndexPatternCreationType, 'kibana', 1);
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('1');
        expect(result[1].name).toBe('2');
    });
    it('should ignore ccs query-all', async () => {
        expect((await get_indices_1.getIndices(es, mockIndexPatternCreationType, '*:', 10)).length).toBe(0);
    });
    it('should ignore a single comma', async () => {
        expect((await get_indices_1.getIndices(es, mockIndexPatternCreationType, ',', 10)).length).toBe(0);
        expect((await get_indices_1.getIndices(es, mockIndexPatternCreationType, ',*', 10)).length).toBe(0);
        expect((await get_indices_1.getIndices(es, mockIndexPatternCreationType, ',foobar', 10)).length).toBe(0);
    });
    it('should trim the input', async () => {
        let index;
        const esClient = esClientFactory(jest.fn().mockImplementation(params => {
            index = params.index;
        }));
        await get_indices_1.getIndices(esClient, mockIndexPatternCreationType, 'kibana          ', 1);
        expect(index).toBe('kibana');
    });
    it('should use the limit', async () => {
        let limit;
        const esClient = esClientFactory(jest.fn().mockImplementation(params => {
            limit = params.body.aggs.indices.terms.size;
        }));
        await get_indices_1.getIndices(esClient, mockIndexPatternCreationType, 'kibana', 10);
        expect(limit).toBe(10);
    });
    describe('errors', () => {
        it('should handle errors gracefully', async () => {
            const esClient = esClientFactory(() => exports.errorResponse);
            const result = await get_indices_1.getIndices(esClient, mockIndexPatternCreationType, 'kibana', 1);
            expect(result.length).toBe(0);
        });
        it('should throw exceptions', async () => {
            const esClient = esClientFactory(() => {
                throw new Error('Fail');
            });
            await expect(get_indices_1.getIndices(esClient, mockIndexPatternCreationType, 'kibana', 1)).rejects.toThrow();
        });
        it('should handle index_not_found_exception errors gracefully', async () => {
            const esClient = esClientFactory(() => new Promise((resolve, reject) => reject(exports.exceptionResponse)));
            const result = await get_indices_1.getIndices(esClient, mockIndexPatternCreationType, 'kibana', 1);
            expect(result.length).toBe(0);
        });
    });
});
