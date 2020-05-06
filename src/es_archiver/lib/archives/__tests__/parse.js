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
const stream_1 = tslib_1.__importStar(require("stream"));
const zlib_1 = require("zlib");
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const utils_1 = require("../../../../legacy/utils");
const parse_1 = require("../parse");
describe('esArchiver createParseArchiveStreams', () => {
    describe('{ gzip: false }', () => {
        it('returns an array of streams', () => {
            const streams = parse_1.createParseArchiveStreams({ gzip: false });
            expect_1.default(streams).to.be.an('array');
            expect_1.default(streams.length).to.be.greaterThan(0);
            streams.forEach(s => expect_1.default(s).to.be.a(stream_1.default));
        });
        describe('streams', () => {
            it('consume buffers of valid JSON', async () => {
                const output = await utils_1.createPromiseFromStreams([
                    utils_1.createListStream([
                        Buffer.from('{'),
                        Buffer.from('"'),
                        Buffer.from('a":'),
                        Buffer.from('1}'),
                    ]),
                    ...parse_1.createParseArchiveStreams({ gzip: false }),
                ]);
                expect_1.default(output).to.eql({ a: 1 });
            });
            it('consume buffers of valid JSON separated by two newlines', async () => {
                const output = await utils_1.createPromiseFromStreams([
                    utils_1.createListStream([
                        Buffer.from('{'),
                        Buffer.from('"'),
                        Buffer.from('a":'),
                        Buffer.from('1}'),
                        Buffer.from('\n'),
                        Buffer.from('\n'),
                        Buffer.from('1'),
                    ]),
                    ...parse_1.createParseArchiveStreams({ gzip: false }),
                    utils_1.createConcatStream([]),
                ]);
                expect_1.default(output).to.eql([{ a: 1 }, 1]);
            });
            it('provides each JSON object as soon as it is parsed', async () => {
                let onReceived;
                const receivedPromise = new Promise(resolve => (onReceived = resolve));
                const input = new stream_1.PassThrough();
                const check = new stream_1.Transform({
                    writableObjectMode: true,
                    readableObjectMode: true,
                    transform(chunk, env, callback) {
                        onReceived(chunk);
                        callback(undefined, chunk);
                    },
                });
                const finalPromise = utils_1.createPromiseFromStreams([
                    input,
                    ...parse_1.createParseArchiveStreams(),
                    check,
                    utils_1.createConcatStream([]),
                ]);
                input.write(Buffer.from('{"a": 1}\n\n{"a":'));
                expect_1.default(await receivedPromise).to.eql({ a: 1 });
                input.write(Buffer.from('2}'));
                input.end();
                expect_1.default(await finalPromise).to.eql([{ a: 1 }, { a: 2 }]);
            });
        });
        describe('stream errors', () => {
            it('stops when any document contains invalid json', async () => {
                try {
                    await utils_1.createPromiseFromStreams([
                        utils_1.createListStream([
                            Buffer.from('{"a": 1}\n\n'),
                            Buffer.from('{1}\n\n'),
                            Buffer.from('{"a": 2}\n\n'),
                        ]),
                        ...parse_1.createParseArchiveStreams({ gzip: false }),
                        utils_1.createConcatStream(),
                    ]);
                    throw new Error('should have failed');
                }
                catch (err) {
                    expect_1.default(err.message).to.contain('Unexpected number');
                }
            });
        });
    });
    describe('{ gzip: true }', () => {
        it('returns an array of streams', () => {
            const streams = parse_1.createParseArchiveStreams({ gzip: true });
            expect_1.default(streams).to.be.an('array');
            expect_1.default(streams.length).to.be.greaterThan(0);
            streams.forEach(s => expect_1.default(s).to.be.a(stream_1.default));
        });
        describe('streams', () => {
            it('consumes gzipped buffers of valid JSON', async () => {
                const output = await utils_1.createPromiseFromStreams([
                    utils_1.createListStream([
                        Buffer.from('{'),
                        Buffer.from('"'),
                        Buffer.from('a":'),
                        Buffer.from('1}'),
                    ]),
                    zlib_1.createGzip(),
                    ...parse_1.createParseArchiveStreams({ gzip: true }),
                ]);
                expect_1.default(output).to.eql({ a: 1 });
            });
            it('parses valid gzipped JSON strings separated by two newlines', async () => {
                const output = await utils_1.createPromiseFromStreams([
                    utils_1.createListStream(['{\n', '  "a": 1\n', '}', '\n\n', '{"a":2}']),
                    zlib_1.createGzip(),
                    ...parse_1.createParseArchiveStreams({ gzip: true }),
                    utils_1.createConcatStream([]),
                ]);
                expect_1.default(output).to.eql([{ a: 1 }, { a: 2 }]);
            });
        });
        it('parses blank files', async () => {
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream([]),
                zlib_1.createGzip(),
                ...parse_1.createParseArchiveStreams({ gzip: true }),
                utils_1.createConcatStream([]),
            ]);
            expect_1.default(output).to.eql([]);
        });
        describe('stream errors', () => {
            it('stops when the input is not valid gzip archive', async () => {
                try {
                    await utils_1.createPromiseFromStreams([
                        utils_1.createListStream([Buffer.from('{"a": 1}')]),
                        ...parse_1.createParseArchiveStreams({ gzip: true }),
                        utils_1.createConcatStream(),
                    ]);
                    throw new Error('should have failed');
                }
                catch (err) {
                    expect_1.default(err.message).to.contain('incorrect header check');
                }
            });
        });
    });
    describe('defaults', () => {
        it('does not try to gunzip the content', async () => {
            const output = await utils_1.createPromiseFromStreams([
                utils_1.createListStream([Buffer.from('{"a": 1}')]),
                ...parse_1.createParseArchiveStreams(),
            ]);
            expect_1.default(output).to.eql({ a: 1 });
        });
    });
});
