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
const lodash_1 = require("lodash");
exports.buildPointSeriesData = (table, dimensions) => {
    const { x, y } = dimensions;
    const xAccessor = table.columns[x.accessor].id;
    const yAccessor = table.columns[y.accessor].id;
    const chart = {};
    chart.xAxisOrderedValues = lodash_1.uniq(table.rows.map(r => r[xAccessor]));
    chart.xAxisFormat = x.format;
    chart.xAxisLabel = table.columns[x.accessor].name;
    const { intervalESUnit, intervalESValue, interval, bounds } = x.params;
    chart.ordered = {
        date: true,
        interval,
        intervalESUnit,
        intervalESValue,
        min: bounds.min,
        max: bounds.max,
    };
    chart.yAxisLabel = table.columns[y.accessor].name;
    chart.values = table.rows
        .filter(row => row && row[yAccessor] !== 'NaN')
        .map(row => ({
        x: row[xAccessor],
        y: row[yAccessor],
    }));
    return chart;
};
