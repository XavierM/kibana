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
const build_active_mappings_1 = require("./build_active_mappings");
describe('buildActiveMappings', () => {
    test('creates a strict mapping', () => {
        const mappings = build_active_mappings_1.buildActiveMappings({});
        expect(mappings.dynamic).toEqual('strict');
    });
    test('combines all mappings and includes core mappings', () => {
        const properties = {
            aaa: { type: 'text' },
            bbb: { type: 'long' },
        };
        expect(build_active_mappings_1.buildActiveMappings(properties)).toMatchSnapshot();
    });
    test('disallows duplicate mappings', () => {
        const properties = { type: { type: 'long' } };
        expect(() => build_active_mappings_1.buildActiveMappings(properties)).toThrow(/Cannot redefine core mapping \"type\"/);
    });
    test('disallows mappings with leading underscore', () => {
        const properties = { _hm: { type: 'keyword' } };
        expect(() => build_active_mappings_1.buildActiveMappings(properties)).toThrow(/Invalid mapping \"_hm\"\. Mappings cannot start with _/);
    });
    test('handles the `dynamic` property of types', () => {
        const typeMappings = {
            firstType: {
                dynamic: 'strict',
                properties: { field: { type: 'keyword' } },
            },
            secondType: {
                dynamic: false,
                properties: { field: { type: 'long' } },
            },
            thirdType: {
                properties: { field: { type: 'text' } },
            },
        };
        expect(build_active_mappings_1.buildActiveMappings(typeMappings)).toMatchSnapshot();
    });
    test('generated hashes are stable', () => {
        const properties = {
            aaa: { type: 'keyword', fields: { a: { type: 'keyword' }, b: { type: 'text' } } },
            bbb: { fields: { b: { type: 'text' }, a: { type: 'keyword' } }, type: 'keyword' },
            ccc: { fields: { b: { type: 'text' }, a: { type: 'text' } }, type: 'keyword' },
        };
        const mappings = build_active_mappings_1.buildActiveMappings(properties);
        const hashes = mappings._meta.migrationMappingPropertyHashes;
        expect(hashes.aaa).toBeDefined();
        expect(hashes.aaa).toEqual(hashes.bbb);
        expect(hashes.aaa).not.toEqual(hashes.ccc);
    });
});
describe('diffMappings', () => {
    test('is different if expected contains extra hashes', () => {
        const actual = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {},
        };
        const expected = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar', baz: 'qux' },
            },
            dynamic: 'strict',
            properties: {},
        };
        expect(build_active_mappings_1.diffMappings(actual, expected).changedProp).toEqual('properties.baz');
    });
    test('does nothing if actual contains extra hashes', () => {
        const actual = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar', baz: 'qux' },
            },
            dynamic: 'strict',
            properties: {},
        };
        const expected = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {},
        };
        expect(build_active_mappings_1.diffMappings(actual, expected)).toBeUndefined();
    });
    test('does nothing if actual hashes are identical to expected, but properties differ', () => {
        const actual = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {
                foo: { type: 'keyword' },
            },
        };
        const expected = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {
                foo: { type: 'text' },
            },
        };
        expect(build_active_mappings_1.diffMappings(actual, expected)).toBeUndefined();
    });
    test('is different if meta hashes change', () => {
        const actual = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {},
        };
        const expected = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'baz' },
            },
            dynamic: 'strict',
            properties: {},
        };
        expect(build_active_mappings_1.diffMappings(actual, expected).changedProp).toEqual('properties.foo');
    });
    test('is different if dynamic is different', () => {
        const actual = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {},
        };
        const expected = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'abcde',
            properties: {},
        };
        expect(build_active_mappings_1.diffMappings(actual, expected).changedProp).toEqual('dynamic');
    });
    test('is different if migrationMappingPropertyHashes is missing from actual', () => {
        const actual = {
            _meta: {},
            dynamic: 'strict',
            properties: {},
        };
        const expected = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {},
        };
        expect(build_active_mappings_1.diffMappings(actual, expected).changedProp).toEqual('_meta');
    });
    test('is different if _meta is missing from actual', () => {
        const actual = {
            dynamic: 'strict',
            properties: {},
        };
        const expected = {
            _meta: {
                migrationMappingPropertyHashes: { foo: 'bar' },
            },
            dynamic: 'strict',
            properties: {},
        };
        expect(build_active_mappings_1.diffMappings(actual, expected).changedProp).toEqual('_meta');
    });
});
