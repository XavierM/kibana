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
class FilterManager {
    constructor(controlId, fieldName, indexPattern, queryFilter) {
        this.controlId = controlId;
        this.fieldName = fieldName;
        this.indexPattern = indexPattern;
        this.queryFilter = queryFilter;
    }
    getIndexPattern() {
        return this.indexPattern;
    }
    getField() {
        return this.indexPattern.fields.getByName(this.fieldName);
    }
    findFilters() {
        const kbnFilters = lodash_1.default.flatten([
            this.queryFilter.getAppFilters(),
            this.queryFilter.getGlobalFilters(),
        ]);
        return kbnFilters.filter(kbnFilter => {
            return lodash_1.default.get(kbnFilter, 'meta.controlledBy') === this.controlId;
        });
    }
}
exports.FilterManager = FilterManager;
