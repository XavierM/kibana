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
const i18n_1 = require("@kbn/i18n");
exports.intervalOptions = [
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.autoDisplayName', {
            defaultMessage: 'Auto',
        }),
        val: 'auto',
        enabled(agg) {
            // not only do we need a time field, but the selected field needs
            // to be the time field. (see #3028)
            return agg.fieldIsTimeField();
        },
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.millisecondDisplayName', {
            defaultMessage: 'Millisecond',
        }),
        val: 'ms',
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.secondDisplayName', {
            defaultMessage: 'Second',
        }),
        val: 's',
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.minuteDisplayName', {
            defaultMessage: 'Minute',
        }),
        val: 'm',
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.hourlyDisplayName', {
            defaultMessage: 'Hourly',
        }),
        val: 'h',
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.dailyDisplayName', {
            defaultMessage: 'Daily',
        }),
        val: 'd',
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.weeklyDisplayName', {
            defaultMessage: 'Weekly',
        }),
        val: 'w',
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.monthlyDisplayName', {
            defaultMessage: 'Monthly',
        }),
        val: 'M',
    },
    {
        display: i18n_1.i18n.translate('data.search.aggs.buckets.intervalOptions.yearlyDisplayName', {
            defaultMessage: 'Yearly',
        }),
        val: 'y',
    },
];
