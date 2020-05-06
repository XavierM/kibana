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
const streams_1 = require("../../../../legacy/utils/streams");
const create_limit_stream_1 = require("./create_limit_stream");
describe('createLimitStream()', () => {
    test('limit of 5 allows 5 items through', async () => {
        await streams_1.createPromiseFromStreams([streams_1.createListStream([1, 2, 3, 4, 5]), create_limit_stream_1.createLimitStream(5)]);
    });
    test('limit of 5 errors out when 6 items are through', async () => {
        await expect(streams_1.createPromiseFromStreams([streams_1.createListStream([1, 2, 3, 4, 5, 6]), create_limit_stream_1.createLimitStream(5)])).rejects.toThrowErrorMatchingInlineSnapshot(`"Can't import more than 5 objects"`);
    });
    test('send the values on the output stream', async () => {
        const result = await streams_1.createPromiseFromStreams([
            streams_1.createListStream([1, 2, 3]),
            create_limit_stream_1.createLimitStream(3),
            streams_1.createConcatStream([]),
        ]);
        expect(result).toMatchInlineSnapshot(`
Array [
  1,
  2,
  3,
]
`);
    });
});
