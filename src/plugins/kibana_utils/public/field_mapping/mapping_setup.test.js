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
const mapping_setup_1 = require("./mapping_setup");
const public_1 = require("../../../data/public");
describe('mapping_setup', () => {
    it('allows shortcuts for field types by just setting the value to the type name', () => {
        const mapping = mapping_setup_1.expandShorthand({ foo: public_1.ES_FIELD_TYPES.BOOLEAN });
        expect(mapping.foo.type).toBe('boolean');
    });
    it('can set type as an option', () => {
        const mapping = mapping_setup_1.expandShorthand({ foo: { type: public_1.ES_FIELD_TYPES.INTEGER } });
        expect(mapping.foo.type).toBe('integer');
    });
    describe('when type is json', () => {
        it('returned object is type text', () => {
            const mapping = mapping_setup_1.expandShorthand({ foo: 'json' });
            expect(mapping.foo.type).toBe('text');
        });
        it('returned object has _serialize function', () => {
            const mapping = mapping_setup_1.expandShorthand({ foo: 'json' });
            expect(mapping.foo._serialize).toBeInstanceOf(Function);
        });
        it('returned object has _deserialize function', () => {
            const mapping = mapping_setup_1.expandShorthand({ foo: 'json' });
            expect(mapping.foo._serialize).toBeInstanceOf(Function);
        });
    });
});
