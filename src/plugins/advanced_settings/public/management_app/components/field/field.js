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
const classnames_1 = tslib_1.__importDefault(require("classnames"));
require("brace/theme/textmate");
require("brace/mode/markdown");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const lib_1 = require("../../lib");
exports.getEditableValue = (type, value, defVal) => {
    const val = value === null || value === undefined ? defVal : value;
    switch (type) {
        case 'array':
            return val.join(', ');
        case 'boolean':
            return !!val;
        case 'number':
            return Number(val);
        case 'image':
            return val;
        default:
            return val || '';
    }
};
class Field extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.changeImageForm = react_1.default.createRef();
        this.handleChange = (unsavedChanges) => {
            this.props.handleChange(this.props.setting.name, unsavedChanges);
        };
        this.resetField = () => {
            const { type, defVal } = this.props.setting;
            if (type === 'image') {
                this.cancelChangeImage();
                return this.handleChange({
                    value: exports.getEditableValue(type, defVal),
                    changeImage: true,
                });
            }
            return this.handleChange({ value: exports.getEditableValue(type, defVal) });
        };
        this.onCodeEditorChange = (value) => {
            const { defVal, type } = this.props.setting;
            let newUnsavedValue;
            let errorParams = {};
            switch (type) {
                case 'json':
                    const isJsonArray = Array.isArray(JSON.parse(defVal || '{}'));
                    newUnsavedValue = value.trim() || (isJsonArray ? '[]' : '{}');
                    try {
                        JSON.parse(newUnsavedValue);
                    }
                    catch (e) {
                        errorParams = {
                            error: i18n_1.i18n.translate('advancedSettings.field.codeEditorSyntaxErrorMessage', {
                                defaultMessage: 'Invalid JSON syntax',
                            }),
                            isInvalid: true,
                        };
                    }
                    break;
                default:
                    newUnsavedValue = value;
            }
            this.handleChange({
                value: newUnsavedValue,
                ...errorParams,
            });
        };
        this.onFieldChangeSwitch = (e) => {
            return this.onFieldChange(e.target.checked);
        };
        this.onFieldChangeEvent = (e) => this.onFieldChange(e.target.value);
        this.onFieldChange = (targetValue) => {
            const { type, validation, value, defVal } = this.props.setting;
            let newUnsavedValue;
            switch (type) {
                case 'boolean':
                    const { unsavedChanges } = this.props;
                    const currentValue = unsavedChanges
                        ? unsavedChanges.value
                        : exports.getEditableValue(type, value, defVal);
                    newUnsavedValue = !currentValue;
                    break;
                case 'number':
                    newUnsavedValue = Number(targetValue);
                    break;
                default:
                    newUnsavedValue = targetValue;
            }
            let errorParams = {};
            if (validation?.regex) {
                if (!validation.regex.test(newUnsavedValue.toString())) {
                    errorParams = {
                        error: validation.message,
                        isInvalid: true,
                    };
                }
            }
            this.handleChange({
                value: newUnsavedValue,
                ...errorParams,
            });
        };
        this.onImageChange = async (files) => {
            if (files == null)
                return;
            if (!files.length) {
                this.setState({
                    unsavedValue: null,
                });
                return;
            }
            const file = files[0];
            const { maxSize } = this.props.setting.validation;
            try {
                let base64Image = '';
                if (file instanceof File) {
                    base64Image = (await this.getImageAsBase64(file));
                }
                let errorParams = {};
                const isInvalid = !!(maxSize?.length && base64Image.length > maxSize.length);
                if (isInvalid) {
                    errorParams = {
                        isInvalid,
                        error: i18n_1.i18n.translate('advancedSettings.field.imageTooLargeErrorMessage', {
                            defaultMessage: 'Image is too large, maximum size is {maxSizeDescription}',
                            values: {
                                maxSizeDescription: maxSize.description,
                            },
                        }),
                    };
                }
                this.handleChange({
                    changeImage: true,
                    value: base64Image,
                    ...errorParams,
                });
            }
            catch (err) {
                this.props.toasts.addDanger(i18n_1.i18n.translate('advancedSettings.field.imageChangeErrorMessage', {
                    defaultMessage: 'Image could not be saved',
                }));
                this.cancelChangeImage();
            }
        };
        this.changeImage = () => {
            this.handleChange({
                value: null,
                changeImage: true,
            });
        };
        this.cancelChangeImage = () => {
            if (this.changeImageForm.current?.fileInput) {
                this.changeImageForm.current.fileInput.value = '';
                this.changeImageForm.current.handleChange();
            }
            if (this.props.clearChange) {
                this.props.clearChange(this.props.setting.name);
            }
        };
    }
    getDisplayedDefaultValue(type, defVal, optionLabels = {}) {
        if (defVal === undefined || defVal === null || defVal === '') {
            return 'null';
        }
        switch (type) {
            case 'array':
                return defVal.join(', ');
            case 'select':
                return optionLabels.hasOwnProperty(String(defVal))
                    ? optionLabels[String(defVal)]
                    : String(defVal);
            default:
                return String(defVal);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.setting.type === 'image' &&
            prevProps.unsavedChanges?.value &&
            !this.props.unsavedChanges?.value) {
            this.cancelChangeImage();
        }
    }
    async getImageAsBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result || undefined);
            };
            reader.onerror = err => {
                reject(err);
            };
        });
    }
    renderField(id, setting) {
        const { enableSaving, unsavedChanges, loading } = this.props;
        const { name, value, type, options, optionLabels = {}, isOverridden, defVal, ariaName, } = setting;
        const a11yProps = unsavedChanges
            ? {
                'aria-label': ariaName,
                'aria-describedby': id,
            }
            : {
                'aria-label': ariaName,
            };
        const currentValue = unsavedChanges
            ? unsavedChanges.value
            : exports.getEditableValue(type, value, defVal);
        switch (type) {
            case 'boolean':
                return (react_1.default.createElement(eui_1.EuiSwitch, Object.assign({ label: !!currentValue ? (react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.onLabel", defaultMessage: "On" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.offLabel", defaultMessage: "Off" })), checked: !!currentValue, onChange: this.onFieldChangeSwitch, disabled: loading || isOverridden || !enableSaving, "data-test-subj": `advancedSetting-editField-${name}` }, a11yProps)));
            case 'markdown':
            case 'json':
                return (react_1.default.createElement("div", { "data-test-subj": `advancedSetting-editField-${name}` },
                    react_1.default.createElement(eui_1.EuiCodeEditor, Object.assign({}, a11yProps, { mode: type, theme: "textmate", value: currentValue, onChange: this.onCodeEditorChange, width: "100%", height: "auto", minLines: 6, maxLines: 30, isReadOnly: isOverridden || !enableSaving, setOptions: {
                            showLineNumbers: false,
                            tabSize: 2,
                        }, editorProps: {
                            $blockScrolling: Infinity,
                        }, showGutter: false }))));
            case 'image':
                const changeImage = unsavedChanges?.changeImage;
                if (!lib_1.isDefaultValue(setting) && !changeImage) {
                    return react_1.default.createElement(eui_1.EuiImage, Object.assign({}, a11yProps, { allowFullScreen: true, url: value, alt: name }));
                }
                else {
                    return (react_1.default.createElement(eui_1.EuiFilePicker, { disabled: loading || isOverridden || !enableSaving, onChange: this.onImageChange, accept: ".jpg,.jpeg,.png", ref: this.changeImageForm, fullWidth: true, "data-test-subj": `advancedSetting-editField-${name}` }));
                }
            case 'select':
                return (react_1.default.createElement(eui_1.EuiSelect, Object.assign({}, a11yProps, { value: currentValue, options: options.map(option => {
                        return {
                            text: optionLabels.hasOwnProperty(option) ? optionLabels[option] : option,
                            value: option,
                        };
                    }), onChange: this.onFieldChangeEvent, isLoading: loading, disabled: loading || isOverridden || !enableSaving, fullWidth: true, "data-test-subj": `advancedSetting-editField-${name}` })));
            case 'number':
                return (react_1.default.createElement(eui_1.EuiFieldNumber, Object.assign({}, a11yProps, { value: currentValue, onChange: this.onFieldChangeEvent, isLoading: loading, disabled: loading || isOverridden || !enableSaving, fullWidth: true, "data-test-subj": `advancedSetting-editField-${name}` })));
            default:
                return (react_1.default.createElement(eui_1.EuiFieldText, Object.assign({}, a11yProps, { value: currentValue, onChange: this.onFieldChangeEvent, isLoading: loading, disabled: loading || isOverridden || !enableSaving, fullWidth: true, "data-test-subj": `advancedSetting-editField-${name}` })));
        }
    }
    renderLabel(setting) {
        return setting.name;
    }
    renderHelpText(setting) {
        if (setting.isOverridden) {
            return (react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.helpText", defaultMessage: "This setting is overridden by the Kibana server and can not be changed." })));
        }
        const canUpdateSetting = this.props.enableSaving;
        const defaultLink = this.renderResetToDefaultLink(setting);
        const imageLink = this.renderChangeImageLink(setting);
        if (canUpdateSetting && (defaultLink || imageLink)) {
            return (react_1.default.createElement("span", null,
                defaultLink,
                imageLink));
        }
        return null;
    }
    renderTitle(setting) {
        const { unsavedChanges } = this.props;
        const isInvalid = unsavedChanges?.isInvalid;
        const unsavedIconLabel = unsavedChanges
            ? isInvalid
                ? i18n_1.i18n.translate('advancedSettings.field.invalidIconLabel', {
                    defaultMessage: 'Invalid',
                })
                : i18n_1.i18n.translate('advancedSettings.field.unsavedIconLabel', {
                    defaultMessage: 'Unsaved',
                })
            : undefined;
        return (react_1.default.createElement("h3", null,
            react_1.default.createElement("span", { className: "mgtAdvancedSettings__fieldTitle" }, setting.displayName || setting.name),
            setting.isCustom ? (react_1.default.createElement(eui_1.EuiIconTip, { type: "asterisk", color: "primary", "aria-label": i18n_1.i18n.translate('advancedSettings.field.customSettingAriaLabel', {
                    defaultMessage: 'Custom setting',
                }), content: react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.customSettingTooltip", defaultMessage: "Custom setting" }) })) : (''),
            unsavedChanges ? (react_1.default.createElement(eui_1.EuiIconTip, { anchorClassName: "mgtAdvancedSettings__fieldTitleUnsavedIcon", type: isInvalid ? 'alert' : 'dot', color: isInvalid ? 'danger' : 'warning', "aria-label": unsavedIconLabel, content: unsavedIconLabel })) : ('')));
    }
    renderDescription(setting) {
        let description;
        let deprecation;
        if (setting.deprecation) {
            const links = this.props.dockLinks;
            deprecation = (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiToolTip, { content: setting.deprecation.message },
                    react_1.default.createElement(eui_1.EuiBadge, { color: "warning", onClick: () => {
                            window.open(links.management[setting.deprecation.docLinksKey], '_blank');
                        }, onClickAriaLabel: i18n_1.i18n.translate('advancedSettings.field.deprecationClickAreaLabel', {
                            defaultMessage: 'Click to view deprecation documentation for {settingName}.',
                            values: {
                                settingName: setting.name,
                            },
                        }) }, "Deprecated")),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
        }
        if (react_1.default.isValidElement(setting.description)) {
            description = setting.description;
        }
        else {
            description = (react_1.default.createElement("div", { 
                /*
                 * Justification for dangerouslySetInnerHTML:
                 * Setting description may contain formatting and links to documentation.
                 */
                dangerouslySetInnerHTML: { __html: setting.description || '' } }));
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            deprecation,
            description,
            this.renderDefaultValue(setting)));
    }
    renderDefaultValue(setting) {
        const { type, defVal, optionLabels } = setting;
        if (lib_1.isDefaultValue(setting)) {
            return;
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiText, { size: "xs" }, type === 'json' ? (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.defaultValueTypeJsonText", defaultMessage: "Default: {value}", values: {
                        value: (react_1.default.createElement(eui_1.EuiCodeBlock, { language: "json", paddingSize: "s", overflowHeight: defVal.length >= 500 ? 300 : undefined }, this.getDisplayedDefaultValue(type, defVal))),
                    } }))) : (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.defaultValueText", defaultMessage: "Default: {value}", values: {
                        value: (react_1.default.createElement(eui_1.EuiCode, null, this.getDisplayedDefaultValue(type, defVal, optionLabels))),
                    } }))))));
    }
    renderResetToDefaultLink(setting) {
        const { defVal, ariaName, name } = setting;
        if (defVal === this.props.unsavedChanges?.value ||
            lib_1.isDefaultValue(setting) ||
            this.props.loading) {
            return;
        }
        return (react_1.default.createElement("span", null,
            react_1.default.createElement(eui_1.EuiLink, { "aria-label": i18n_1.i18n.translate('advancedSettings.field.resetToDefaultLinkAriaLabel', {
                    defaultMessage: 'Reset {ariaName} to default',
                    values: {
                        ariaName,
                    },
                }), onClick: this.resetField, "data-test-subj": `advancedSetting-resetField-${name}` },
                react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.resetToDefaultLinkText", defaultMessage: "Reset to default" })),
            "\u00A0\u00A0\u00A0"));
    }
    renderChangeImageLink(setting) {
        const changeImage = this.props.unsavedChanges?.changeImage;
        const { type, value, ariaName, name } = setting;
        if (type !== 'image' || !value || changeImage) {
            return;
        }
        return (react_1.default.createElement("span", null,
            react_1.default.createElement(eui_1.EuiLink, { "aria-label": i18n_1.i18n.translate('advancedSettings.field.changeImageLinkAriaLabel', {
                    defaultMessage: 'Change {ariaName}',
                    values: {
                        ariaName,
                    },
                }), onClick: this.changeImage, "data-test-subj": `advancedSetting-changeImage-${name}` },
                react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.field.changeImageLinkText", defaultMessage: "Change image" }))));
    }
    render() {
        const { setting, unsavedChanges } = this.props;
        const error = unsavedChanges?.error;
        const isInvalid = unsavedChanges?.isInvalid;
        const className = classnames_1.default('mgtAdvancedSettings__field', {
            'mgtAdvancedSettings__field--unsaved': unsavedChanges,
            'mgtAdvancedSettings__field--invalid': isInvalid,
        });
        const id = setting.name;
        return (react_1.default.createElement(eui_1.EuiDescribedFormGroup, { className: className, title: this.renderTitle(setting), description: this.renderDescription(setting), fullWidth: true },
            react_1.default.createElement(eui_1.EuiFormRow, { isInvalid: isInvalid, error: error, label: this.renderLabel(setting), helpText: this.renderHelpText(setting), className: "mgtAdvancedSettings__fieldRow", hasChildLabel: setting.type !== 'boolean', fullWidth: true },
                react_1.default.createElement(react_1.default.Fragment, null,
                    this.renderField(id, setting),
                    unsavedChanges && (react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
                        react_1.default.createElement("p", { id: id }, unsavedChanges.error
                            ? unsavedChanges.error
                            : i18n_1.i18n.translate('advancedSettings.field.settingIsUnsaved', {
                                defaultMessage: 'Setting is currently not saved.',
                            }))))))));
    }
}
exports.Field = Field;
