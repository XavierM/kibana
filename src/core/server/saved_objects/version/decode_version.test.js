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
const decode_version_1 = require("./decode_version");
describe('decodeVersion', () => {
    it('parses version back into {_seq_no,_primary_term} object', () => {
        expect(decode_version_1.decodeVersion('WzQsMV0=')).toMatchInlineSnapshot(`
Object {
  "_primary_term": 1,
  "_seq_no": 4,
}
`);
    });
    it('throws Boom error if not in base64', () => {
        let error;
        try {
            decode_version_1.decodeVersion('[1,4]');
        }
        catch (err) {
            error = err;
        }
        expect(error.message).toMatchInlineSnapshot(`"Invalid version [[1,4]]"`);
        expect(boom_1.default.isBoom(error)).toBe(true);
        expect(error.output).toMatchInlineSnapshot(`
Object {
  "headers": Object {},
  "payload": Object {
    "error": "Bad Request",
    "message": "Invalid version [[1,4]]",
    "statusCode": 400,
  },
  "statusCode": 400,
}
`);
    });
    it('throws if not JSON encoded', () => {
        let error;
        try {
            decode_version_1.decodeVersion('MSwy');
        }
        catch (err) {
            error = err;
        }
        expect(error.message).toMatchInlineSnapshot(`"Invalid version [MSwy]"`);
        expect(boom_1.default.isBoom(error)).toBe(true);
        expect(error.output).toMatchInlineSnapshot(`
Object {
  "headers": Object {},
  "payload": Object {
    "error": "Bad Request",
    "message": "Invalid version [MSwy]",
    "statusCode": 400,
  },
  "statusCode": 400,
}
`);
    });
    it('throws if either value is not an integer', () => {
        let error;
        try {
            decode_version_1.decodeVersion('WzEsMy41XQ==');
        }
        catch (err) {
            error = err;
        }
        expect(error.message).toMatchInlineSnapshot(`"Invalid version [WzEsMy41XQ==]"`);
        expect(boom_1.default.isBoom(error)).toBe(true);
        expect(error.output).toMatchInlineSnapshot(`
Object {
  "headers": Object {},
  "payload": Object {
    "error": "Bad Request",
    "message": "Invalid version [WzEsMy41XQ==]",
    "statusCode": 400,
  },
  "statusCode": 400,
}
`);
    });
});
