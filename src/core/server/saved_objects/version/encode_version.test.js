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
const encode_version_1 = require("./encode_version");
describe('encodeVersion', () => {
    it('throws if primaryTerm is not an integer', () => {
        expect(() => encode_version_1.encodeVersion(1, undefined)).toThrowErrorMatchingInlineSnapshot(`"_primary_term from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion(1, null)).toThrowErrorMatchingInlineSnapshot(`"_primary_term from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion(1, {})).toThrowErrorMatchingInlineSnapshot(`"_primary_term from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion(1, [])).toThrowErrorMatchingInlineSnapshot(`"_primary_term from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion(1, 2.5)).toThrowErrorMatchingInlineSnapshot(`"_primary_term from elasticsearch must be an integer"`);
    });
    it('throws if seqNo is not an integer', () => {
        expect(() => encode_version_1.encodeVersion(undefined, 1)).toThrowErrorMatchingInlineSnapshot(`"_seq_no from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion(null, 1)).toThrowErrorMatchingInlineSnapshot(`"_seq_no from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion({}, 1)).toThrowErrorMatchingInlineSnapshot(`"_seq_no from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion([], 1)).toThrowErrorMatchingInlineSnapshot(`"_seq_no from elasticsearch must be an integer"`);
        expect(() => encode_version_1.encodeVersion(2.5, 1)).toThrowErrorMatchingInlineSnapshot(`"_seq_no from elasticsearch must be an integer"`);
    });
    it('returns a base64 encoded, JSON string of seqNo and primaryTerm', () => {
        expect(encode_version_1.encodeVersion(123, 456)).toMatchInlineSnapshot(`"WzEyMyw0NTZd"`);
    });
});
