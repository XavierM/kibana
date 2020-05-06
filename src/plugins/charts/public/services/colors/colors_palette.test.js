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
const seed_colors_1 = require("./seed_colors");
const color_palette_1 = require("./color_palette");
describe('Color Palette', () => {
    const num1 = 45;
    const num2 = 72;
    const num3 = 90;
    const string = 'Welcome';
    const bool = true;
    const nullValue = null;
    const emptyArr = [];
    const emptyObject = {};
    let colorPalette;
    beforeEach(() => {
        colorPalette = color_palette_1.createColorPalette(num1);
    });
    it('should throw an error if input is not a number', () => {
        expect(() => {
            color_palette_1.createColorPalette(string);
        }).toThrowError();
        expect(() => {
            color_palette_1.createColorPalette(bool);
        }).toThrowError();
        expect(() => {
            color_palette_1.createColorPalette(nullValue);
        }).toThrowError();
        expect(() => {
            color_palette_1.createColorPalette(emptyArr);
        }).toThrowError();
        expect(() => {
            color_palette_1.createColorPalette(emptyObject);
        }).toThrowError();
        expect(() => {
            color_palette_1.createColorPalette();
        }).toThrowError();
    });
    it('should be a function', () => {
        expect(typeof color_palette_1.createColorPalette).toBe('function');
    });
    it('should return an array', () => {
        expect(colorPalette).toBeInstanceOf(Array);
    });
    it('should return an array of the same length as the input', () => {
        expect(colorPalette.length).toBe(num1);
    });
    it('should return the seed color array when input length is 72', () => {
        expect(color_palette_1.createColorPalette(num2)[71]).toBe(seed_colors_1.seedColors[71]);
    });
    it('should return an array of the same length as the input when input is greater than 72', () => {
        expect(color_palette_1.createColorPalette(num3).length).toBe(num3);
    });
    it('should create new darker colors when input is greater than 72', () => {
        expect(color_palette_1.createColorPalette(num3)[72]).not.toEqual(seed_colors_1.seedColors[0]);
    });
});
