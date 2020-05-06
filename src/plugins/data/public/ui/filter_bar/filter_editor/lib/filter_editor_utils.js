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
const datemath_1 = tslib_1.__importDefault(require("@elastic/datemath"));
const public_1 = require("../../../../../../kibana_utils/public");
const filter_operators_1 = require("./filter_operators");
const common_1 = require("../../../../../common");
function getFieldFromFilter(filter, indexPattern) {
    return indexPattern.fields.find(field => field.name === filter.meta.key);
}
exports.getFieldFromFilter = getFieldFromFilter;
function getOperatorFromFilter(filter) {
    return filter_operators_1.FILTER_OPERATORS.find(operator => {
        return filter.meta.type === operator.type && filter.meta.negate === operator.negate;
    });
}
exports.getOperatorFromFilter = getOperatorFromFilter;
function getFilterableFields(indexPattern) {
    return indexPattern.fields.filter(common_1.isFilterable);
}
exports.getFilterableFields = getFilterableFields;
function getOperatorOptions(field) {
    return filter_operators_1.FILTER_OPERATORS.filter(operator => {
        return !operator.fieldTypes || operator.fieldTypes.includes(field.type);
    });
}
exports.getOperatorOptions = getOperatorOptions;
function validateParams(params, type) {
    switch (type) {
        case 'date':
            const moment = typeof params === 'string' ? datemath_1.default.parse(params) : null;
            return Boolean(typeof params === 'string' && moment && moment.isValid());
        case 'ip':
            try {
                return Boolean(new public_1.Ipv4Address(params));
            }
            catch (e) {
                return false;
            }
        default:
            return true;
    }
}
exports.validateParams = validateParams;
function isFilterValid(indexPattern, field, operator, params) {
    if (!indexPattern || !field || !operator) {
        return false;
    }
    switch (operator.type) {
        case 'phrase':
            return validateParams(params, field.type);
        case 'phrases':
            if (!Array.isArray(params) || !params.length) {
                return false;
            }
            return params.every(phrase => validateParams(phrase, field.type));
        case 'range':
            if (typeof params !== 'object') {
                return false;
            }
            return validateParams(params.from, field.type) || validateParams(params.to, field.type);
        case 'exists':
            return true;
        default:
            throw new Error(`Unknown operator type: ${operator.type}`);
    }
}
exports.isFilterValid = isFilterValid;
