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
const utils_1 = require("./utils");
describe('NumberList utils', () => {
    let modelList;
    let range;
    let invalidEntry;
    beforeEach(() => {
        modelList = [
            { value: 1, id: '1', isInvalid: false },
            { value: 2, id: '2', isInvalid: false },
        ];
        range = {
            min: 1,
            max: 10,
            minInclusive: true,
            maxInclusive: true,
            within: jest.fn(() => true),
        };
        invalidEntry = {
            value: expect.any(Number),
            isInvalid: true,
            error: expect.any(String),
            id: expect.any(String),
        };
    });
    describe('getInitModelList', () => {
        test('should return list with default model when number list is empty', () => {
            const models = utils_1.getInitModelList([]);
            expect(models).toEqual([{ value: 0, id: expect.any(String), isInvalid: false }]);
        });
        test('should return model list', () => {
            const models = utils_1.getInitModelList([1, undefined]);
            expect(models).toEqual([
                { value: 1, id: expect.any(String), isInvalid: false },
                { value: '', id: expect.any(String), isInvalid: false },
            ]);
        });
    });
    describe('getValidatedModels', () => {
        test('should return model list when number list is empty', () => {
            const updatedModelList = utils_1.getValidatedModels([], modelList, range);
            expect(updatedModelList).toEqual([{ value: 0, id: expect.any(String), isInvalid: false }]);
        });
        test('should not update model list when number list is the same', () => {
            const updatedModelList = utils_1.getValidatedModels([1, 2], modelList, range);
            expect(updatedModelList).toEqual(modelList);
        });
        test('should update model list when number list was changed', () => {
            const updatedModelList = utils_1.getValidatedModels([1, 3], modelList, range);
            modelList[1].value = 3;
            expect(updatedModelList).toEqual(modelList);
        });
        test('should update model list when number list increased', () => {
            const updatedModelList = utils_1.getValidatedModels([1, 2, 3], modelList, range);
            expect(updatedModelList).toEqual([
                ...modelList,
                { value: 3, id: expect.any(String), isInvalid: false },
            ]);
        });
        test('should update model list when number list decreased', () => {
            const updatedModelList = utils_1.getValidatedModels([2], modelList, range);
            expect(updatedModelList).toEqual([{ value: 2, id: '1', isInvalid: false }]);
        });
        test('should update model list when number list has undefined value', () => {
            const updatedModelList = utils_1.getValidatedModels([1, undefined], modelList, range);
            modelList[1].value = '';
            modelList[1].isInvalid = true;
            expect(updatedModelList).toEqual(modelList);
        });
        test('should identify when a number is out of order', () => {
            const updatedModelList = utils_1.getValidatedModels([1, 3, 2], modelList, range, true);
            expect(updatedModelList[2]).toEqual(invalidEntry);
        });
        test('should identify when many numbers are out of order', () => {
            const updatedModelList = utils_1.getValidatedModels([1, 3, 2, 3, 4, 2], modelList, range, true);
            expect(updatedModelList[2]).toEqual(invalidEntry);
            expect(updatedModelList[5]).toEqual(invalidEntry);
        });
        test('should identify a duplicate', () => {
            const updatedModelList = utils_1.getValidatedModels([1, 2, 3, 6, 2], modelList, range, false, true);
            expect(updatedModelList[4]).toEqual(invalidEntry);
        });
        test('should identify many duplicates', () => {
            const updatedModelList = utils_1.getValidatedModels([2, 2, 2, 3, 4, 5, 2, 2, 3], modelList, range, false, true);
            expect(updatedModelList[1]).toEqual(invalidEntry);
            expect(updatedModelList[2]).toEqual(invalidEntry);
            expect(updatedModelList[6]).toEqual(invalidEntry);
            expect(updatedModelList[7]).toEqual(invalidEntry);
            expect(updatedModelList[8]).toEqual(invalidEntry);
        });
    });
    describe('hasInvalidValues', () => {
        test('should return false when there are no invalid models', () => {
            expect(utils_1.hasInvalidValues(modelList)).toBeFalsy();
        });
        test('should return true when there is an invalid model', () => {
            modelList[1].isInvalid = true;
            expect(utils_1.hasInvalidValues(modelList)).toBeTruthy();
        });
    });
    describe('parse', () => {
        test('should return a number', () => {
            expect(utils_1.parse('3')).toBe(3);
        });
        test('should return an empty string when value is invalid', () => {
            expect(utils_1.parse('')).toBe('');
            expect(utils_1.parse('test')).toBe('');
            expect(utils_1.parse('NaN')).toBe('');
        });
    });
    describe('validateValue', () => {
        test('should return valid', () => {
            expect(utils_1.validateValue(3, range)).toEqual({ isInvalid: false });
        });
        test('should return invalid', () => {
            range.within = jest.fn(() => false);
            expect(utils_1.validateValue(11, range)).toEqual({ isInvalid: true, error: expect.any(String) });
        });
    });
    describe('getNextModel', () => {
        test('should return 3 as next value', () => {
            expect(utils_1.getNextModel(modelList, range)).toEqual({
                value: 3,
                id: expect.any(String),
                isInvalid: false,
            });
        });
        test('should return 1 as next value', () => {
            expect(utils_1.getNextModel([{ value: '', id: '2', isInvalid: false }], range)).toEqual({
                value: 1,
                id: expect.any(String),
                isInvalid: false,
            });
        });
        test('should return 9 as next value', () => {
            expect(utils_1.getNextModel([{ value: 11, id: '2', isInvalid: false }], range)).toEqual({
                value: 9,
                id: expect.any(String),
                isInvalid: false,
            });
        });
    });
    describe('getRange', () => {
        test('should return default range', () => {
            expect(utils_1.getRange()).toEqual({
                min: 0,
                max: Infinity,
                maxInclusive: false,
                minInclusive: true,
            });
        });
        test('should return parsed range', () => {
            expect(utils_1.getRange('(-Infinity, 100]')).toEqual({
                min: -Infinity,
                max: 100,
                maxInclusive: true,
                minInclusive: false,
            });
        });
        test('should throw an error', () => {
            expect(() => utils_1.getRange('test')).toThrowError();
        });
    });
});
