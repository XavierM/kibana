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
const bucket_agg_type_1 = require("./bucket_agg_type");
const common_1 = require("../../../../common");
const range_key_1 = require("./range_key");
const range_1 = require("./create_filter/range");
const bucket_agg_types_1 = require("./bucket_agg_types");
const keyCaches = new WeakMap();
const formats = new WeakMap();
const rangeTitle = i18n_1.i18n.translate('data.search.aggs.buckets.rangeTitle', {
    defaultMessage: 'Range',
});
exports.getRangeBucketAgg = ({ getInternalStartServices }) => new bucket_agg_type_1.BucketAggType({
    name: bucket_agg_types_1.BUCKET_TYPES.RANGE,
    title: rangeTitle,
    createFilter: range_1.createFilterRange,
    makeLabel(aggConfig) {
        return i18n_1.i18n.translate('data.search.aggs.aggTypesLabel', {
            defaultMessage: '{fieldName} ranges',
            values: {
                fieldName: aggConfig.getFieldDisplayName(),
            },
        });
    },
    getKey(bucket, key, agg) {
        let keys = keyCaches.get(agg);
        if (!keys) {
            keys = new Map();
            keyCaches.set(agg, keys);
        }
        const id = range_key_1.RangeKey.idBucket(bucket);
        key = keys.get(id);
        if (!key) {
            key = new range_key_1.RangeKey(bucket);
            keys.set(id, key);
        }
        return key;
    },
    getFormat(agg) {
        let aggFormat = formats.get(agg);
        if (aggFormat)
            return aggFormat;
        const RangeFormat = common_1.FieldFormat.from((range) => {
            const format = agg.fieldOwnFormatter();
            const gte = '\u2265';
            const lt = '\u003c';
            return i18n_1.i18n.translate('data.search.aggs.aggTypes.rangesFormatMessage', {
                defaultMessage: '{gte} {from} and {lt} {to}',
                values: {
                    gte,
                    from: format(range.gte),
                    lt,
                    to: format(range.lt),
                },
            });
        });
        aggFormat = new RangeFormat();
        formats.set(agg, aggFormat);
        return aggFormat;
    },
    params: [
        {
            name: 'field',
            type: 'field',
            filterFieldTypes: [common_1.KBN_FIELD_TYPES.NUMBER],
        },
        {
            name: 'ranges',
            default: [
                { from: 0, to: 1000 },
                { from: 1000, to: 2000 },
            ],
            write(aggConfig, output) {
                output.params.ranges = aggConfig.params.ranges;
                output.params.keyed = true;
            },
        },
    ],
}, { getInternalStartServices });
