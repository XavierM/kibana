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
const joi_1 = tslib_1.__importDefault(require("joi"));
const stringOptionalNullable = joi_1.default.string()
    .allow('', null)
    .optional();
const stringRequired = joi_1.default.string()
    .allow('')
    .required();
const arrayNullable = joi_1.default.array().allow(null);
const numberIntegerOptional = joi_1.default.number()
    .integer()
    .optional();
const numberIntegerRequired = joi_1.default.number()
    .integer()
    .required();
const numberOptional = joi_1.default.number().optional();
const queryObject = joi_1.default.object({
    language: joi_1.default.string().allow(''),
    query: joi_1.default.string().allow(''),
});
const stringOrNumberOptionalNullable = joi_1.default.alternatives([stringOptionalNullable, numberOptional]);
const numberOptionalOrEmptyString = joi_1.default.alternatives(numberOptional, joi_1.default.string().valid(''));
const annotationsItems = joi_1.default.object({
    color: stringOptionalNullable,
    fields: stringOptionalNullable,
    hidden: joi_1.default.boolean().optional(),
    icon: stringOptionalNullable,
    id: stringOptionalNullable,
    ignore_global_filters: numberIntegerOptional,
    ignore_panel_filters: numberIntegerOptional,
    index_pattern: stringOptionalNullable,
    query_string: queryObject.optional(),
    template: stringOptionalNullable,
    time_field: stringOptionalNullable,
});
const backgroundColorRulesItems = joi_1.default.object({
    value: joi_1.default.number()
        .allow(null)
        .optional(),
    id: stringOptionalNullable,
    background_color: stringOptionalNullable,
    color: stringOptionalNullable,
});
const gaugeColorRulesItems = joi_1.default.object({
    gauge: stringOptionalNullable,
    text: stringOptionalNullable,
    id: stringOptionalNullable,
    operator: stringOptionalNullable,
    value: joi_1.default.number(),
});
const metricsItems = joi_1.default.object({
    field: stringOptionalNullable,
    id: stringRequired,
    metric_agg: stringOptionalNullable,
    numerator: stringOptionalNullable,
    denominator: stringOptionalNullable,
    sigma: stringOptionalNullable,
    unit: stringOptionalNullable,
    model_type: stringOptionalNullable,
    mode: stringOptionalNullable,
    lag: numberOptionalOrEmptyString,
    alpha: numberOptional,
    beta: numberOptional,
    gamma: numberOptional,
    period: numberOptional,
    multiplicative: joi_1.default.boolean(),
    window: numberOptional,
    function: stringOptionalNullable,
    script: stringOptionalNullable,
    variables: joi_1.default.array()
        .items(joi_1.default.object({
        field: stringOptionalNullable,
        id: stringRequired,
        name: stringOptionalNullable,
    }))
        .optional(),
    percentiles: joi_1.default.array()
        .items(joi_1.default.object({
        id: stringRequired,
        field: stringOptionalNullable,
        mode: joi_1.default.string().allow('line', 'band'),
        shade: joi_1.default.alternatives(numberOptional, stringOptionalNullable),
        value: joi_1.default.alternatives(numberOptional, stringOptionalNullable),
        percentile: stringOptionalNullable,
    }))
        .optional(),
    type: stringRequired,
    value: stringOptionalNullable,
    values: joi_1.default.array()
        .items(joi_1.default.string().allow('', null))
        .allow(null)
        .optional(),
});
const splitFiltersItems = joi_1.default.object({
    id: stringOptionalNullable,
    color: stringOptionalNullable,
    filter: joi_1.default.object({
        language: joi_1.default.string().allow(''),
        query: joi_1.default.string().allow(''),
    }).optional(),
    label: stringOptionalNullable,
});
const seriesItems = joi_1.default.object({
    aggregate_by: stringOptionalNullable,
    aggregate_function: stringOptionalNullable,
    axis_position: stringRequired,
    axis_max: stringOrNumberOptionalNullable,
    axis_min: stringOrNumberOptionalNullable,
    chart_type: stringRequired,
    color: stringRequired,
    color_rules: joi_1.default.array()
        .items(joi_1.default.object({
        value: numberOptional,
        id: stringRequired,
        text: stringOptionalNullable,
        operator: stringOptionalNullable,
    }))
        .optional(),
    fill: numberOptionalOrEmptyString,
    filter: joi_1.default.alternatives(joi_1.default.object({
        query: stringRequired,
        language: stringOptionalNullable,
    }).optional(), joi_1.default.string().valid('')),
    formatter: stringRequired,
    hide_in_legend: numberIntegerOptional,
    hidden: joi_1.default.boolean().optional(),
    id: stringRequired,
    label: stringOptionalNullable,
    line_width: numberOptionalOrEmptyString,
    metrics: joi_1.default.array().items(metricsItems),
    offset_time: stringOptionalNullable,
    override_index_pattern: numberOptional,
    point_size: numberOptionalOrEmptyString,
    separate_axis: numberIntegerOptional,
    seperate_axis: numberIntegerOptional,
    series_index_pattern: stringOptionalNullable,
    series_time_field: stringOptionalNullable,
    series_interval: stringOptionalNullable,
    series_drop_last_bucket: numberIntegerOptional,
    split_color_mode: stringOptionalNullable,
    split_filters: joi_1.default.array()
        .items(splitFiltersItems)
        .optional(),
    split_mode: stringRequired,
    stacked: stringRequired,
    steps: numberIntegerOptional,
    terms_field: stringOptionalNullable,
    terms_order_by: stringOptionalNullable,
    terms_size: stringOptionalNullable,
    terms_direction: stringOptionalNullable,
    terms_include: stringOptionalNullable,
    terms_exclude: stringOptionalNullable,
    time_range_mode: stringOptionalNullable,
    trend_arrows: numberOptional,
    type: stringOptionalNullable,
    value_template: stringOptionalNullable,
    var_name: stringOptionalNullable,
});
exports.visPayloadSchema = joi_1.default.object({
    filters: arrayNullable,
    panels: joi_1.default.array().items(joi_1.default.object({
        annotations: joi_1.default.array()
            .items(annotationsItems)
            .optional(),
        axis_formatter: stringRequired,
        axis_position: stringRequired,
        axis_scale: stringRequired,
        axis_min: stringOrNumberOptionalNullable,
        axis_max: stringOrNumberOptionalNullable,
        bar_color_rules: arrayNullable.optional(),
        background_color: stringOptionalNullable,
        background_color_rules: joi_1.default.array()
            .items(backgroundColorRulesItems)
            .optional(),
        default_index_pattern: stringOptionalNullable,
        default_timefield: stringOptionalNullable,
        drilldown_url: stringOptionalNullable,
        drop_last_bucket: numberIntegerOptional,
        filter: joi_1.default.alternatives(stringOptionalNullable, joi_1.default.object({
            language: stringOptionalNullable,
            query: stringOptionalNullable,
        })),
        gauge_color_rules: joi_1.default.array()
            .items(gaugeColorRulesItems)
            .optional(),
        gauge_width: [stringOptionalNullable, numberOptional],
        gauge_inner_color: stringOptionalNullable,
        gauge_inner_width: stringOrNumberOptionalNullable,
        gauge_style: stringOptionalNullable,
        gauge_max: stringOrNumberOptionalNullable,
        id: stringRequired,
        ignore_global_filters: numberOptional,
        ignore_global_filter: numberOptional,
        index_pattern: stringRequired,
        interval: stringRequired,
        isModelInvalid: joi_1.default.boolean().optional(),
        legend_position: stringOptionalNullable,
        markdown: stringOptionalNullable,
        markdown_scrollbars: numberIntegerOptional,
        markdown_openLinksInNewTab: numberIntegerOptional,
        markdown_vertical_align: stringOptionalNullable,
        markdown_less: stringOptionalNullable,
        markdown_css: stringOptionalNullable,
        pivot_id: stringOptionalNullable,
        pivot_label: stringOptionalNullable,
        pivot_type: stringOptionalNullable,
        pivot_rows: stringOptionalNullable,
        series: joi_1.default.array()
            .items(seriesItems)
            .required(),
        show_grid: numberIntegerRequired,
        show_legend: numberIntegerRequired,
        time_field: stringOptionalNullable,
        time_range_mode: stringOptionalNullable,
        type: stringRequired,
    })),
    // general
    query: joi_1.default.array()
        .items(queryObject)
        .allow(null)
        .required(),
    state: joi_1.default.object({
        sort: joi_1.default.object({
            column: stringRequired,
            order: joi_1.default.string()
                .valid(['asc', 'desc'])
                .required(),
        }).optional(),
    }).required(),
    savedObjectId: joi_1.default.string().optional(),
    timerange: joi_1.default.object({
        timezone: stringRequired,
        min: stringRequired,
        max: stringRequired,
    }).required(),
});
