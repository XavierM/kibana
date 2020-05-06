"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
// @ts-ignore
const color_1 = tslib_1.__importDefault(require("color"));
const charts_1 = require("@elastic/charts");
function computeRelativeLuminosity(rgb) {
    return color_1.default(rgb).luminosity();
}
function computeContrast(rgb1, rgb2) {
    return color_1.default(rgb1).contrast(color_1.default(rgb2));
}
function getAAARelativeLum(bgColor, fgColor, ratio = 7) {
    const relLum1 = computeRelativeLuminosity(bgColor);
    const relLum2 = computeRelativeLuminosity(fgColor);
    if (relLum1 > relLum2) {
        // relLum1 is brighter, relLum2 is darker
        return (relLum1 + 0.05 - ratio * 0.05) / ratio;
    }
    else {
        // relLum1 is darker, relLum2 is brighter
        return Math.min(ratio * (relLum1 + 0.05) - 0.05, 1);
    }
}
function getGrayFromRelLum(relLum) {
    if (relLum <= 0.0031308) {
        return relLum * 12.92;
    }
    else {
        return (1.0 + 0.055) * Math.pow(relLum, 1.0 / 2.4) - 0.055;
    }
}
function getGrayRGBfromGray(gray) {
    const g = Math.round(gray * 255);
    return `rgb(${g},${g},${g})`;
}
function getAAAGray(bgColor, fgColor, ratio = 7) {
    const relLum = getAAARelativeLum(bgColor, fgColor, ratio);
    const gray = getGrayFromRelLum(relLum);
    return getGrayRGBfromGray(gray);
}
function findBestContrastColor(bgColor, lightFgColor, darkFgColor, ratio = 4.5) {
    const lc = computeContrast(bgColor, lightFgColor);
    const dc = computeContrast(bgColor, darkFgColor);
    if (lc >= dc) {
        if (lc >= ratio) {
            return lightFgColor;
        }
        return getAAAGray(bgColor, lightFgColor, ratio);
    }
    if (dc >= ratio) {
        return darkFgColor;
    }
    return getAAAGray(bgColor, darkFgColor, ratio);
}
function isValidColor(color) {
    if (typeof color !== 'string') {
        return false;
    }
    if (color.length === 0) {
        return false;
    }
    try {
        color_1.default(color);
        return true;
    }
    catch {
        return false;
    }
}
function getTheme(darkMode, bgColor) {
    if (!isValidColor(bgColor)) {
        return darkMode ? charts_1.DARK_THEME : charts_1.LIGHT_THEME;
    }
    const bgLuminosity = computeRelativeLuminosity(bgColor);
    const mainTheme = bgLuminosity <= 0.179 ? charts_1.DARK_THEME : charts_1.LIGHT_THEME;
    const color = findBestContrastColor(bgColor, charts_1.LIGHT_THEME.axes.axisTitleStyle.fill, charts_1.DARK_THEME.axes.axisTitleStyle.fill);
    return {
        ...mainTheme,
        axes: {
            ...mainTheme.axes,
            axisTitleStyle: {
                ...mainTheme.axes.axisTitleStyle,
                fill: color,
            },
            tickLabelStyle: {
                ...mainTheme.axes.tickLabelStyle,
                fill: color,
            },
            axisLineStyle: {
                ...mainTheme.axes.axisLineStyle,
                stroke: color,
            },
            tickLineStyle: {
                ...mainTheme.axes.tickLineStyle,
                stroke: color,
            },
        },
    };
}
exports.getTheme = getTheme;
function getChartClasses(bgColor) {
    // keep the original theme color if no bg color is specified
    if (typeof bgColor !== 'string') {
        return;
    }
    const bgLuminosity = computeRelativeLuminosity(bgColor);
    return bgLuminosity <= 0.179 ? 'tvbVisTimeSeriesDark' : 'tvbVisTimeSeriesLight';
}
exports.getChartClasses = getChartClasses;
