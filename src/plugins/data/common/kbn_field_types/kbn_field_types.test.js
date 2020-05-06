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
const _1 = require("./");
const types_1 = require("./types");
describe('utils/kbn_field_types', () => {
    describe('KbnFieldType', () => {
        test('defaults', () => {
            const kbnFieldType = new _1.KbnFieldType({});
            expect(kbnFieldType).toHaveProperty('name', types_1.KBN_FIELD_TYPES.UNKNOWN);
            expect(kbnFieldType).toHaveProperty('sortable', false);
            expect(kbnFieldType).toHaveProperty('filterable', false);
            expect(kbnFieldType.esTypes).toEqual([]);
        });
        test('assigns name, sortable, filterable, and esTypes options to itself', () => {
            const name = 'name';
            const sortable = true;
            const filterable = true;
            const esTypes = [types_1.ES_FIELD_TYPES.LONG, types_1.ES_FIELD_TYPES.BYTE, types_1.ES_FIELD_TYPES.DATE];
            const kbnFieldType = new _1.KbnFieldType({ name, sortable, filterable, esTypes });
            expect(kbnFieldType).toHaveProperty('name', name);
            expect(kbnFieldType).toHaveProperty('sortable', sortable);
            expect(kbnFieldType).toHaveProperty('filterable', filterable);
            expect(kbnFieldType.esTypes).toEqual(esTypes);
        });
    });
    describe('getKbnFieldType()', () => {
        test('returns a KbnFieldType instance by name', () => {
            const kbnFieldType = _1.getKbnFieldType(types_1.ES_FIELD_TYPES.STRING);
            expect(kbnFieldType).toBeInstanceOf(_1.KbnFieldType);
            expect(kbnFieldType).toHaveProperty('name', types_1.ES_FIELD_TYPES.STRING);
        });
        test('returns undefined for invalid name', () => {
            const kbnFieldType = _1.getKbnFieldType('wrongType');
            expect(kbnFieldType).toBeUndefined();
        });
    });
    describe('castEsToKbnFieldTypeName()', () => {
        test('returns the kbnFieldType name that matches the esType', () => {
            expect(_1.castEsToKbnFieldTypeName(types_1.ES_FIELD_TYPES.KEYWORD)).toBe('string');
            expect(_1.castEsToKbnFieldTypeName(types_1.ES_FIELD_TYPES.FLOAT)).toBe('number');
        });
        test('returns unknown for unknown es types', () => {
            const castTo = _1.castEsToKbnFieldTypeName('wrongType');
            expect(castTo).toBe('unknown');
        });
    });
    describe('getKbnTypeNames()', () => {
        test('returns a list of all kbnFieldType names', () => {
            const kbnTypeNames = _1.getKbnTypeNames().sort();
            expect(kbnTypeNames).toEqual([
                types_1.KBN_FIELD_TYPES._SOURCE,
                types_1.KBN_FIELD_TYPES.ATTACHMENT,
                types_1.KBN_FIELD_TYPES.BOOLEAN,
                types_1.KBN_FIELD_TYPES.CONFLICT,
                types_1.KBN_FIELD_TYPES.DATE,
                types_1.KBN_FIELD_TYPES.GEO_POINT,
                types_1.KBN_FIELD_TYPES.GEO_SHAPE,
                types_1.KBN_FIELD_TYPES.HISTOGRAM,
                types_1.KBN_FIELD_TYPES.IP,
                types_1.KBN_FIELD_TYPES.MURMUR3,
                types_1.KBN_FIELD_TYPES.NESTED,
                types_1.KBN_FIELD_TYPES.NUMBER,
                types_1.KBN_FIELD_TYPES.OBJECT,
                types_1.KBN_FIELD_TYPES.STRING,
                types_1.KBN_FIELD_TYPES.UNKNOWN,
            ]);
        });
    });
});
