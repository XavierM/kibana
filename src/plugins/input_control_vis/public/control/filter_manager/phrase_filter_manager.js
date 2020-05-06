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
class PhraseFilterManager extends filter_manager_1.FilterManager {
    constructor(controlId, fieldName, indexPattern, queryFilter) {
        super(controlId, fieldName, indexPattern, queryFilter);
    }
    createFilter(phrases) {
        let newFilter;
        const value = this.indexPattern.fields.getByName(this.fieldName);
        if (!value) {
            throw new Error(`Unable to find field with name: ${this.fieldName} on indexPattern`);
        }
        if (phrases.length === 1) {
            newFilter = public_1.esFilters.buildPhraseFilter(value, phrases[0], this.indexPattern);
        }
        else {
            newFilter = public_1.esFilters.buildPhrasesFilter(value, phrases, this.indexPattern);
        }
        newFilter.meta.key = this.fieldName;
        newFilter.meta.controlledBy = this.controlId;
        return newFilter;
    }
    getValueFromFilterBar() {
        const kbnFilters = this.findFilters();
        if (kbnFilters.length === 0) {
            return;
        }
        const values = kbnFilters
            .map(kbnFilter => {
            return this.getValueFromFilter(kbnFilter);
        })
            .filter(value => value != null);
        if (values.length === 0) {
            return;
        }
        return values.reduce((accumulator, currentValue) => {
            return accumulator.concat(currentValue);
        }, []);
    }
    /**
     * Extract filtering value from kibana filters
     *
     * @param  {PhraseFilter} kbnFilter
     * @return {Array.<string>} array of values pulled from filter
     */
    getValueFromFilter(kbnFilter) {
        // bool filter - multiple phrase filters
        if (lodash_1.default.has(kbnFilter, 'query.bool.should')) {
            return lodash_1.default.get(kbnFilter, 'query.bool.should')
                .map(kbnQueryFilter => {
                return this.getValueFromFilter(kbnQueryFilter);
            })
                .filter(value => {
                if (value) {
                    return true;
                }
                return false;
            });
        }
        // scripted field filter
        if (lodash_1.default.has(kbnFilter, 'script')) {
            return lodash_1.default.get(kbnFilter, 'script.script.params.value');
        }
        // single phrase filter
        if (public_1.esFilters.isPhraseFilter(kbnFilter)) {
            if (public_1.esFilters.getPhraseFilterField(kbnFilter) !== this.fieldName) {
                return;
            }
            return public_1.esFilters.getPhraseFilterValue(kbnFilter);
        }
        // single phrase filter from bool filter
        if (lodash_1.default.has(kbnFilter, ['match_phrase', this.fieldName])) {
            return lodash_1.default.get(kbnFilter, ['match_phrase', this.fieldName]);
        }
    }
}
exports.PhraseFilterManager = PhraseFilterManager;
