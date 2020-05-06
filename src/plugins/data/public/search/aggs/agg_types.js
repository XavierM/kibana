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
const count_1 = require("./metrics/count");
const avg_1 = require("./metrics/avg");
const sum_1 = require("./metrics/sum");
const median_1 = require("./metrics/median");
const min_1 = require("./metrics/min");
const max_1 = require("./metrics/max");
const top_hit_1 = require("./metrics/top_hit");
const std_deviation_1 = require("./metrics/std_deviation");
const cardinality_1 = require("./metrics/cardinality");
const percentiles_1 = require("./metrics/percentiles");
const geo_bounds_1 = require("./metrics/geo_bounds");
const geo_centroid_1 = require("./metrics/geo_centroid");
const percentile_ranks_1 = require("./metrics/percentile_ranks");
const derivative_1 = require("./metrics/derivative");
const cumulative_sum_1 = require("./metrics/cumulative_sum");
const moving_avg_1 = require("./metrics/moving_avg");
const serial_diff_1 = require("./metrics/serial_diff");
const date_histogram_1 = require("./buckets/date_histogram");
const histogram_1 = require("./buckets/histogram");
const range_1 = require("./buckets/range");
const date_range_1 = require("./buckets/date_range");
const ip_range_1 = require("./buckets/ip_range");
const terms_1 = require("./buckets/terms");
const filter_1 = require("./buckets/filter");
const filters_1 = require("./buckets/filters");
const significant_terms_1 = require("./buckets/significant_terms");
const geo_hash_1 = require("./buckets/geo_hash");
const geo_tile_1 = require("./buckets/geo_tile");
const bucket_sum_1 = require("./metrics/bucket_sum");
const bucket_avg_1 = require("./metrics/bucket_avg");
const bucket_min_1 = require("./metrics/bucket_min");
const bucket_max_1 = require("./metrics/bucket_max");
exports.getAggTypes = ({ uiSettings, query, getInternalStartServices, }) => ({
    metrics: [
        count_1.getCountMetricAgg({ getInternalStartServices }),
        avg_1.getAvgMetricAgg({ getInternalStartServices }),
        sum_1.getSumMetricAgg({ getInternalStartServices }),
        median_1.getMedianMetricAgg({ getInternalStartServices }),
        min_1.getMinMetricAgg({ getInternalStartServices }),
        max_1.getMaxMetricAgg({ getInternalStartServices }),
        std_deviation_1.getStdDeviationMetricAgg({ getInternalStartServices }),
        cardinality_1.getCardinalityMetricAgg({ getInternalStartServices }),
        percentiles_1.getPercentilesMetricAgg({ getInternalStartServices }),
        percentile_ranks_1.getPercentileRanksMetricAgg({ getInternalStartServices }),
        top_hit_1.getTopHitMetricAgg({ getInternalStartServices }),
        derivative_1.getDerivativeMetricAgg({ getInternalStartServices }),
        cumulative_sum_1.getCumulativeSumMetricAgg({ getInternalStartServices }),
        moving_avg_1.getMovingAvgMetricAgg({ getInternalStartServices }),
        serial_diff_1.getSerialDiffMetricAgg({ getInternalStartServices }),
        bucket_avg_1.getBucketAvgMetricAgg({ getInternalStartServices }),
        bucket_sum_1.getBucketSumMetricAgg({ getInternalStartServices }),
        bucket_min_1.getBucketMinMetricAgg({ getInternalStartServices }),
        bucket_max_1.getBucketMaxMetricAgg({ getInternalStartServices }),
        geo_bounds_1.getGeoBoundsMetricAgg({ getInternalStartServices }),
        geo_centroid_1.getGeoCentroidMetricAgg({ getInternalStartServices }),
    ],
    buckets: [
        date_histogram_1.getDateHistogramBucketAgg({ uiSettings, query, getInternalStartServices }),
        histogram_1.getHistogramBucketAgg({ uiSettings, getInternalStartServices }),
        range_1.getRangeBucketAgg({ getInternalStartServices }),
        date_range_1.getDateRangeBucketAgg({ uiSettings, getInternalStartServices }),
        ip_range_1.getIpRangeBucketAgg({ getInternalStartServices }),
        terms_1.getTermsBucketAgg({ getInternalStartServices }),
        filter_1.getFilterBucketAgg({ getInternalStartServices }),
        filters_1.getFiltersBucketAgg({ uiSettings, getInternalStartServices }),
        significant_terms_1.getSignificantTermsBucketAgg({ getInternalStartServices }),
        geo_hash_1.getGeoHashBucketAgg({ getInternalStartServices }),
        geo_tile_1.getGeoTitleBucketAgg({ getInternalStartServices }),
    ],
});
const terms_fn_1 = require("./buckets/terms_fn");
exports.getAggTypesFunctions = () => [terms_fn_1.aggTerms];
