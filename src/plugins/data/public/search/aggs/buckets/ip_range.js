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
const i18n_1 = require("@kbn/i18n");
const bucket_agg_type_1 = require("./bucket_agg_type");
const bucket_agg_types_1 = require("./bucket_agg_types");
const ip_range_1 = require("./create_filter/ip_range");
const ip_range_2 = require("./lib/ip_range");
const common_1 = require("../../../../common");
const ipRangeTitle = i18n_1.i18n.translate('data.search.aggs.buckets.ipRangeTitle', {
    defaultMessage: 'IPv4 Range',
});
exports.getIpRangeBucketAgg = ({ getInternalStartServices }) => new bucket_agg_type_1.BucketAggType({
    name: bucket_agg_types_1.BUCKET_TYPES.IP_RANGE,
    title: ipRangeTitle,
    createFilter: ip_range_1.createFilterIpRange,
    getKey(bucket, key, agg) {
        if (agg.params.ipRangeType === 'mask') {
            return { type: 'mask', mask: key };
        }
        return { type: 'range', from: bucket.from, to: bucket.to };
    },
    getFormat(agg) {
        const { fieldFormats } = getInternalStartServices();
        const formatter = agg.fieldOwnFormatter(common_1.TEXT_CONTEXT_TYPE, fieldFormats.getDefaultInstance(common_1.KBN_FIELD_TYPES.IP));
        const IpRangeFormat = common_1.FieldFormat.from(function (range) {
            return ip_range_2.convertIPRangeToString(range, formatter);
        });
        return new IpRangeFormat();
    },
    makeLabel(aggConfig) {
        return i18n_1.i18n.translate('data.search.aggs.buckets.ipRangeLabel', {
            defaultMessage: '{fieldName} IP ranges',
            values: {
                fieldName: aggConfig.getFieldDisplayName(),
            },
        });
    },
    params: [
        {
            name: 'field',
            type: 'field',
            filterFieldTypes: common_1.KBN_FIELD_TYPES.IP,
        },
        {
            name: 'ipRangeType',
            default: 'fromTo',
            write: lodash_1.noop,
        },
        {
            name: 'ranges',
            default: {
                fromTo: [
                    { from: '0.0.0.0', to: '127.255.255.255' },
                    { from: '128.0.0.0', to: '191.255.255.255' },
                ],
                mask: [{ mask: '0.0.0.0/1' }, { mask: '128.0.0.0/2' }],
            },
            write(aggConfig, output) {
                const ipRangeType = aggConfig.params.ipRangeType;
                let ranges = aggConfig.params.ranges[ipRangeType];
                if (ipRangeType === 'fromTo') {
                    ranges = lodash_1.map(ranges, (range) => lodash_1.omit(range, lodash_1.isNull));
                }
                output.params.ranges = ranges;
            },
        },
    ],
}, { getInternalStartServices });
