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
const lodash_1 = require("lodash");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const lib_1 = require("../../common/lib");
const xaxis_formatter_1 = require("./xaxis_formatter");
const colors = [
    '#01A4A4',
    '#C66',
    '#D0D102',
    '#616161',
    '#00A1CB',
    '#32742C',
    '#F18D05',
    '#113F8C',
    '#61AE24',
    '#D70060',
];
exports.colors = colors;
const SERIES_ID_ATTR = 'data-series-id';
exports.SERIES_ID_ATTR = SERIES_ID_ATTR;
function buildSeriesData(chart, options) {
    const seriesData = chart.map((series, seriesIndex) => {
        const newSeries = lodash_1.cloneDeep(lodash_1.defaults(series, {
            shadowSize: 0,
            lines: {
                lineWidth: 3,
            },
        }));
        newSeries._id = seriesIndex;
        if (series.color) {
            const span = document.createElement('span');
            span.style.color = series.color;
            newSeries.color = span.style.color;
        }
        if (series._hide) {
            newSeries.data = [];
            newSeries.stack = false;
            newSeries.label = `(hidden) ${series.label}`;
        }
        if (series._global) {
            lodash_1.merge(options, series._global, (objVal, srcVal) => {
                // This is kind of gross, it means that you can't replace a global value with a null
                // best you can do is an empty string. Deal with it.
                if (objVal == null) {
                    return srcVal;
                }
                if (srcVal == null) {
                    return objVal;
                }
            });
        }
        return newSeries;
    });
    return lodash_1.compact(seriesData);
}
exports.buildSeriesData = buildSeriesData;
function buildOptions(intervalValue, timefilter, uiSettings, clientWidth = 0, showGrid) {
    // Get the X-axis tick format
    const time = timefilter.getBounds();
    const interval = lib_1.calculateInterval((time.min && time.min.valueOf()) || 0, (time.max && time.max.valueOf()) || 0, uiSettings.get('timelion:target_buckets') || 200, intervalValue, uiSettings.get('timelion:min_interval') || '1ms');
    const format = xaxis_formatter_1.xaxisFormatterProvider(uiSettings)(interval);
    const tickLetterWidth = 7;
    const tickPadding = 45;
    const options = {
        xaxis: {
            mode: 'time',
            tickLength: 5,
            timezone: 'browser',
            // Calculate how many ticks can fit on the axis
            ticks: Math.floor(clientWidth / (format.length * tickLetterWidth + tickPadding)),
            // Use moment to format ticks so we get timezone correction
            tickFormatter: (val) => moment_timezone_1.default(val).format(format),
        },
        selection: {
            mode: 'x',
            color: '#ccc',
        },
        crosshair: {
            mode: 'x',
            color: '#C66',
            lineWidth: 2,
        },
        colors,
        grid: {
            show: showGrid,
            borderWidth: 0,
            borderColor: null,
            margin: 10,
            hoverable: true,
            autoHighlight: false,
        },
        legend: {
            backgroundColor: 'rgb(255,255,255,0)',
            position: 'nw',
            labelBoxBorderColor: 'rgb(255,255,255,0)',
            labelFormatter(label, series) {
                const wrapperSpan = document.createElement('span');
                const labelSpan = document.createElement('span');
                const numberSpan = document.createElement('span');
                wrapperSpan.setAttribute('class', 'ngLegendValue');
                wrapperSpan.setAttribute(SERIES_ID_ATTR, `${series._id}`);
                labelSpan.appendChild(document.createTextNode(label));
                numberSpan.setAttribute('class', 'ngLegendValueNumber');
                wrapperSpan.appendChild(labelSpan);
                wrapperSpan.appendChild(numberSpan);
                return wrapperSpan.outerHTML;
            },
        },
    };
    return options;
}
exports.buildOptions = buildOptions;
