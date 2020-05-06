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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const d3_1 = tslib_1.__importDefault(require("d3"));
const mocks_1 = require("../../../../../core/public/mocks");
const seed_colors_1 = require("./seed_colors");
const mapped_colors_1 = require("./mapped_colors");
// Local state for config
const config = new Map();
describe('Mapped Colors', () => {
    const mockUiSettings = mocks_1.coreMock.createSetup().uiSettings;
    mockUiSettings.get.mockImplementation(a => config.get(a));
    mockUiSettings.set.mockImplementation((...a) => config.set(...a));
    const mappedColors = new mapped_colors_1.MappedColors(mockUiSettings);
    let previousConfig;
    beforeEach(() => {
        previousConfig = config.get('visualization:colorMapping');
        mappedColors.purge();
    });
    afterEach(() => {
        config.set('visualization:colorMapping', previousConfig);
    });
    it('should properly map keys to unique colors', () => {
        config.set('visualization:colorMapping', {});
        const arr = [1, 2, 3, 4, 5];
        mappedColors.mapKeys(arr);
        expect(lodash_1.default(mappedColors.mapping)
            .values()
            .uniq()
            .size()).toBe(arr.length);
    });
    it('should not include colors used by the config', () => {
        const newConfig = { bar: seed_colors_1.seedColors[0] };
        config.set('visualization:colorMapping', newConfig);
        const arr = ['foo', 'baz', 'qux'];
        mappedColors.mapKeys(arr);
        const colorValues = lodash_1.default(mappedColors.mapping).values();
        expect(colorValues.contains(seed_colors_1.seedColors[0])).toBe(false);
        expect(colorValues.uniq().size()).toBe(arr.length);
    });
    it('should create a unique array of colors even when config is set', () => {
        const newConfig = { bar: seed_colors_1.seedColors[0] };
        config.set('visualization:colorMapping', newConfig);
        const arr = ['foo', 'bar', 'baz', 'qux'];
        mappedColors.mapKeys(arr);
        const expectedSize = lodash_1.default(arr)
            .difference(lodash_1.default.keys(newConfig))
            .size();
        expect(lodash_1.default(mappedColors.mapping)
            .values()
            .uniq()
            .size()).toBe(expectedSize);
        expect(mappedColors.get(arr[0])).not.toBe(seed_colors_1.seedColors[0]);
    });
    it('should treat different formats of colors as equal', () => {
        const color = d3_1.default.rgb(seed_colors_1.seedColors[0]);
        const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;
        const newConfig = { bar: rgb };
        config.set('visualization:colorMapping', newConfig);
        const arr = ['foo', 'bar', 'baz', 'qux'];
        mappedColors.mapKeys(arr);
        const expectedSize = lodash_1.default(arr)
            .difference(lodash_1.default.keys(newConfig))
            .size();
        expect(lodash_1.default(mappedColors.mapping)
            .values()
            .uniq()
            .size()).toBe(expectedSize);
        expect(mappedColors.get(arr[0])).not.toBe(seed_colors_1.seedColors[0]);
        expect(mappedColors.get('bar')).toBe(seed_colors_1.seedColors[0]);
    });
    it('should have a flush method that moves the current map to the old map', function () {
        const arr = [1, 2, 3, 4, 5];
        mappedColors.mapKeys(arr);
        expect(lodash_1.default.keys(mappedColors.mapping).length).toBe(5);
        expect(lodash_1.default.keys(mappedColors.oldMap).length).toBe(0);
        mappedColors.flush();
        expect(lodash_1.default.keys(mappedColors.oldMap).length).toBe(5);
        expect(lodash_1.default.keys(mappedColors.mapping).length).toBe(0);
        mappedColors.flush();
        expect(lodash_1.default.keys(mappedColors.oldMap).length).toBe(0);
        expect(lodash_1.default.keys(mappedColors.mapping).length).toBe(0);
    });
    it('should use colors in the oldMap if they are available', function () {
        const arr = [1, 2, 3, 4, 5];
        mappedColors.mapKeys(arr);
        expect(lodash_1.default.keys(mappedColors.mapping).length).toBe(5);
        expect(lodash_1.default.keys(mappedColors.oldMap).length).toBe(0);
        mappedColors.flush();
        mappedColors.mapKeys([3, 4, 5]);
        expect(lodash_1.default.keys(mappedColors.oldMap).length).toBe(5);
        expect(lodash_1.default.keys(mappedColors.mapping).length).toBe(3);
        expect(mappedColors.mapping[1]).toBe(undefined);
        expect(mappedColors.mapping[2]).toBe(undefined);
        expect(mappedColors.mapping[3]).toEqual(mappedColors.oldMap[3]);
        expect(mappedColors.mapping[4]).toEqual(mappedColors.oldMap[4]);
        expect(mappedColors.mapping[5]).toEqual(mappedColors.oldMap[5]);
    });
    it('should have a purge method that clears both maps', function () {
        const arr = [1, 2, 3, 4, 5];
        mappedColors.mapKeys(arr);
        mappedColors.flush();
        mappedColors.mapKeys(arr);
        expect(lodash_1.default.keys(mappedColors.mapping).length).toBe(5);
        expect(lodash_1.default.keys(mappedColors.oldMap).length).toBe(5);
        mappedColors.purge();
        expect(lodash_1.default.keys(mappedColors.mapping).length).toBe(0);
        expect(lodash_1.default.keys(mappedColors.oldMap).length).toBe(0);
    });
});
