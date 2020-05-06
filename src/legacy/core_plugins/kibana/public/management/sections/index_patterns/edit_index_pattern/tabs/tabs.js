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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../../../../../plugins/kibana_utils/public");
const edit_index_pattern_state_container_1 = require("../edit_index_pattern_state_container");
const constants_1 = require("../constants");
const source_filters_table_1 = require("../source_filters_table");
const indexed_fields_table_1 = require("../indexed_fields_table");
const scripted_fields_table_1 = require("../scripted_fields_table");
const utils_1 = require("./utils");
const filterAriaLabel = i18n_1.i18n.translate('kbn.management.editIndexPattern.fields.filterAria', {
    defaultMessage: 'Filter',
});
const filterPlaceholder = i18n_1.i18n.translate('kbn.management.editIndexPattern.fields.filterPlaceholder', {
    defaultMessage: 'Filter',
});
function Tabs({ config, indexPattern, fields, services, history, location }) {
    const [fieldFilter, setFieldFilter] = react_1.useState('');
    const [indexedFieldTypeFilter, setIndexedFieldTypeFilter] = react_1.useState('');
    const [scriptedFieldLanguageFilter, setScriptedFieldLanguageFilter] = react_1.useState('');
    const [indexedFieldTypes, setIndexedFieldType] = react_1.useState([]);
    const [scriptedFieldLanguages, setScriptedFieldLanguages] = react_1.useState([]);
    const [syncingStateFunc, setSyncingStateFunc] = react_1.useState({
        getCurrentTab: () => constants_1.TAB_INDEXED_FIELDS,
    });
    const refreshFilters = react_1.useCallback(() => {
        const tempIndexedFieldTypes = [];
        const tempScriptedFieldLanguages = [];
        indexPattern.fields.forEach(field => {
            if (field.scripted) {
                if (field.lang) {
                    tempScriptedFieldLanguages.push(field.lang);
                }
            }
            else {
                tempIndexedFieldTypes.push(field.type);
            }
        });
        setIndexedFieldType(utils_1.convertToEuiSelectOption(tempIndexedFieldTypes, 'indexedFiledTypes'));
        setScriptedFieldLanguages(utils_1.convertToEuiSelectOption(tempScriptedFieldLanguages, 'scriptedFieldLanguages'));
    }, [indexPattern]);
    react_1.useEffect(() => {
        refreshFilters();
    }, [indexPattern, indexPattern.fields, refreshFilters]);
    const fieldWildcardMatcherDecorated = react_1.useCallback((filters) => public_1.fieldWildcardMatcher(filters, config.get('metaFields')), [config]);
    const getFilterSection = react_1.useCallback((type) => {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                react_1.default.createElement(eui_1.EuiFieldSearch, { placeholder: filterPlaceholder, value: fieldFilter, onChange: e => setFieldFilter(e.target.value), "data-test-subj": "indexPatternFieldFilter", "aria-label": filterAriaLabel })),
            type === constants_1.TAB_INDEXED_FIELDS && indexedFieldTypes.length > 0 && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiSelect, { options: indexedFieldTypes, value: indexedFieldTypeFilter, onChange: e => setIndexedFieldTypeFilter(e.target.value), "data-test-subj": "indexedFieldTypeFilterDropdown" }))),
            type === constants_1.TAB_SCRIPTED_FIELDS && scriptedFieldLanguages.length > 0 && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiSelect, { options: scriptedFieldLanguages, value: scriptedFieldLanguageFilter, onChange: e => setScriptedFieldLanguageFilter(e.target.value), "data-test-subj": "scriptedFieldLanguageFilterDropdown" })))));
    }, [
        fieldFilter,
        indexedFieldTypeFilter,
        indexedFieldTypes,
        scriptedFieldLanguageFilter,
        scriptedFieldLanguages,
    ]);
    const getContent = react_1.useCallback((type) => {
        switch (type) {
            case constants_1.TAB_INDEXED_FIELDS:
                return (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    getFilterSection(type),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_1.default.createElement(indexed_fields_table_1.IndexedFieldsTable, { fields: fields, indexPattern: indexPattern, fieldFilter: fieldFilter, fieldWildcardMatcher: fieldWildcardMatcherDecorated, indexedFieldTypeFilter: indexedFieldTypeFilter, helpers: {
                            redirectToRoute: (field) => {
                                history.push(utils_1.getPath(field));
                            },
                            getFieldInfo: services.indexPatternManagement.list.getFieldInfo,
                        } })));
            case constants_1.TAB_SCRIPTED_FIELDS:
                return (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    getFilterSection(type),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_1.default.createElement(scripted_fields_table_1.ScriptedFieldsTable, { indexPattern: indexPattern, fieldFilter: fieldFilter, scriptedFieldLanguageFilter: scriptedFieldLanguageFilter, helpers: {
                            redirectToRoute: (field) => {
                                history.push(utils_1.getPath(field));
                            },
                        }, onRemoveField: refreshFilters })));
            case constants_1.TAB_SOURCE_FILTERS:
                return (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    getFilterSection(type),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_1.default.createElement(source_filters_table_1.SourceFiltersTable, { indexPattern: indexPattern, filterFilter: fieldFilter, fieldWildcardMatcher: fieldWildcardMatcherDecorated, onAddOrRemoveFilter: refreshFilters })));
        }
    }, [
        fieldFilter,
        fieldWildcardMatcherDecorated,
        fields,
        getFilterSection,
        history,
        indexPattern,
        indexedFieldTypeFilter,
        refreshFilters,
        scriptedFieldLanguageFilter,
        services.indexPatternManagement.list.getFieldInfo,
    ]);
    const euiTabs = react_1.useMemo(() => utils_1.getTabs(indexPattern, fieldFilter, services.indexPatternManagement.list).map((tab) => {
        return {
            ...tab,
            content: getContent(tab.id),
        };
    }), [fieldFilter, getContent, indexPattern, services.indexPatternManagement.list]);
    const [selectedTabId, setSelectedTabId] = react_1.useState(euiTabs[0].id);
    react_1.useEffect(() => {
        const { startSyncingState, stopSyncingState, setCurrentTab, getCurrentTab, } = edit_index_pattern_state_container_1.createEditIndexPatternPageStateContainer({
            useHashedUrl: config.get('state:storeInSessionStorage'),
            defaultTab: constants_1.TAB_INDEXED_FIELDS,
        });
        startSyncingState();
        setSyncingStateFunc({
            setCurrentTab,
            getCurrentTab,
        });
        setSelectedTabId(getCurrentTab());
        return () => {
            stopSyncingState();
        };
    }, [config]);
    return (react_1.default.createElement(eui_1.EuiTabbedContent, { tabs: euiTabs, selectedTab: euiTabs.find(tab => tab.id === selectedTabId), onTabClick: tab => {
            setSelectedTabId(tab.id);
            syncingStateFunc.setCurrentTab(tab.id);
        } }));
}
exports.Tabs = Tabs;
