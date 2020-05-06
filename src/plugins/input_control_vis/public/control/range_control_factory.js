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
const i18n_1 = require("@kbn/i18n");
const control_1 = require("./control");
const range_filter_manager_1 = require("./filter_manager/range_filter_manager");
const create_search_source_1 = require("./create_search_source");
const minMaxAgg = (field) => {
    const aggBody = {};
    if (field) {
        if (field.scripted) {
            aggBody.script = {
                source: field.script,
                lang: field.lang,
            };
        }
        else {
            aggBody.field = field.name;
        }
    }
    return {
        maxAgg: {
            max: aggBody,
        },
        minAgg: {
            min: aggBody,
        },
    };
};
class RangeControl extends control_1.Control {
    constructor(controlParams, filterManager, useTimeFilter, searchSource, deps) {
        super(controlParams, filterManager, useTimeFilter);
        this.timefilter = deps.data.query.timefilter.timefilter;
        this.searchSource = searchSource;
    }
    async fetch() {
        // Abort any in-progress fetch
        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();
        const indexPattern = this.filterManager.getIndexPattern();
        if (!indexPattern) {
            this.disable(control_1.noIndexPatternMsg(this.controlParams.indexPattern));
            return;
        }
        const fieldName = this.filterManager.fieldName;
        const aggs = minMaxAgg(indexPattern.fields.getByName(fieldName));
        const searchSource = create_search_source_1.createSearchSource(this.searchSource, null, indexPattern, aggs, this.useTimeFilter, [], this.timefilter);
        const abortSignal = this.abortController.signal;
        let resp;
        try {
            resp = await searchSource.fetch({ abortSignal });
        }
        catch (error) {
            // If the fetch was aborted then no need to surface this error in the UI
            if (error.name === 'AbortError')
                return;
            this.disable(i18n_1.i18n.translate('inputControl.rangeControl.unableToFetchTooltip', {
                defaultMessage: 'Unable to fetch range min and max, error: {errorMessage}',
                values: { errorMessage: error.message },
            }));
            return;
        }
        const min = lodash_1.default.get(resp, 'aggregations.minAgg.value', null);
        const max = lodash_1.default.get(resp, 'aggregations.maxAgg.value', null);
        if (min === null || max === null) {
            this.disable(control_1.noValuesDisableMsg(fieldName, indexPattern.title));
            return;
        }
        this.min = min;
        this.max = max;
        this.enable = true;
    }
    destroy() {
        if (this.abortController)
            this.abortController.abort();
    }
}
exports.RangeControl = RangeControl;
async function rangeControlFactory(controlParams, useTimeFilter, deps) {
    const [, { data: dataPluginStart }] = await deps.core.getStartServices();
    const indexPattern = await dataPluginStart.indexPatterns.get(controlParams.indexPattern);
    return new RangeControl(controlParams, new range_filter_manager_1.RangeFilterManager(controlParams.id, controlParams.fieldName, indexPattern, deps.data.query.filterManager), useTimeFilter, dataPluginStart.search.searchSource, deps);
}
exports.rangeControlFactory = rangeControlFactory;
