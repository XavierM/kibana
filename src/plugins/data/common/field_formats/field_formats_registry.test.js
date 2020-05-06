"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const field_formats_registry_1 = require("./field_formats_registry");
const converters_1 = require("./converters");
const common_1 = require("../../common");
const getValueOfPrivateField = (instance, field) => instance[field];
describe('FieldFormatsRegistry', () => {
    let fieldFormatsRegistry;
    let defaultMap = {};
    const getConfig = (() => defaultMap);
    beforeEach(() => {
        fieldFormatsRegistry = new field_formats_registry_1.FieldFormatsRegistry();
        fieldFormatsRegistry.init(getConfig, {
            parsedUrl: {
                origin: '',
                pathname: '',
                basePath: '',
            },
        }, []);
    });
    test('should allows to create an instance of "FieldFormatsRegistry"', () => {
        expect(fieldFormatsRegistry).toBeDefined();
        expect(getValueOfPrivateField(fieldFormatsRegistry, 'fieldFormats')).toBeDefined();
        expect(getValueOfPrivateField(fieldFormatsRegistry, 'defaultMap')).toEqual({});
    });
    describe('init', () => {
        test('should provide an public "init" method', () => {
            expect(fieldFormatsRegistry.init).toBeDefined();
            expect(typeof fieldFormatsRegistry.init).toBe('function');
        });
        test('should populate the "defaultMap" object', () => {
            defaultMap = {
                number: { id: 'number', params: {} },
            };
            fieldFormatsRegistry.init(getConfig, {}, []);
            expect(getValueOfPrivateField(fieldFormatsRegistry, 'defaultMap')).toEqual(defaultMap);
        });
    });
    describe('register', () => {
        test('should provide an public "register" method', () => {
            expect(fieldFormatsRegistry.register).toBeDefined();
            expect(typeof fieldFormatsRegistry.register).toBe('function');
        });
        test('should register field formats', () => {
            fieldFormatsRegistry.register([converters_1.StringFormat, converters_1.BoolFormat]);
            const registeredFieldFormatters = getValueOfPrivateField(fieldFormatsRegistry, 'fieldFormats');
            expect(registeredFieldFormatters.size).toBe(2);
            expect(registeredFieldFormatters.get(converters_1.BoolFormat.id)).toBe(converters_1.BoolFormat);
            expect(registeredFieldFormatters.get(converters_1.StringFormat.id)).toBe(converters_1.StringFormat);
            expect(registeredFieldFormatters.get(converters_1.PercentFormat.id)).toBeUndefined();
        });
    });
    describe('getType', () => {
        test('should provide an public "getType" method', () => {
            expect(fieldFormatsRegistry.getType).toBeDefined();
            expect(typeof fieldFormatsRegistry.getType).toBe('function');
        });
        test('should return the registered type of the field format by identifier', () => {
            fieldFormatsRegistry.register([converters_1.StringFormat]);
            expect(fieldFormatsRegistry.getType(converters_1.StringFormat.id)).toBeDefined();
        });
        test('should return void if the field format type has not been registered', () => {
            fieldFormatsRegistry.register([converters_1.BoolFormat]);
            expect(fieldFormatsRegistry.getType(converters_1.StringFormat.id)).toBeUndefined();
        });
    });
    describe('fieldFormatMetaParamsDecorator', () => {
        test('should set meta params for all instances of FieldFormats', () => {
            fieldFormatsRegistry.register([converters_1.StringFormat]);
            const DecoratedStingFormat = fieldFormatsRegistry.getType(converters_1.StringFormat.id);
            expect(DecoratedStingFormat).toBeDefined();
            if (DecoratedStingFormat) {
                const stringFormat = new DecoratedStingFormat({
                    foo: 'foo',
                });
                const params = getValueOfPrivateField(stringFormat, '_params');
                expect(params).toHaveProperty('foo');
                expect(params).toHaveProperty('parsedUrl');
                expect(params.parsedUrl).toHaveProperty('origin');
                expect(params.parsedUrl).toHaveProperty('pathname');
                expect(params.parsedUrl).toHaveProperty('basePath');
            }
        });
        test('should decorate static fields', () => {
            fieldFormatsRegistry.register([converters_1.BoolFormat]);
            const DecoratedBoolFormat = fieldFormatsRegistry.getType(converters_1.BoolFormat.id);
            expect(DecoratedBoolFormat).toBeDefined();
            if (DecoratedBoolFormat) {
                expect(DecoratedBoolFormat.id).toBe(converters_1.BoolFormat.id);
                expect(DecoratedBoolFormat.fieldType).toBe(converters_1.BoolFormat.fieldType);
            }
        });
    });
    describe('getByFieldType', () => {
        test('should provide an public "getByFieldType" method', () => {
            expect(fieldFormatsRegistry.getByFieldType).toBeDefined();
            expect(typeof fieldFormatsRegistry.getByFieldType).toBe('function');
        });
        test('should decorate returns types', () => {
            fieldFormatsRegistry.register([converters_1.StringFormat, converters_1.BoolFormat]);
            const [DecoratedStringFormat] = fieldFormatsRegistry.getByFieldType(common_1.KBN_FIELD_TYPES.STRING);
            expect(DecoratedStringFormat).toBeDefined();
            const stingFormat = new DecoratedStringFormat({ foo: 'foo' });
            const params = getValueOfPrivateField(stingFormat, '_params');
            expect(params).toHaveProperty('foo');
            expect(params).toHaveProperty('parsedUrl');
        });
    });
});
