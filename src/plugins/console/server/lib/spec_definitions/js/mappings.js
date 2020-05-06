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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const shared_1 = require("./shared");
/* eslint-disable @typescript-eslint/camelcase */
exports.mappings = (specService) => {
    specService.addEndpointDescription('put_mapping', {
        priority: 10,
        data_autocomplete_rules: {
            __template: {
                properties: {
                    FIELD: {},
                },
            },
            _source: {
                enabled: shared_1.BOOLEAN,
            },
            _all: {
                enabled: shared_1.BOOLEAN,
            },
            _field_names: {
                index: shared_1.BOOLEAN,
            },
            _routing: {
                required: shared_1.BOOLEAN,
            },
            _index: {
                enabled: shared_1.BOOLEAN,
            },
            _parent: {
                __template: {
                    type: '',
                },
                type: '{type}',
            },
            _timestamp: {
                enabled: shared_1.BOOLEAN,
                format: 'YYYY-MM-dd',
                default: '',
            },
            dynamic_date_formats: ['yyyy-MM-dd'],
            date_detection: shared_1.BOOLEAN,
            numeric_detection: shared_1.BOOLEAN,
            properties: {
                '*': {
                    type: {
                        __one_of: [
                            'text',
                            'keyword',
                            'float',
                            'half_float',
                            'scaled_float',
                            'double',
                            'byte',
                            'short',
                            'integer',
                            'long',
                            'date',
                            'boolean',
                            'binary',
                            'object',
                            'nested',
                            'geo_point',
                            'geo_shape',
                        ],
                    },
                    // strings
                    store: shared_1.BOOLEAN,
                    index: shared_1.BOOLEAN,
                    term_vector: {
                        __one_of: ['no', 'yes', 'with_offsets', 'with_positions', 'with_positions_offsets'],
                    },
                    boost: 1.0,
                    null_value: '',
                    doc_values: shared_1.BOOLEAN,
                    eager_global_ordinals: shared_1.BOOLEAN,
                    norms: shared_1.BOOLEAN,
                    coerce: shared_1.BOOLEAN,
                    // Not actually available in V6 of ES. Add when updating the autocompletion system.
                    // index_phrases: BOOLEAN,
                    // index_prefixes: { min_chars, max_chars },
                    index_options: {
                        __one_of: ['docs', 'freqs', 'positions'],
                    },
                    analyzer: 'standard',
                    search_analyzer: 'standard',
                    include_in_all: {
                        __one_of: [false, true],
                    },
                    ignore_above: 10,
                    position_increment_gap: 0,
                    // numeric
                    precision_step: 4,
                    ignore_malformed: shared_1.BOOLEAN,
                    scaling_factor: 100,
                    // geo_point
                    lat_lon: {
                        __one_of: [true, false],
                    },
                    geohash: {
                        __one_of: [true, false],
                    },
                    geohash_precision: '1m',
                    geohash_prefix: {
                        __one_of: [true, false],
                    },
                    validate: {
                        __one_of: [true, false],
                    },
                    validate_lat: {
                        __one_of: [true, false],
                    },
                    validate_lon: {
                        __one_of: [true, false],
                    },
                    normalize: {
                        __one_of: [true, false],
                    },
                    normalize_lat: {
                        __one_of: [true, false],
                    },
                    normalize_lon: {
                        __one_of: [true, false],
                    },
                    // geo_shape
                    tree: {
                        __one_of: ['geohash', 'quadtree'],
                    },
                    precision: '5km',
                    tree_levels: 12,
                    distance_error_pct: 0.025,
                    orientation: 'ccw',
                    // dates
                    format: {
                        __one_of: lodash_1.default.flatten([
                            lodash_1.default.map([
                                'date',
                                'date_time',
                                'date_time_no_millis',
                                'ordinal_date',
                                'ordinal_date_time',
                                'ordinal_date_time_no_millis',
                                'time',
                                'time_no_millis',
                                't_time',
                                't_time_no_millis',
                                'week_date',
                                'week_date_time',
                                'week_date_time_no_millis',
                            ], function (s) {
                                return ['basic_' + s, 'strict_' + s];
                            }),
                            [
                                'date',
                                'date_hour',
                                'date_hour_minute',
                                'date_hour_minute_second',
                                'date_hour_minute_second_fraction',
                                'date_hour_minute_second_millis',
                                'date_optional_time',
                                'date_time',
                                'date_time_no_millis',
                                'hour',
                                'hour_minute',
                                'hour_minute_second',
                                'hour_minute_second_fraction',
                                'hour_minute_second_millis',
                                'ordinal_date',
                                'ordinal_date_time',
                                'ordinal_date_time_no_millis',
                                'time',
                                'time_no_millis',
                                't_time',
                                't_time_no_millis',
                                'week_date',
                                'week_date_time',
                                'weekDateTimeNoMillis',
                                'week_year',
                                'weekyearWeek',
                                'weekyearWeekDay',
                                'year',
                                'year_month',
                                'year_month_day',
                                'epoch_millis',
                                'epoch_second',
                            ],
                        ]),
                    },
                    fielddata: {
                        filter: {
                            regex: '',
                            frequency: {
                                min: 0.001,
                                max: 0.1,
                                min_segment_size: 500,
                            },
                        },
                    },
                    similarity: {
                        __one_of: ['default', 'BM25'],
                    },
                    // objects
                    properties: {
                        __scope_link: 'put_mapping.{type}.properties',
                    },
                    // multi_field
                    fields: {
                        '*': {
                            __scope_link: 'put_mapping.type.properties.field',
                        },
                    },
                    copy_to: { __one_of: ['{field}', ['{field}']] },
                    // nested
                    include_in_parent: shared_1.BOOLEAN,
                    include_in_root: shared_1.BOOLEAN,
                },
            },
        },
    });
};
