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
const filter_manager_1 = require("./filter_manager");
const public_1 = require("../../../../data/public");
// Convert slider value into ES range filter
function toRange(sliderValue) {
    return {
        gte: sliderValue.min,
        lte: sliderValue.max,
    };
}
// Convert ES range filter into slider value
function fromRange(range) {
    const sliderValue = {};
    if (lodash_1.default.has(range, 'gte')) {
        sliderValue.min = lodash_1.default.get(range, 'gte');
    }
    if (lodash_1.default.has(range, 'gt')) {
        sliderValue.min = lodash_1.default.get(range, 'gt');
    }
    if (lodash_1.default.has(range, 'lte')) {
        sliderValue.max = lodash_1.default.get(range, 'lte');
    }
    if (lodash_1.default.has(range, 'lt')) {
        sliderValue.max = lodash_1.default.get(range, 'lt');
    }
    return sliderValue;
}
class RangeFilterManager extends filter_manager_1.FilterManager {
    /**
     * Convert slider value into filter
     *
     * @param {object} react-input-range value - POJO with `min` and `max` properties
     * @return {object} range filter
     */
    createFilter(value) {
        const newFilter = public_1.esFilters.buildRangeFilter(
        // TODO: Fix type to be required
        this.indexPattern.fields.getByName(this.fieldName), toRange(value), this.indexPattern);
        newFilter.meta.key = this.fieldName;
        newFilter.meta.controlledBy = this.controlId;
        return newFilter;
    }
    getValueFromFilterBar() {
        const kbnFilters = this.findFilters();
        if (kbnFilters.length === 0) {
            return;
        }
        let range;
        if (lodash_1.default.has(kbnFilters[0], 'script')) {
            range = lodash_1.default.get(kbnFilters[0], 'script.script.params');
        }
        else {
            range = lodash_1.default.get(kbnFilters[0], ['range', this.fieldName]);
        }
        if (!range) {
            return;
        }
        return fromRange(range);
    }
}
exports.RangeFilterManager = RangeFilterManager;
