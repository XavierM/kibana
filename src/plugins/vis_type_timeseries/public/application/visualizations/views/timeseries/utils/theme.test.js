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
const theme_1 = require("./theme");
const charts_1 = require("@elastic/charts");
describe('TSVB theme', () => {
    it('should return the basic themes if no bg color is specified', () => {
        // use original dark/light theme
        expect(theme_1.getTheme(false)).toEqual(charts_1.LIGHT_THEME);
        expect(theme_1.getTheme(true)).toEqual(charts_1.DARK_THEME);
        // discard any wrong/missing bg color
        expect(theme_1.getTheme(true, null)).toEqual(charts_1.DARK_THEME);
        expect(theme_1.getTheme(true, '')).toEqual(charts_1.DARK_THEME);
        expect(theme_1.getTheme(true, undefined)).toEqual(charts_1.DARK_THEME);
    });
    it('should return a highcontrast color theme for a different background', () => {
        // red use a near full-black color
        expect(theme_1.getTheme(false, 'red').axes.axisTitleStyle.fill).toEqual('rgb(23,23,23)');
        // violet increased the text color to full white for higer contrast
        expect(theme_1.getTheme(false, '#ba26ff').axes.axisTitleStyle.fill).toEqual('rgb(255,255,255)');
        // light yellow, prefer the LIGHT_THEME fill color because already with a good contrast
        expect(theme_1.getTheme(false, '#fff49f').axes.axisTitleStyle.fill).toEqual('#333');
    });
});
