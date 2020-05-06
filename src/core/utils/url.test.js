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
const url_1 = require("./url");
describe('modifyUrl()', () => {
    test('throws an error with invalid input', () => {
        expect(() => url_1.modifyUrl(1, () => ({}))).toThrowError();
        expect(() => url_1.modifyUrl(undefined, () => ({}))).toThrowError();
        expect(() => url_1.modifyUrl('http://localhost', undefined)).toThrowError();
    });
    test('supports returning a new url spec', () => {
        expect(url_1.modifyUrl('http://localhost', () => ({}))).toEqual('');
    });
    test('supports modifying the passed object', () => {
        expect(url_1.modifyUrl('http://localhost', parsed => {
            parsed.port = '9999';
            parsed.auth = 'foo:bar';
            return parsed;
        })).toEqual('http://foo:bar@localhost:9999/');
    });
    test('supports changing pathname', () => {
        expect(url_1.modifyUrl('http://localhost/some/path', parsed => {
            parsed.pathname += '/subpath';
            return parsed;
        })).toEqual('http://localhost/some/path/subpath');
    });
    test('supports changing port', () => {
        expect(url_1.modifyUrl('http://localhost:5601', parsed => {
            parsed.port = (Number(parsed.port) + 1).toString();
            return parsed;
        })).toEqual('http://localhost:5602/');
    });
    test('supports changing protocol', () => {
        expect(url_1.modifyUrl('http://localhost', parsed => {
            parsed.protocol = 'mail';
            parsed.slashes = false;
            parsed.pathname = null;
            return parsed;
        })).toEqual('mail:localhost');
    });
});
describe('isRelativeUrl()', () => {
    test('returns "true" for a relative URL', () => {
        expect(url_1.isRelativeUrl('good')).toBe(true);
        expect(url_1.isRelativeUrl('/good')).toBe(true);
        expect(url_1.isRelativeUrl('/good/even/better')).toBe(true);
    });
    test('returns "false" for a non-relative URL', () => {
        expect(url_1.isRelativeUrl('http://evil.com')).toBe(false);
        expect(url_1.isRelativeUrl('//evil.com')).toBe(false);
        expect(url_1.isRelativeUrl('///evil.com')).toBe(false);
        expect(url_1.isRelativeUrl(' //evil.com')).toBe(false);
    });
});
