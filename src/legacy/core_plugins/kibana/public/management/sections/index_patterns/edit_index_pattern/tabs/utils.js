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
const constants_1 = require("../constants");
function filterByName(items, filter) {
    const lowercaseFilter = (filter || '').toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(lowercaseFilter));
}
function getCounts(fields, sourceFilters, fieldFilter = '') {
    const fieldCount = lodash_1.countBy(filterByName(fields, fieldFilter), function (field) {
        return field.scripted ? 'scripted' : 'indexed';
    });
    lodash_1.defaults(fieldCount, {
        indexed: 0,
        scripted: 0,
        sourceFilters: sourceFilters.excludes
            ? sourceFilters.excludes.filter(value => value.toLowerCase().includes(fieldFilter.toLowerCase())).length
            : 0,
    });
    return fieldCount;
}
function getTitle(type, filteredCount, totalCount) {
    let title = '';
    switch (type) {
        case 'indexed':
            title = i18n_1.i18n.translate('kbn.management.editIndexPattern.tabs.fieldsHeader', {
                defaultMessage: 'Fields',
            });
            break;
        case 'scripted':
            title = i18n_1.i18n.translate('kbn.management.editIndexPattern.tabs.scriptedHeader', {
                defaultMessage: 'Scripted fields',
            });
            break;
        case 'sourceFilters':
            title = i18n_1.i18n.translate('kbn.management.editIndexPattern.tabs.sourceHeader', {
                defaultMessage: 'Source filters',
            });
            break;
    }
    const count = ` (${filteredCount[type] === totalCount[type]
        ? filteredCount[type]
        : filteredCount[type] + ' / ' + totalCount[type]})`;
    return title + count;
}
function getTabs(indexPattern, fieldFilter, indexPatternListProvider) {
    const totalCount = getCounts(indexPattern.fields, indexPattern.getSourceFiltering());
    const filteredCount = getCounts(indexPattern.fields, indexPattern.getSourceFiltering(), fieldFilter);
    const tabs = [];
    tabs.push({
        name: getTitle('indexed', filteredCount, totalCount),
        id: constants_1.TAB_INDEXED_FIELDS,
    });
    if (indexPatternListProvider.areScriptedFieldsEnabled(indexPattern)) {
        tabs.push({
            name: getTitle('scripted', filteredCount, totalCount),
            id: constants_1.TAB_SCRIPTED_FIELDS,
        });
    }
    tabs.push({
        name: getTitle('sourceFilters', filteredCount, totalCount),
        id: constants_1.TAB_SOURCE_FILTERS,
    });
    return tabs;
}
exports.getTabs = getTabs;
function getPath(field) {
    return `/management/kibana/index_patterns/${field.indexPattern?.id}/field/${field.name}`;
}
exports.getPath = getPath;
const allTypesDropDown = i18n_1.i18n.translate('kbn.management.editIndexPattern.fields.allTypesDropDown', {
    defaultMessage: 'All field types',
});
const allLangsDropDown = i18n_1.i18n.translate('kbn.management.editIndexPattern.fields.allLangsDropDown', {
    defaultMessage: 'All languages',
});
function convertToEuiSelectOption(options, type) {
    const euiOptions = options.length > 0
        ? [
            {
                value: '',
                text: type === 'scriptedFieldLanguages' ? allLangsDropDown : allTypesDropDown,
            },
        ]
        : [];
    return euiOptions.concat(lodash_1.unique(options).map(option => {
        return {
            value: option,
            text: option,
        };
    }));
}
exports.convertToEuiSelectOption = convertToEuiSelectOption;
