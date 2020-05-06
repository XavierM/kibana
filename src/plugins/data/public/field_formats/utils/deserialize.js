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
const date_range_1 = require("../../search/aggs/buckets/lib/date_range");
const ip_range_1 = require("../../search/aggs/buckets/lib/ip_range");
const common_1 = require("../../../common");
const services_1 = require("../../../public/services");
function isTermsFieldFormat(serializedFieldFormat) {
    return serializedFieldFormat.id === 'terms';
}
const getConfig = (key, defaultOverride) => services_1.getUiSettings().get(key, defaultOverride);
const DefaultFieldFormat = common_1.FieldFormat.from(lodash_1.identity);
const getFieldFormat = (fieldFormatsService, id, params = {}) => {
    if (id) {
        const Format = fieldFormatsService.getType(id);
        if (Format) {
            return new Format(params, getConfig);
        }
    }
    return new DefaultFieldFormat();
};
exports.deserializeFieldFormat = function (mapping) {
    if (!mapping) {
        return new DefaultFieldFormat();
    }
    const { id } = mapping;
    if (id === 'range') {
        const RangeFormat = common_1.FieldFormat.from((range) => {
            const nestedFormatter = mapping.params;
            const format = getFieldFormat(this, nestedFormatter.id, nestedFormatter.params);
            const gte = '\u2265';
            const lt = '\u003c';
            return i18n_1.i18n.translate('data.aggTypes.buckets.ranges.rangesFormatMessage', {
                defaultMessage: '{gte} {from} and {lt} {to}',
                values: {
                    gte,
                    from: format.convert(range.gte),
                    lt,
                    to: format.convert(range.lt),
                },
            });
        });
        return new RangeFormat();
    }
    else if (id === 'date_range') {
        const nestedFormatter = mapping.params;
        const DateRangeFormat = common_1.FieldFormat.from((range) => {
            const format = getFieldFormat(this, nestedFormatter.id, nestedFormatter.params);
            return date_range_1.convertDateRangeToString(range, format.convert.bind(format));
        });
        return new DateRangeFormat();
    }
    else if (id === 'ip_range') {
        const nestedFormatter = mapping.params;
        const IpRangeFormat = common_1.FieldFormat.from((range) => {
            const format = getFieldFormat(this, nestedFormatter.id, nestedFormatter.params);
            return ip_range_1.convertIPRangeToString(range, format.convert.bind(format));
        });
        return new IpRangeFormat();
    }
    else if (isTermsFieldFormat(mapping) && mapping.params) {
        const { params } = mapping;
        const convert = (val, type) => {
            const format = getFieldFormat(this, params.id, mapping.params);
            if (val === '__other__') {
                return params.otherBucketLabel;
            }
            if (val === '__missing__') {
                return params.missingBucketLabel;
            }
            return format.convert(val, type);
        };
        return {
            convert,
            getConverterFor: (type) => (val) => convert(val, type),
        };
    }
    else {
        return getFieldFormat(this, id, mapping.params);
    }
};
