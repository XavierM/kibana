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
const _get_series_1 = require("./_get_series");
const _get_aspects_1 = require("./_get_aspects");
const _init_y_axis_1 = require("./_init_y_axis");
const _init_x_axis_1 = require("./_init_x_axis");
const _ordered_date_axis_1 = require("./_ordered_date_axis");
exports.buildPointSeriesData = (table, dimensions) => {
    const chart = {
        aspects: _get_aspects_1.getAspects(table, dimensions),
    };
    _init_x_axis_1.initXAxis(chart, table);
    _init_y_axis_1.initYAxis(chart);
    if ('date' in chart.aspects.x[0].params) {
        // initXAxis will turn `chart` into an `OrderedChart if it is a date axis`
        _ordered_date_axis_1.orderedDateAxis(chart);
    }
    chart.series = _get_series_1.getSeries(table, chart);
    delete chart.aspects;
    return chart;
};
