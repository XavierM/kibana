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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const react_hooks_1 = require("@testing-library/react-hooks");
const eui_charts_theme_1 = require("@elastic/eui/dist/eui_charts_theme");
const theme_1 = require("./theme");
const mocks_1 = require("../../../../../core/public/mocks");
const { uiSettings: setupMockUiSettings } = mocks_1.coreMock.createSetup();
describe('ThemeService', () => {
    describe('chartsTheme$', () => {
        it('should throw error if service has not been initialized', () => {
            const themeService = new theme_1.ThemeService();
            expect(() => themeService.chartsTheme$).toThrowError();
        });
        it('returns the light theme when not in dark mode', async () => {
            setupMockUiSettings.get$.mockReturnValue(new rxjs_1.BehaviorSubject(false));
            const themeService = new theme_1.ThemeService();
            themeService.init(setupMockUiSettings);
            expect(await themeService.chartsTheme$.pipe(operators_1.take(1)).toPromise()).toEqual(eui_charts_theme_1.EUI_CHARTS_THEME_LIGHT.theme);
        });
        describe('in dark mode', () => {
            it(`returns the dark theme`, async () => {
                // Fake dark theme turned returning true
                setupMockUiSettings.get$.mockReturnValue(new rxjs_1.BehaviorSubject(true));
                const themeService = new theme_1.ThemeService();
                themeService.init(setupMockUiSettings);
                expect(await themeService.chartsTheme$.pipe(operators_1.take(1)).toPromise()).toEqual(eui_charts_theme_1.EUI_CHARTS_THEME_DARK.theme);
            });
        });
    });
    describe('useChartsTheme', () => {
        it('updates when the uiSettings change', () => {
            const darkMode$ = new rxjs_1.BehaviorSubject(false);
            setupMockUiSettings.get$.mockReturnValue(darkMode$);
            const themeService = new theme_1.ThemeService();
            themeService.init(setupMockUiSettings);
            const { useChartsTheme } = themeService;
            const { result } = react_hooks_1.renderHook(() => useChartsTheme());
            expect(result.current).toBe(eui_charts_theme_1.EUI_CHARTS_THEME_LIGHT.theme);
            react_hooks_1.act(() => darkMode$.next(true));
            expect(result.current).toBe(eui_charts_theme_1.EUI_CHARTS_THEME_DARK.theme);
            react_hooks_1.act(() => darkMode$.next(false));
            expect(result.current).toBe(eui_charts_theme_1.EUI_CHARTS_THEME_LIGHT.theme);
        });
    });
});
