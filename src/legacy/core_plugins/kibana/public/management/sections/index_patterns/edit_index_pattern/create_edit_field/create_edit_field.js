"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
// @ts-ignore
const field_editor_1 = require("ui/field_editor");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const index_header_1 = require("../index_header");
const public_1 = require("../../../../../../../../../plugins/data/public");
const constants_1 = require("../constants");
const newFieldPlaceholder = i18n_1.i18n.translate('kbn.management.editIndexPattern.scripted.newFieldPlaceholder', {
    defaultMessage: 'New Scripted Field',
});
exports.CreateEditField = react_router_dom_1.withRouter(({ indexPattern, mode, fieldName, fieldFormatEditors, getConfig, services, history, }) => {
    const field = mode === 'edit' && fieldName
        ? indexPattern.fields.getByName(fieldName)
        : new public_1.IndexPatternField(indexPattern, {
            scripted: true,
            type: 'number',
        });
    const url = `/management/kibana/index_patterns/${indexPattern.id}`;
    if (mode === 'edit' && !field) {
        const message = i18n_1.i18n.translate('kbn.management.editIndexPattern.scripted.noFieldLabel', {
            defaultMessage: "'{indexPatternTitle}' index pattern doesn't have a scripted field called '{fieldName}'",
            values: { indexPatternTitle: indexPattern.title, fieldName },
        });
        services.notifications.toasts.addWarning(message);
        history.push(url);
    }
    const docFieldName = field?.name || newFieldPlaceholder;
    services.docTitle.change([docFieldName, indexPattern.title]);
    const redirectAway = () => {
        history.push(`${url}?_a=(tab:${field?.scripted ? constants_1.TAB_SCRIPTED_FIELDS : constants_1.TAB_INDEXED_FIELDS})`);
    };
    if (field) {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { direction: "column" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(index_header_1.IndexHeader, { indexPattern: indexPattern, defaultIndex: getConfig('defaultIndex') })),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(field_editor_1.FieldEditor, { indexPattern: indexPattern, field: field, helpers: {
                        getConfig,
                        getHttpStart: services.getHttpStart,
                        fieldFormatEditors,
                        redirectAway,
                        docLinksScriptedFields: services.docLinksScriptedFields,
                    } }))));
    }
    else {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
});
