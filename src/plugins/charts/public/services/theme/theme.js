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
const react_1 = require("react");
const operators_1 = require("rxjs/operators");
const eui_charts_theme_1 = require("@elastic/eui/dist/eui_charts_theme");
class ThemeService {
    constructor() {
        /** Returns default charts theme */
        this.chartsDefaultTheme = eui_charts_theme_1.EUI_CHARTS_THEME_LIGHT.theme;
        /** A React hook for consuming the charts theme */
        this.useChartsTheme = () => {
            const [value, update] = react_1.useState(this.chartsDefaultTheme);
            react_1.useEffect(() => {
                const s = this.chartsTheme$.subscribe(update);
                return () => s.unsubscribe();
            }, []);
            return value;
        };
    }
    /** An observable of the current charts theme */
    get chartsTheme$() {
        if (!this._chartsTheme$) {
            throw new Error('ThemeService not initialized');
        }
        return this._chartsTheme$;
    }
    /** initialize service with uiSettings */
    init(uiSettings) {
        this._chartsTheme$ = uiSettings
            .get$('theme:darkMode')
            .pipe(operators_1.map(darkMode => (darkMode ? eui_charts_theme_1.EUI_CHARTS_THEME_DARK.theme : eui_charts_theme_1.EUI_CHARTS_THEME_LIGHT.theme)));
    }
}
exports.ThemeService = ThemeService;
