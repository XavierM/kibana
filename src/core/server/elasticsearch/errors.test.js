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
const boom_1 = tslib_1.__importDefault(require("boom"));
const errors_1 = require("./errors");
describe('ElasticsearchErrorHelpers', () => {
    describe('NotAuthorized error', () => {
        describe('decorateNotAuthorizedError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.ElasticsearchErrorHelpers.decorateNotAuthorizedError(error)).toBe(error);
            });
            it('makes the error identifiable as a NotAuthorized error', () => {
                const error = new Error();
                expect(errors_1.ElasticsearchErrorHelpers.isNotAuthorizedError(error)).toBe(false);
                errors_1.ElasticsearchErrorHelpers.decorateNotAuthorizedError(error);
                expect(errors_1.ElasticsearchErrorHelpers.isNotAuthorizedError(error)).toBe(true);
            });
            it('adds boom properties', () => {
                const error = errors_1.ElasticsearchErrorHelpers.decorateNotAuthorizedError(new Error());
                expect(typeof error.output).toBe('object');
                expect(error.output.statusCode).toBe(401);
            });
            it('preserves boom properties of input', () => {
                const error = boom_1.default.notFound();
                errors_1.ElasticsearchErrorHelpers.decorateNotAuthorizedError(error);
                expect(error.output.statusCode).toBe(404);
            });
            describe('error.output', () => {
                it('defaults to message of error', () => {
                    const error = errors_1.ElasticsearchErrorHelpers.decorateNotAuthorizedError(new Error('foobar'));
                    expect(error.output.payload).toHaveProperty('message', 'foobar');
                });
                it('prefixes message with passed reason', () => {
                    const error = errors_1.ElasticsearchErrorHelpers.decorateNotAuthorizedError(new Error('foobar'), 'biz');
                    expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
                });
                it('sets statusCode to 401', () => {
                    const error = errors_1.ElasticsearchErrorHelpers.decorateNotAuthorizedError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 401);
                });
            });
        });
    });
});
