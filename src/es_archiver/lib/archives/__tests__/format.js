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
const stream_1 = tslib_1.__importDefault(require("stream"));
const zlib_1 = require("zlib");
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const utils_1 = require("../../../../legacy/utils");
const format_1 = require("../format");
const INPUTS = [1, 2, { foo: 'bar' }, [1, 2]];
const INPUT_JSON = INPUTS.map(i => JSON.stringify(i, null, 2)).join('\n\n');
describe('esArchiver createFormatArchiveStreams', () => {
    describe('{ gzip: false }', () => {
        it('returns an array of streams', () => {
            const streams = format_1.createFormatArchiveStreams({ gzip: false });
            expect_1.default(streams).to.be.an('array');
            expect_1.default(streams.length).to.be.greaterThan(0);
            streams.forEach(s => expect_1.default(s).to.be.a(stream_1.default));
        });
        it('streams consume js values and produces buffers', async () => {
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream(INPUTS),
                ...format_1.createFormatArchiveStreams({ gzip: false }),
                utils_1.createConcatStream([]),
            ]);
            expect_1.default(output.length).to.be.greaterThan(0);
            output.forEach(b => expect_1.default(b).to.be.a(Buffer));
        });
        it('product is pretty-printed JSON separated by two newlines', async () => {
            const json = await utils_1.createPromiseFromStreams([
                utils_1.createListStream(INPUTS),
                ...format_1.createFormatArchiveStreams({ gzip: false }),
                utils_1.createConcatStream(''),
            ]);
            expect_1.default(json).to.be(INPUT_JSON);
        });
    });
    describe('{ gzip: true }', () => {
        it('returns an array of streams', () => {
            const streams = format_1.createFormatArchiveStreams({ gzip: true });
            expect_1.default(streams).to.be.an('array');
            expect_1.default(streams.length).to.be.greaterThan(0);
            streams.forEach(s => expect_1.default(s).to.be.a(stream_1.default));
        });
        it('streams consume js values and produces buffers', async () => {
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream([1, 2, { foo: 'bar' }, [1, 2]]),
                ...format_1.createFormatArchiveStreams({ gzip: true }),
                utils_1.createConcatStream([]),
            ]);
            expect_1.default(output.length).to.be.greaterThan(0);
            output.forEach(b => expect_1.default(b).to.be.a(Buffer));
        });
        it('output can be gunzipped', async () => {
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream(INPUTS),
                ...format_1.createFormatArchiveStreams({ gzip: true }),
                zlib_1.createGunzip(),
                utils_1.createConcatStream(''),
            ]);
            expect_1.default(output).to.be(INPUT_JSON);
        });
    });
    describe('defaults', () => {
        it('product is not gzipped', async () => {
            const json = await utils_1.createPromiseFromStreams([
                utils_1.createListStream(INPUTS),
                ...format_1.createFormatArchiveStreams(),
                utils_1.createConcatStream(''),
            ]);
            expect_1.default(json).to.be(INPUT_JSON);
        });
    });
});
