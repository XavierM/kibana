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
const list_control_factory_1 = require("./list_control_factory");
const editor_utils_1 = require("../editor_utils");
const test_utils_1 = require("../test_utils");
describe('listControlFactory', () => {
    const searchSourceMock = test_utils_1.getSearchSourceMock();
    const deps = test_utils_1.getDepsMock({
        searchSource: {
            create: searchSourceMock,
        },
    });
    describe('hasValue', () => {
        const controlParams = {
            id: '1',
            fieldName: 'myField',
            options: {},
            type: editor_utils_1.CONTROL_TYPES.LIST,
            label: 'test',
            indexPattern: {},
            parent: 'parent',
        };
        const useTimeFilter = false;
        let listControl;
        beforeEach(async () => {
            listControl = await list_control_factory_1.listControlFactory(controlParams, useTimeFilter, deps);
        });
        test('should be false when control has no value', () => {
            expect(listControl.hasValue()).toBe(false);
        });
        test('should be true when control has value', () => {
            listControl.set([{ value: 'selected option', label: 'selection option' }]);
            expect(listControl.hasValue()).toBe(true);
        });
        test('should be true when control has value that is the string "false"', () => {
            listControl.set([{ value: 'false', label: 'selection option' }]);
            expect(listControl.hasValue()).toBe(true);
        });
    });
    describe('fetch', () => {
        const controlParams = {
            id: '1',
            fieldName: 'myField',
            options: {},
            type: editor_utils_1.CONTROL_TYPES.LIST,
            label: 'test',
            indexPattern: {},
            parent: 'parent',
        };
        const useTimeFilter = false;
        let listControl;
        beforeEach(async () => {
            listControl = await list_control_factory_1.listControlFactory(controlParams, useTimeFilter, deps);
        });
        test('should pass in timeout parameters from injected vars', async () => {
            await listControl.fetch();
            expect(searchSourceMock).toHaveBeenCalledWith({
                timeout: `1000ms`,
                terminate_after: 100000,
            });
        });
        test('should set selectOptions to results of terms aggregation', async () => {
            await listControl.fetch();
            expect(listControl.selectOptions).toEqual([
                'Zurich Airport',
                'Xi an Xianyang International Airport',
            ]);
        });
    });
    describe('fetch with ancestors', () => {
        const controlParams = {
            id: '1',
            fieldName: 'myField',
            options: {},
            type: editor_utils_1.CONTROL_TYPES.LIST,
            label: 'test',
            indexPattern: {},
            parent: 'parent',
        };
        const useTimeFilter = false;
        let listControl;
        let parentControl;
        beforeEach(async () => {
            listControl = await list_control_factory_1.listControlFactory(controlParams, useTimeFilter, deps);
            const parentControlParams = {
                id: 'parent',
                fieldName: 'myField',
                options: {},
                type: editor_utils_1.CONTROL_TYPES.LIST,
                label: 'test',
                indexPattern: {},
                parent: 'parent',
            };
            parentControl = await list_control_factory_1.listControlFactory(parentControlParams, useTimeFilter, deps);
            parentControl.clear();
            listControl.setAncestors([parentControl]);
        });
        describe('ancestor does not have value', () => {
            test('should disable control', async () => {
                await listControl.fetch();
                expect(listControl.isEnabled()).toBe(false);
            });
            test('should reset lastAncestorValues', async () => {
                listControl.lastAncestorValues = 'last ancestor value';
                await listControl.fetch();
                expect(listControl.lastAncestorValues).toBeUndefined();
            });
        });
    });
});
