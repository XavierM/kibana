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
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../kibana_react/public");
const lib_1 = require("../../lib");
const field_1 = require("../field");
const NAV_IS_LOCKED_KEY = 'core.chrome.isLocked';
class Form extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            unsavedChanges: {},
            loading: false,
        };
        this.getSettingByKey = (key) => {
            return Object.values(this.props.settings)
                .flat()
                .find(el => el.name === key);
        };
        this.getCountOfUnsavedChanges = () => {
            return Object.keys(this.state.unsavedChanges).length;
        };
        this.getCountOfHiddenUnsavedChanges = () => {
            const shownSettings = Object.values(this.props.visibleSettings)
                .flat()
                .map(setting => setting.name);
            return Object.keys(this.state.unsavedChanges).filter(key => !shownSettings.includes(key))
                .length;
        };
        this.areChangesInvalid = () => {
            const { unsavedChanges } = this.state;
            return Object.values(unsavedChanges).some(({ isInvalid }) => isInvalid);
        };
        this.handleChange = (key, change) => {
            const setting = this.getSettingByKey(key);
            if (!setting) {
                return;
            }
            const { type, defVal, value } = setting;
            const savedValue = field_1.getEditableValue(type, value, defVal);
            if (change.value === savedValue) {
                return this.clearChange(key);
            }
            this.setState({
                unsavedChanges: {
                    ...this.state.unsavedChanges,
                    [key]: change,
                },
            });
        };
        this.clearChange = (key) => {
            if (!this.state.unsavedChanges[key]) {
                return;
            }
            const unsavedChanges = { ...this.state.unsavedChanges };
            delete unsavedChanges[key];
            this.setState({
                unsavedChanges,
            });
        };
        this.clearAllUnsaved = () => {
            this.setState({ unsavedChanges: {} });
        };
        this.saveAll = async () => {
            this.setLoading(true);
            const { unsavedChanges } = this.state;
            if (lodash_1.isEmpty(unsavedChanges)) {
                return;
            }
            const configToSave = {};
            let requiresReload = false;
            Object.entries(unsavedChanges).forEach(([name, { value }]) => {
                const setting = this.getSettingByKey(name);
                if (!setting) {
                    return;
                }
                const { defVal, type, requiresPageReload } = setting;
                let valueToSave = value;
                let equalsToDefault = false;
                switch (type) {
                    case 'array':
                        valueToSave = valueToSave.split(',').map((val) => val.trim());
                        equalsToDefault = valueToSave.join(',') === defVal.join(',');
                        break;
                    case 'json':
                        const isArray = Array.isArray(JSON.parse(defVal || '{}'));
                        valueToSave = valueToSave.trim();
                        valueToSave = valueToSave || (isArray ? '[]' : '{}');
                    default:
                        equalsToDefault = valueToSave === defVal;
                }
                if (requiresPageReload) {
                    requiresReload = true;
                }
                configToSave[name] = equalsToDefault ? null : valueToSave;
            });
            try {
                await this.props.save(configToSave);
                this.clearAllUnsaved();
                if (requiresReload) {
                    this.renderPageReloadToast();
                }
            }
            catch (e) {
                this.props.toasts.addDanger(i18n_1.i18n.translate('advancedSettings.form.saveErrorMessage', {
                    defaultMessage: 'Unable to save',
                }));
            }
            this.setLoading(false);
        };
        this.renderPageReloadToast = () => {
            this.props.toasts.add({
                title: i18n_1.i18n.translate('advancedSettings.form.requiresPageReloadToastDescription', {
                    defaultMessage: 'One or more settings require you to reload the page to take effect.',
                }),
                text: public_1.toMountPoint(react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", gutterSize: "s" },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButton, { size: "s", onClick: () => window.location.reload() }, i18n_1.i18n.translate('advancedSettings.form.requiresPageReloadToastButtonLabel', {
                                defaultMessage: 'Reload page',
                            })))))),
                color: 'success',
            });
        };
        this.renderCountOfUnsaved = () => {
            const unsavedCount = this.getCountOfUnsavedChanges();
            const hiddenUnsavedCount = this.getCountOfHiddenUnsavedChanges();
            return (react_1.default.createElement(eui_1.EuiTextColor, { className: "mgtAdvancedSettingsForm__unsavedCountMessage", color: "ghost" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.form.countOfSettingsChanged", defaultMessage: "{unsavedCount} unsaved {unsavedCount, plural,\n              one {setting}\n              other {settings}\n            }{hiddenCount, plural,\n              =0 {}\n              other {, # hidden}\n            }", values: {
                        unsavedCount,
                        hiddenCount: hiddenUnsavedCount,
                    } })));
        };
        this.renderBottomBar = () => {
            const areChangesInvalid = this.areChangesInvalid();
            const bottomBarClasses = classnames_1.default('mgtAdvancedSettingsForm__bottomBar', {
                'mgtAdvancedSettingsForm__bottomBar--pushForNav': localStorage.getItem(NAV_IS_LOCKED_KEY) === 'true',
            });
            return (react_1.default.createElement(eui_1.EuiBottomBar, { className: bottomBarClasses, "data-test-subj": "advancedSetting-bottomBar" },
                react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "center", responsive: false, gutterSize: "s" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "mgtAdvancedSettingsForm__unsavedCount" },
                        react_1.default.createElement("p", { id: "aria-describedby.countOfUnsavedSettings" }, this.renderCountOfUnsaved())),
                    react_1.default.createElement(eui_1.EuiFlexItem, null),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "ghost", size: "s", iconType: "cross", onClick: this.clearAllUnsaved, "aria-describedby": "aria-describedby.countOfUnsavedSettings", "data-test-subj": "advancedSetting-cancelButton" }, i18n_1.i18n.translate('advancedSettings.form.cancelButtonLabel', {
                            defaultMessage: 'Cancel changes',
                        }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiToolTip, { content: areChangesInvalid &&
                                i18n_1.i18n.translate('advancedSettings.form.saveButtonTooltipWithInvalidChanges', {
                                    defaultMessage: 'Fix invalid settings before saving.',
                                }) },
                            react_1.default.createElement(eui_1.EuiButton, { className: "mgtAdvancedSettingsForm__button", disabled: areChangesInvalid, color: "secondary", fill: true, size: "s", iconType: "check", onClick: this.saveAll, "aria-describedby": "aria-describedby.countOfUnsavedSettings", isLoading: this.state.loading, "data-test-subj": "advancedSetting-saveButton" }, i18n_1.i18n.translate('advancedSettings.form.saveButtonLabel', {
                                defaultMessage: 'Save changes',
                            })))))));
        };
    }
    setLoading(loading) {
        this.setState({
            loading,
        });
    }
    renderClearQueryLink(totalSettings, currentSettings) {
        const { clearQuery } = this.props;
        if (totalSettings !== currentSettings) {
            return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement("em", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.form.searchResultText", defaultMessage: "Search terms are hiding {settingsCount} settings {clearSearch}", values: {
                            settingsCount: totalSettings - currentSettings,
                            clearSearch: (react_1.default.createElement(eui_1.EuiLink, { onClick: clearQuery },
                                react_1.default.createElement("em", null,
                                    react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.form.clearSearchResultText", defaultMessage: "(clear search)" })))),
                        } }))));
        }
        return null;
    }
    renderCategory(category, settings, totalSettings) {
        return (react_1.default.createElement(react_1.Fragment, { key: category },
            react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
                react_1.default.createElement(eui_1.EuiForm, null,
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "baseline" },
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                react_1.default.createElement("h2", null, lib_1.getCategoryName(category))),
                            this.renderClearQueryLink(totalSettings, settings.length))),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    settings.map(setting => {
                        return (react_1.default.createElement(field_1.Field, { key: setting.name, setting: setting, handleChange: this.handleChange, unsavedChanges: this.state.unsavedChanges[setting.name], clearChange: this.clearChange, enableSaving: this.props.enableSaving, dockLinks: this.props.dockLinks, toasts: this.props.toasts }));
                    }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" })));
    }
    maybeRenderNoSettings(clearQuery) {
        if (this.props.showNoResultsMessage) {
            return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.form.noSearchResultText", defaultMessage: "No settings found {clearSearch}", values: {
                        clearSearch: (react_1.default.createElement(eui_1.EuiLink, { onClick: clearQuery },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "advancedSettings.form.clearNoSearchResultText", defaultMessage: "(clear search)" }))),
                    } })));
        }
        return null;
    }
    render() {
        const { unsavedChanges } = this.state;
        const { visibleSettings, categories, categoryCounts, clearQuery } = this.props;
        const currentCategories = [];
        categories.forEach(category => {
            if (visibleSettings[category] && visibleSettings[category].length) {
                currentCategories.push(category);
            }
        });
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement("div", null, currentCategories.length
                ? currentCategories.map(category => {
                    return this.renderCategory(category, visibleSettings[category], categoryCounts[category]);
                })
                : this.maybeRenderNoSettings(clearQuery)),
            !lodash_1.isEmpty(unsavedChanges) && this.renderBottomBar()));
    }
}
exports.Form = Form;
