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
const lodash_1 = require("lodash");
const scripting_languages_1 = require("ui/scripting_languages");
const new_platform_1 = require("ui/new_platform");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const scripting_call_outs_1 = require("./components/scripting_call_outs");
const scripting_help_1 = require("./components/scripting_help");
const field_format_editor_1 = require("./components/field_format_editor");
const constants_1 = require("./constants");
const lib_1 = require("./lib");
// This loads Ace editor's "groovy" mode, used below to highlight the script.
require("brace/mode/groovy");
const getFieldFormats = () => new_platform_1.npStart.plugins.data.fieldFormats;
const getFieldTypeFormatsList = (field, defaultFieldFormat) => {
    const fieldFormats = getFieldFormats();
    const formatsByType = fieldFormats
        .getByFieldType(field.type)
        .map(({ id, title }) => ({
        id,
        title,
    }));
    return [
        {
            id: '',
            defaultFieldFormat,
            title: i18n_1.i18n.translate('common.ui.fieldEditor.defaultFormatDropDown', {
                defaultMessage: '- Default -',
            }),
        },
        ...formatsByType,
    ];
};
class FieldEditor extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.supportedLangs = [];
        this.deprecatedLangs = [];
        this.onFieldChange = (fieldName, value) => {
            const { field } = this.state;
            field[fieldName] = value;
            this.forceUpdate();
        };
        this.onTypeChange = (type) => {
            const { getConfig } = this.props.helpers;
            const { field } = this.state;
            const fieldFormats = getFieldFormats();
            const DefaultFieldFormat = fieldFormats.getDefaultType(type);
            field.type = type;
            field.format = new DefaultFieldFormat(null, getConfig);
            this.setState({
                fieldTypeFormats: getFieldTypeFormatsList(field, DefaultFieldFormat),
                fieldFormatId: DefaultFieldFormat.id,
                fieldFormatParams: field.format.params(),
            });
        };
        this.onLangChange = (lang) => {
            const { field } = this.state;
            const fieldTypes = lodash_1.get(constants_1.FIELD_TYPES_BY_LANG, lang, constants_1.DEFAULT_FIELD_TYPES);
            field.lang = lang;
            field.type = fieldTypes.includes(field.type) ? field.type : fieldTypes[0];
            this.setState({
                fieldTypes,
            });
        };
        this.onFormatChange = (formatId, params) => {
            const fieldFormats = getFieldFormats();
            const { field, fieldTypeFormats } = this.state;
            const FieldFormat = fieldFormats.getType(formatId || fieldTypeFormats[0].defaultFieldFormat.id);
            field.format = new FieldFormat(params, this.props.helpers.getConfig);
            this.setState({
                fieldFormatId: FieldFormat.id,
                fieldFormatParams: field.format.params(),
            });
        };
        this.onFormatParamsChange = (newParams) => {
            const { fieldFormatId } = this.state;
            this.onFormatChange(fieldFormatId, newParams);
        };
        this.onFormatParamsError = (error) => {
            this.setState({
                hasFormatError: !!error,
            });
        };
        this.onScriptChange = (value) => {
            this.setState({
                hasScriptError: false,
            });
            this.onFieldChange('script', value);
        };
        this.showScriptingHelp = () => {
            this.setState({
                showScriptingHelp: true,
            });
        };
        this.hideScriptingHelp = () => {
            this.setState({
                showScriptingHelp: false,
            });
        };
        this.renderDeleteModal = () => {
            const { field } = this.state;
            return this.state.showDeleteModal ? (react_1.default.createElement(eui_1.EuiOverlayMask, null,
                react_1.default.createElement(eui_1.EuiConfirmModal, { title: i18n_1.i18n.translate('common.ui.fieldEditor.deleteFieldHeader', {
                        defaultMessage: "Delete field '{fieldName}'",
                        values: { fieldName: field.name },
                    }), onCancel: this.hideDeleteModal, onConfirm: () => {
                        this.hideDeleteModal();
                        this.deleteField();
                    }, cancelButtonText: i18n_1.i18n.translate('common.ui.fieldEditor.deleteField.cancelButton', {
                        defaultMessage: 'Cancel',
                    }), confirmButtonText: i18n_1.i18n.translate('common.ui.fieldEditor.deleteField.deleteButton', {
                        defaultMessage: 'Delete',
                    }), buttonColor: "danger", defaultFocusedButton: eui_1.EUI_MODAL_CONFIRM_BUTTON },
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.deleteFieldLabel", defaultMessage: "You can't recover a deleted field.{separator}Are you sure you want to do this?", values: {
                                separator: (react_1.default.createElement("span", null,
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement("br", null))),
                            } }))))) : null;
        };
        this.showDeleteModal = () => {
            this.setState({
                showDeleteModal: true,
            });
        };
        this.hideDeleteModal = () => {
            this.setState({
                showDeleteModal: false,
            });
        };
        this.renderScriptingPanels = () => {
            const { scriptingLangs, field, showScriptingHelp } = this.state;
            if (!field.scripted) {
                return;
            }
            return (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement(scripting_call_outs_1.ScriptingDisabledCallOut, { isVisible: !scriptingLangs.length }),
                react_1.default.createElement(scripting_call_outs_1.ScriptingWarningCallOut, { isVisible: true, docLinksScriptedFields: this.props.helpers.docLinksScriptedFields }),
                react_1.default.createElement(scripting_help_1.ScriptingHelpFlyout, { isVisible: showScriptingHelp, onClose: this.hideScriptingHelp, indexPattern: this.props.indexPattern, lang: field.lang, name: field.name, script: field.script, executeScript: lib_1.executeScript, getHttpStart: this.props.helpers.getHttpStart, docLinksScriptedFields: this.props.helpers.docLinksScriptedFields })));
        };
        this.deleteField = () => {
            const { redirectAway } = this.props.helpers;
            const { indexPattern } = this.props;
            const { field } = this.state;
            const remove = indexPattern.removeScriptedField(field);
            if (remove) {
                remove.then(() => {
                    const message = i18n_1.i18n.translate('common.ui.fieldEditor.deleteField.deletedHeader', {
                        defaultMessage: "Deleted '{fieldName}'",
                        values: { fieldName: field.name },
                    });
                    new_platform_1.npStart.core.notifications.toasts.addSuccess(message);
                    redirectAway();
                });
            }
            else {
                redirectAway();
            }
        };
        this.saveField = async () => {
            const field = this.state.field;
            const { indexPattern } = this.props;
            const { fieldFormatId } = this.state;
            if (field.scripted) {
                this.setState({
                    isSaving: true,
                });
                const isValid = await lib_1.isScriptValid({
                    name: field.name,
                    lang: field.lang,
                    script: field.script,
                    indexPatternTitle: indexPattern.title,
                    getHttpStart: this.props.helpers.getHttpStart,
                });
                if (!isValid) {
                    this.setState({
                        hasScriptError: true,
                        isSaving: false,
                    });
                    return;
                }
            }
            const { redirectAway } = this.props.helpers;
            const index = indexPattern.fields.findIndex((f) => f.name === field.name);
            if (index > -1) {
                indexPattern.fields.update(field);
            }
            else {
                indexPattern.fields.add(field);
            }
            if (!fieldFormatId) {
                indexPattern.fieldFormatMap[field.name] = undefined;
            }
            else {
                indexPattern.fieldFormatMap[field.name] = field.format;
            }
            return indexPattern.save().then(function () {
                const message = i18n_1.i18n.translate('common.ui.fieldEditor.deleteField.savedHeader', {
                    defaultMessage: "Saved '{fieldName}'",
                    values: { fieldName: field.name },
                });
                new_platform_1.npStart.core.notifications.toasts.addSuccess(message);
                redirectAway();
            });
        };
        const { field, indexPattern } = props;
        this.state = {
            isReady: false,
            isCreating: false,
            isDeprecatedLang: false,
            scriptingLangs: [],
            fieldTypes: [],
            fieldTypeFormats: [],
            existingFieldNames: indexPattern.fields.map((f) => f.name),
            field: { ...field, format: field.format },
            fieldFormatId: undefined,
            fieldFormatParams: {},
            showScriptingHelp: false,
            showDeleteModal: false,
            hasFormatError: false,
            hasScriptError: false,
            isSaving: false,
        };
        this.supportedLangs = scripting_languages_1.getSupportedScriptingLanguages();
        this.deprecatedLangs = scripting_languages_1.getDeprecatedScriptingLanguages();
        this.init();
    }
    async init() {
        const { getHttpStart } = this.props.helpers;
        const { field } = this.state;
        const { indexPattern } = this.props;
        const enabledLangs = await scripting_languages_1.getEnabledScriptingLanguages(await getHttpStart());
        const scriptingLangs = lodash_1.intersection(enabledLangs, lodash_1.union(this.supportedLangs, this.deprecatedLangs));
        field.lang = field.lang && scriptingLangs.includes(field.lang) ? field.lang : undefined;
        const fieldTypes = lodash_1.get(constants_1.FIELD_TYPES_BY_LANG, field.lang || '', constants_1.DEFAULT_FIELD_TYPES);
        field.type = fieldTypes.includes(field.type) ? field.type : fieldTypes[0];
        const fieldFormats = getFieldFormats();
        const DefaultFieldFormat = fieldFormats.getDefaultType(field.type, field.esTypes);
        this.setState({
            isReady: true,
            isCreating: !indexPattern.fields.find(f => f.name === field.name),
            isDeprecatedLang: this.deprecatedLangs.includes(field.lang || ''),
            errors: [],
            scriptingLangs,
            fieldTypes,
            fieldTypeFormats: getFieldTypeFormatsList(field, DefaultFieldFormat),
            fieldFormatId: lodash_1.get(indexPattern, ['fieldFormatMap', field.name, 'type', 'id']),
            fieldFormatParams: field.format.params(),
        });
    }
    isDuplicateName() {
        const { isCreating, field, existingFieldNames } = this.state;
        return isCreating && existingFieldNames.includes(field.name);
    }
    renderName() {
        const { isCreating, field } = this.state;
        const isInvalid = !field.name || !field.name.trim();
        return isCreating ? (react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('common.ui.fieldEditor.nameLabel', { defaultMessage: 'Name' }), helpText: this.isDuplicateName() ? (react_1.default.createElement("span", null,
                react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "warning", size: "s" }),
                "\u00A0",
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.mappingConflictLabel.mappingConflictDetail", defaultMessage: "{mappingConflict} You already have a field with the name {fieldName}. Naming your scripted field with\n              the same name means you won't be able to query both fields at the same time.", values: {
                        mappingConflict: (react_1.default.createElement("strong", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.mappingConflictLabel.mappingConflictLabel", defaultMessage: "Mapping Conflict:" }))),
                        fieldName: react_1.default.createElement(eui_1.EuiCode, null, field.name),
                    } }))) : null, isInvalid: isInvalid, error: isInvalid
                ? i18n_1.i18n.translate('common.ui.fieldEditor.nameErrorMessage', {
                    defaultMessage: 'Name is required',
                })
                : null },
            react_1.default.createElement(eui_1.EuiFieldText, { value: field.name || '', placeholder: i18n_1.i18n.translate('common.ui.fieldEditor.namePlaceholder', {
                    defaultMessage: 'New scripted field',
                }), "data-test-subj": "editorFieldName", onChange: e => {
                    this.onFieldChange('name', e.target.value);
                }, isInvalid: isInvalid }))) : null;
    }
    renderLanguage() {
        const { field, scriptingLangs, isDeprecatedLang } = this.state;
        return field.scripted ? (react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('common.ui.fieldEditor.languageLabel', {
                defaultMessage: 'Language',
            }), helpText: isDeprecatedLang ? (react_1.default.createElement("span", null,
                react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "warning", size: "s" }),
                "\u00A0",
                react_1.default.createElement("strong", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningHeader", defaultMessage: "Deprecation Warning:" })),
                "\u00A0",
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningLabel.warningDetail", defaultMessage: "{language} is deprecated and support will be removed in the next major version of Kibana and Elasticsearch.\n              We recommend using {painlessLink} for new scripted fields.", values: {
                        language: react_1.default.createElement(eui_1.EuiCode, null, field.lang),
                        painlessLink: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: new_platform_1.npStart.core.docLinks.links.scriptedFields.painless },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.warningLabel.painlessLinkLabel", defaultMessage: "Painless" }))),
                    } }))) : null },
            react_1.default.createElement(eui_1.EuiSelect, { value: field.lang, options: scriptingLangs.map(lang => {
                    return { value: lang, text: lang };
                }), "data-test-subj": "editorFieldLang", onChange: e => {
                    this.onLangChange(e.target.value);
                } }))) : null;
    }
    renderType() {
        const { field, fieldTypes } = this.state;
        return (react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('common.ui.fieldEditor.typeLabel', { defaultMessage: 'Type' }) },
            react_1.default.createElement(eui_1.EuiSelect, { value: field.type, disabled: !field.scripted, options: fieldTypes.map(type => {
                    return { value: type, text: type };
                }), "data-test-subj": "editorFieldType", onChange: e => {
                    this.onTypeChange(e.target.value);
                } })));
    }
    /**
     * renders a warning and a table of conflicting indices
     * in case there are indices with different types
     */
    renderTypeConflict() {
        const { field } = this.state;
        if (!field.conflictDescriptions || typeof field.conflictDescriptions !== 'object') {
            return null;
        }
        const columns = [
            {
                field: 'type',
                name: i18n_1.i18n.translate('common.ui.fieldEditor.typeLabel', { defaultMessage: 'Type' }),
                width: '100px',
            },
            {
                field: 'indices',
                name: i18n_1.i18n.translate('common.ui.fieldEditor.indexNameLabel', {
                    defaultMessage: 'Index names',
                }),
            },
        ];
        const items = Object.entries(field.conflictDescriptions).map(([type, indices]) => ({
            type,
            indices: Array.isArray(indices) ? indices.join(', ') : 'Index names unavailable',
        }));
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(eui_1.EuiCallOut, { color: "warning", iconType: "alert", title: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.fieldTypeConflict", defaultMessage: "Field type conflict" }), size: "s" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.multiTypeLabelDesc", defaultMessage: "The type of this field changes across indices. It is unavailable for many analysis functions.\n          The indices per type are as follows:" })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(eui_1.EuiBasicTable, { items: items, columns: columns }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
    }
    renderFormat() {
        const { field, fieldTypeFormats, fieldFormatId, fieldFormatParams } = this.state;
        const { fieldFormatEditors } = this.props.helpers;
        const defaultFormat = fieldTypeFormats[0].defaultFieldFormat.title;
        const label = defaultFormat ? (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.defaultFormatHeader", defaultMessage: "Format (Default: {defaultFormat})", values: {
                defaultFormat: react_1.default.createElement(eui_1.EuiCode, null, defaultFormat),
            } })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.formatHeader", defaultMessage: "Format" }));
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: label, helpText: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.formatLabel", defaultMessage: "Formatting allows you to control the way that specific values are displayed. It can also cause values to be\n              completely changed and prevent highlighting in Discover from working." }) },
                react_1.default.createElement(eui_1.EuiSelect, { value: fieldFormatId, options: fieldTypeFormats.map(format => {
                        return { value: format.id || '', text: format.title };
                    }), "data-test-subj": "editorSelectedFormatId", onChange: e => {
                        this.onFormatChange(e.target.value);
                    } })),
            fieldFormatId ? (react_1.default.createElement(field_format_editor_1.FieldFormatEditor, { fieldType: field.type, fieldFormat: field.format, fieldFormatId: fieldFormatId, fieldFormatParams: fieldFormatParams, fieldFormatEditors: fieldFormatEditors, onChange: this.onFormatParamsChange, onError: this.onFormatParamsError })) : null));
    }
    renderPopularity() {
        const { field } = this.state;
        return (react_1.default.createElement(eui_1.EuiFormRow, { label: i18n_1.i18n.translate('common.ui.fieldEditor.popularityLabel', {
                defaultMessage: 'Popularity',
                description: '"Popularity" refers to Kibana\'s measurement how popular a field is (i.e. how commonly it is used).',
            }) },
            react_1.default.createElement(eui_1.EuiFieldNumber, { value: field.count, "data-test-subj": "editorFieldCount", onChange: e => {
                    this.onFieldChange('count', e.target.value ? Number(e.target.value) : '');
                } })));
    }
    renderScript() {
        const { field, hasScriptError } = this.state;
        const isInvalid = !field.script || !field.script.trim() || hasScriptError;
        const errorMsg = hasScriptError ? (react_1.default.createElement("span", { "data-test-subj": "invalidScriptError" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.scriptInvalidErrorMessage", defaultMessage: "Script is invalid. View script preview for details" }))) : (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.scriptRequiredErrorMessage", defaultMessage: "Script is required" }));
        return field.scripted ? (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: i18n_1.i18n.translate('common.ui.fieldEditor.scriptLabel', { defaultMessage: 'Script' }), isInvalid: isInvalid, error: isInvalid ? errorMsg : null },
                react_1.default.createElement(eui_1.EuiCodeEditor, { value: field.script, "data-test-subj": "editorFieldScript", onChange: this.onScriptChange, mode: "groovy", width: "100%", height: "300px" })),
            react_1.default.createElement(eui_1.EuiFormRow, null,
                react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.script.accessWithLabel", defaultMessage: "Access fields with {code}.", values: { code: react_1.default.createElement("code", null, `doc['some_field'].value`) } })),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement(eui_1.EuiLink, { onClick: this.showScriptingHelp, "data-test-subj": "scriptedFieldsHelpLink" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.script.getHelpLabel", defaultMessage: "Get help with the syntax and preview the results of your script." })))))) : null;
    }
    renderActions() {
        const { isCreating, field, isSaving } = this.state;
        const { redirectAway } = this.props.helpers;
        return (react_1.default.createElement(eui_1.EuiFormRow, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: this.saveField, isDisabled: this.isSavingDisabled(), isLoading: isSaving, "data-test-subj": "fieldSaveButton" }, isCreating ? (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.actions.createButton", defaultMessage: "Create field" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.actions.saveButton", defaultMessage: "Save field" })))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: redirectAway, "data-test-subj": "fieldCancelButton" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.actions.cancelButton", defaultMessage: "Cancel" }))),
                !isCreating && field.scripted ? (react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd" },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "danger", onClick: this.showDeleteModal },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.actions.deleteButton", defaultMessage: "Delete" })))))) : null)));
    }
    isSavingDisabled() {
        const { field, hasFormatError, hasScriptError } = this.state;
        if (hasFormatError ||
            hasScriptError ||
            !field.name ||
            !field.name.trim() ||
            (field.scripted && (!field.script || !field.script.trim()))) {
            return true;
        }
        return false;
    }
    render() {
        const { isReady, isCreating, field } = this.state;
        return isReady ? (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement("h3", null, isCreating ? (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.createHeader", defaultMessage: "Create scripted field" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.editHeader", defaultMessage: "Edit {fieldName}", values: { fieldName: field.name } })))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(eui_1.EuiForm, null,
                this.renderScriptingPanels(),
                this.renderName(),
                this.renderLanguage(),
                this.renderType(),
                this.renderTypeConflict(),
                this.renderFormat(),
                this.renderPopularity(),
                this.renderScript(),
                this.renderActions(),
                this.renderDeleteModal()),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }))) : null;
    }
}
exports.FieldEditor = FieldEditor;
