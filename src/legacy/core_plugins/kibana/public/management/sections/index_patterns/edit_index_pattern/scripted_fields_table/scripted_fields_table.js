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
const scripting_languages_1 = require("ui/scripting_languages");
const documentation_links_1 = require("ui/documentation_links");
const eui_1 = require("@elastic/eui");
const components_1 = require("./components");
class ScriptedFieldsTable extends react_1.Component {
    constructor(props) {
        super(props);
        this.fetchFields = async () => {
            const fields = await this.props.indexPattern.getScriptedFields();
            const deprecatedLangsInUse = [];
            const deprecatedLangs = scripting_languages_1.getDeprecatedScriptingLanguages();
            const supportedLangs = scripting_languages_1.getSupportedScriptingLanguages();
            for (const field of fields) {
                const lang = field.lang;
                if (deprecatedLangs.includes(lang) || !supportedLangs.includes(lang)) {
                    deprecatedLangsInUse.push(lang);
                }
            }
            this.setState({
                fields,
                deprecatedLangsInUse,
            });
        };
        this.getFilteredItems = () => {
            const { fields } = this.state;
            const { fieldFilter, scriptedFieldLanguageFilter } = this.props;
            let languageFilteredFields = fields;
            if (scriptedFieldLanguageFilter) {
                languageFilteredFields = fields.filter(field => field.lang === this.props.scriptedFieldLanguageFilter);
            }
            let filteredFields = languageFilteredFields;
            if (fieldFilter) {
                const normalizedFieldFilter = fieldFilter.toLowerCase();
                filteredFields = languageFilteredFields.filter(field => field.name.toLowerCase().includes(normalizedFieldFilter));
            }
            return filteredFields;
        };
        this.startDeleteField = (field) => {
            this.setState({ fieldToDelete: field, isDeleteConfirmationModalVisible: true });
        };
        this.hideDeleteConfirmationModal = () => {
            this.setState({ fieldToDelete: undefined, isDeleteConfirmationModalVisible: false });
        };
        this.deleteField = () => {
            const { indexPattern, onRemoveField } = this.props;
            const { fieldToDelete } = this.state;
            indexPattern.removeScriptedField(fieldToDelete);
            if (onRemoveField) {
                onRemoveField();
            }
            this.fetchFields();
            this.hideDeleteConfirmationModal();
        };
        this.state = {
            deprecatedLangsInUse: [],
            fieldToDelete: undefined,
            isDeleteConfirmationModalVisible: false,
            fields: [],
        };
    }
    UNSAFE_componentWillMount() {
        this.fetchFields();
    }
    render() {
        const { indexPattern } = this.props;
        const { fieldToDelete, deprecatedLangsInUse } = this.state;
        const items = this.getFilteredItems();
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(components_1.Header, { addScriptedFieldUrl: `${window.location.origin +
                    window.location.pathname}#/management/kibana/index_patterns/${indexPattern.id}/create-field/` }),
            react_1.default.createElement(components_1.CallOuts, { deprecatedLangsInUse: deprecatedLangsInUse, painlessDocLink: documentation_links_1.documentationLinks.scriptedFields.painless }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
            react_1.default.createElement(components_1.Table, { indexPattern: indexPattern, items: items, editField: field => this.props.helpers.redirectToRoute(field), deleteField: this.startDeleteField }),
            fieldToDelete && (react_1.default.createElement(components_1.DeleteScritpedFieldConfirmationModal, { deleteField: this.deleteField, field: fieldToDelete, hideDeleteConfirmationModal: this.hideDeleteConfirmationModal }))));
    }
}
exports.ScriptedFieldsTable = ScriptedFieldsTable;
