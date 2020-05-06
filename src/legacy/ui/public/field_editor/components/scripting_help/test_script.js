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
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const new_platform_1 = require("ui/new_platform");
const { SearchBar } = new_platform_1.npStart.plugins.data.ui;
const { uiSettings } = new_platform_1.npStart.core;
const public_1 = require("../../../../../../plugins/data/public");
class TestScript extends react_1.Component {
    constructor() {
        super(...arguments);
        this.defaultProps = {
            name: 'myScriptedField',
        };
        this.state = {
            isLoading: false,
            additionalFields: [],
            previewData: undefined,
        };
        this.previewScript = async (searchContext) => {
            const { indexPattern, lang, name, script, executeScript, getHttpStart } = this.props;
            if (!script || script.length === 0) {
                return;
            }
            this.setState({
                isLoading: true,
            });
            let query;
            if (searchContext) {
                const esQueryConfigs = public_1.esQuery.getEsQueryConfig(uiSettings);
                query = public_1.esQuery.buildEsQuery(this.props.indexPattern, searchContext.query || [], [], esQueryConfigs);
            }
            const scriptResponse = await executeScript({
                name: name,
                lang,
                script,
                indexPatternTitle: indexPattern.title,
                query,
                additionalFields: this.state.additionalFields.map((option) => option.value),
                getHttpStart,
            });
            if (scriptResponse.status !== 200) {
                this.setState({
                    isLoading: false,
                    previewData: scriptResponse,
                });
                return;
            }
            this.setState({
                isLoading: false,
                previewData: scriptResponse.hits.hits.map(hit => ({
                    _id: hit._id,
                    ...hit._source,
                    ...hit.fields,
                })),
            });
        };
        this.onAdditionalFieldsChange = (selectedOptions) => {
            this.setState({
                additionalFields: selectedOptions,
            });
        };
    }
    componentDidMount() {
        if (this.props.script) {
            this.previewScript();
        }
    }
    renderPreview(previewData) {
        if (!previewData) {
            return null;
        }
        if (previewData.error) {
            return (react_1.default.createElement(eui_1.EuiCallOut, { title: i18n_1.i18n.translate('common.ui.fieldEditor.testScript.errorMessage', {
                    defaultMessage: `There's an error in your script`,
                }), color: "danger", iconType: "cross" },
                react_1.default.createElement(eui_1.EuiCodeBlock, { language: "json", className: "scriptPreviewCodeBlock", "data-test-subj": "scriptedFieldPreview" }, JSON.stringify(previewData.error, null, ' '))));
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.testScript.resultsLabel", defaultMessage: "First 10 results" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiCodeBlock, { language: "json", className: "scriptPreviewCodeBlock", "data-test-subj": "scriptedFieldPreview" }, JSON.stringify(previewData, null, ' '))));
    }
    renderToolbar() {
        const fieldsByTypeMap = new Map();
        const fields = [];
        this.props.indexPattern.fields
            .filter(field => {
            const isMultiField = field.subType && field.subType.multi;
            return !field.name.startsWith('_') && !isMultiField && !field.scripted;
        })
            .forEach(field => {
            if (fieldsByTypeMap.has(field.type)) {
                const fieldsList = fieldsByTypeMap.get(field.type);
                fieldsList.push(field.name);
                fieldsByTypeMap.set(field.type, fieldsList);
            }
            else {
                fieldsByTypeMap.set(field.type, [field.name]);
            }
        });
        fieldsByTypeMap.forEach((fieldsList, fieldType) => {
            fields.push({
                label: fieldType,
                options: fieldsList.sort().map((fieldName) => {
                    return { value: fieldName, label: fieldName };
                }),
            });
        });
        fields.sort((a, b) => {
            if (a.label < b.label)
                return -1;
            if (a.label > b.label)
                return 1;
            return 0;
        });
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('common.ui.fieldEditor.testScript.fieldsLabel', {
                    defaultMessage: 'Additional fields',
                }), fullWidth: true },
                react_1.default.createElement(eui_1.EuiComboBox, { placeholder: i18n_1.i18n.translate('common.ui.fieldEditor.testScript.fieldsPlaceholder', {
                        defaultMessage: 'Select...',
                    }), options: fields, selectedOptions: this.state.additionalFields, onChange: selected => this.onAdditionalFieldsChange(selected), "data-test-subj": "additionalFieldsSelect", fullWidth: true })),
            react_1.default.createElement("div", { className: "testScript__searchBar" },
                react_1.default.createElement(SearchBar, { appName: 'indexPatternManagement', showFilterBar: false, showDatePicker: false, showQueryInput: true, query: { language: uiSettings.get('search:queryLanguage'), query: '' }, onQuerySubmit: this.previewScript, indexPatterns: [this.props.indexPattern], customSubmitButton: react_1.default.createElement(eui_1.EuiButton, { disabled: this.props.script ? false : true, isLoading: this.state.isLoading, "data-test-subj": "runScriptButton" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.testScript.submitButtonLabel", defaultMessage: "Run script" })) }))));
    }
    render() {
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, null),
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.testScript.resultsTitle", defaultMessage: "Preview results" })),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.testScript.instructions", defaultMessage: "Run your script to preview the first 10 results. You can also select some additional\n              fields to include in your results to gain more context or add a query to filter on\n              specific documents." }))),
            react_1.default.createElement(eui_1.EuiSpacer, null),
            this.renderToolbar(),
            react_1.default.createElement(eui_1.EuiSpacer, null),
            this.renderPreview(this.state.previewData)));
    }
}
exports.TestScript = TestScript;
