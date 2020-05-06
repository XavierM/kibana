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
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const tabs_1 = require("./tabs");
const index_header_1 = require("./index_header");
const mappingAPILink = i18n_1.i18n.translate('kbn.management.editIndexPattern.timeFilterLabel.mappingAPILink', {
    defaultMessage: 'Mapping API',
});
const mappingConflictHeader = i18n_1.i18n.translate('kbn.management.editIndexPattern.mappingConflictHeader', {
    defaultMessage: 'Mapping conflict',
});
const confirmMessage = i18n_1.i18n.translate('kbn.management.editIndexPattern.refreshLabel', {
    defaultMessage: 'This action resets the popularity counter of each field.',
});
const confirmModalOptionsRefresh = {
    confirmButtonText: i18n_1.i18n.translate('kbn.management.editIndexPattern.refreshButton', {
        defaultMessage: 'Refresh',
    }),
    title: i18n_1.i18n.translate('kbn.management.editIndexPattern.refreshHeader', {
        defaultMessage: 'Refresh field list?',
    }),
};
const confirmModalOptionsDelete = {
    confirmButtonText: i18n_1.i18n.translate('kbn.management.editIndexPattern.deleteButton', {
        defaultMessage: 'Delete',
    }),
    title: i18n_1.i18n.translate('kbn.management.editIndexPattern.deleteHeader', {
        defaultMessage: 'Delete index pattern?',
    }),
};
exports.EditIndexPattern = react_router_dom_1.withRouter(({ indexPattern, indexPatterns, config, services, history, location }) => {
    const [fields, setFields] = react_1.useState(indexPattern.getNonScriptedFields());
    const [conflictedFields, setConflictedFields] = react_1.useState(indexPattern.fields.filter(field => field.type === 'conflict'));
    const [defaultIndex, setDefaultIndex] = react_1.useState(config.get('defaultIndex'));
    const [tags, setTags] = react_1.useState([]);
    react_1.useEffect(() => {
        setFields(indexPattern.getNonScriptedFields());
        setConflictedFields(indexPattern.fields.filter(field => field.type === 'conflict'));
    }, [indexPattern, indexPattern.fields]);
    react_1.useEffect(() => {
        const indexPatternTags = services.indexPatternManagement.list.getIndexPatternTags(indexPattern, indexPattern.id === defaultIndex) || [];
        setTags(indexPatternTags);
    }, [defaultIndex, indexPattern, services.indexPatternManagement.list]);
    const setDefaultPattern = react_1.useCallback(() => {
        config.set('defaultIndex', indexPattern.id);
        setDefaultIndex(indexPattern.id || '');
    }, [config, indexPattern.id]);
    const refreshFields = () => {
        services.overlays
            .openConfirm(confirmMessage, confirmModalOptionsRefresh)
            .then(async (isConfirmed) => {
            if (isConfirmed) {
                await indexPattern.init(true);
                setFields(indexPattern.getNonScriptedFields());
            }
        });
    };
    const removePattern = () => {
        function doRemove() {
            if (indexPattern.id === defaultIndex) {
                config.remove('defaultIndex');
                const otherPatterns = lodash_1.filter(indexPatterns, pattern => {
                    return pattern.id !== indexPattern.id;
                });
                if (otherPatterns.length) {
                    config.set('defaultIndex', otherPatterns[0].id);
                }
            }
            Promise.resolve(indexPattern.destroy()).then(function () {
                history.push('/management/kibana/index_patterns');
            });
        }
        services.overlays.openConfirm('', confirmModalOptionsDelete).then(isConfirmed => {
            if (isConfirmed) {
                doRemove();
            }
        });
    };
    const timeFilterHeader = i18n_1.i18n.translate('kbn.management.editIndexPattern.timeFilterHeader', {
        defaultMessage: "Time Filter field name: '{timeFieldName}'",
        values: { timeFieldName: indexPattern.timeFieldName },
    });
    const mappingConflictLabel = i18n_1.i18n.translate('kbn.management.editIndexPattern.mappingConflictLabel', {
        defaultMessage: '{conflictFieldsLength, plural, one {A field is} other {# fields are}} defined as several types (string, integer, etc) across the indices that match this pattern. You may still be able to use these conflict fields in parts of Kibana, but they will be unavailable for functions that require Kibana to know their type. Correcting this issue will require reindexing your data.',
        values: { conflictFieldsLength: conflictedFields.length },
    });
    services.docTitle.change(indexPattern.title);
    const showTagsSection = Boolean(indexPattern.timeFieldName || (tags && tags.length > 0));
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { direction: "column" },
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(index_header_1.IndexHeader, { indexPattern: indexPattern, setDefault: setDefaultPattern, refreshFields: refreshFields, deleteIndexPattern: removePattern, defaultIndex: defaultIndex }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            showTagsSection && (react_1.default.createElement(eui_1.EuiFlexGroup, { wrap: true },
                Boolean(indexPattern.timeFieldName) && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiBadge, { color: "warning" }, timeFilterHeader))),
                tags.map((tag) => (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, key: tag.key },
                    react_1.default.createElement(eui_1.EuiBadge, { color: "hollow" }, tag.name)))))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.timeFilterLabel.timeFilterDetail", defaultMessage: "This page lists every field in the {indexPatternTitle} index and the field's associated core type as recorded by Elasticsearch. To change a field type, use the Elasticsearch", values: { indexPatternTitle: react_1.default.createElement("strong", null, indexPattern.title) } }),
                    ' ',
                    react_1.default.createElement(eui_1.EuiLink, { href: "http://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html", target: "_blank" },
                        mappingAPILink,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "link" })))),
            conflictedFields.length > 0 && (react_1.default.createElement(eui_1.EuiCallOut, { title: mappingConflictHeader, color: "warning", iconType: "alert" },
                react_1.default.createElement("p", null, mappingConflictLabel)))),
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(tabs_1.Tabs, { indexPattern: indexPattern, fields: fields, config: config, services: {
                    indexPatternManagement: services.indexPatternManagement,
                }, history: history, location: location }))));
});
