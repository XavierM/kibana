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
const i18n_1 = require("@kbn/i18n");
const embeddable_plugin_1 = require("../../embeddable_plugin");
const top_nav_ids_1 = require("./top_nav_ids");
/**
 * @param actions - A mapping of TopNavIds to an action function that should run when the
 * corresponding top nav is clicked.
 * @param hideWriteControls if true, does not include any controls that allow editing or creating objects.
 * @return an array of objects for a top nav configuration, based on the mode.
 */
function getTopNavConfig(dashboardMode, actions, hideWriteControls) {
    switch (dashboardMode) {
        case embeddable_plugin_1.ViewMode.VIEW:
            return hideWriteControls
                ? [
                    getFullScreenConfig(actions[top_nav_ids_1.TopNavIds.FULL_SCREEN]),
                    getShareConfig(actions[top_nav_ids_1.TopNavIds.SHARE]),
                ]
                : [
                    getFullScreenConfig(actions[top_nav_ids_1.TopNavIds.FULL_SCREEN]),
                    getShareConfig(actions[top_nav_ids_1.TopNavIds.SHARE]),
                    getCloneConfig(actions[top_nav_ids_1.TopNavIds.CLONE]),
                    getEditConfig(actions[top_nav_ids_1.TopNavIds.ENTER_EDIT_MODE]),
                ];
        case embeddable_plugin_1.ViewMode.EDIT:
            return [
                getCreateNewConfig(actions[top_nav_ids_1.TopNavIds.VISUALIZE]),
                getSaveConfig(actions[top_nav_ids_1.TopNavIds.SAVE]),
                getViewConfig(actions[top_nav_ids_1.TopNavIds.EXIT_EDIT_MODE]),
                getAddConfig(actions[top_nav_ids_1.TopNavIds.ADD_EXISTING]),
                getOptionsConfig(actions[top_nav_ids_1.TopNavIds.OPTIONS]),
                getShareConfig(actions[top_nav_ids_1.TopNavIds.SHARE]),
            ];
        default:
            return [];
    }
}
exports.getTopNavConfig = getTopNavConfig;
function getFullScreenConfig(action) {
    return {
        id: 'full-screen',
        label: i18n_1.i18n.translate('dashboard.topNave.fullScreenButtonAriaLabel', {
            defaultMessage: 'full screen',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.fullScreenConfigDescription', {
            defaultMessage: 'Full Screen Mode',
        }),
        testId: 'dashboardFullScreenMode',
        run: action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getEditConfig(action) {
    return {
        id: 'edit',
        label: i18n_1.i18n.translate('dashboard.topNave.editButtonAriaLabel', {
            defaultMessage: 'edit',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.editConfigDescription', {
            defaultMessage: 'Switch to edit mode',
        }),
        testId: 'dashboardEditMode',
        // We want to hide the "edit" button on small screens, since those have a responsive
        // layout, which is not tied to the grid anymore, so we cannot edit the grid on that screens.
        className: 'eui-hideFor--s eui-hideFor--xs',
        run: action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getSaveConfig(action) {
    return {
        id: 'save',
        label: i18n_1.i18n.translate('dashboard.topNave.saveButtonAriaLabel', {
            defaultMessage: 'save',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.saveConfigDescription', {
            defaultMessage: 'Save your dashboard',
        }),
        testId: 'dashboardSaveMenuItem',
        run: action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getViewConfig(action) {
    return {
        id: 'cancel',
        label: i18n_1.i18n.translate('dashboard.topNave.cancelButtonAriaLabel', {
            defaultMessage: 'cancel',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.viewConfigDescription', {
            defaultMessage: 'Cancel editing and switch to view-only mode',
        }),
        testId: 'dashboardViewOnlyMode',
        run: action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getCloneConfig(action) {
    return {
        id: 'clone',
        label: i18n_1.i18n.translate('dashboard.topNave.cloneButtonAriaLabel', {
            defaultMessage: 'clone',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.cloneConfigDescription', {
            defaultMessage: 'Create a copy of your dashboard',
        }),
        testId: 'dashboardClone',
        run: action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getAddConfig(action) {
    return {
        id: 'add',
        label: i18n_1.i18n.translate('dashboard.topNave.addButtonAriaLabel', {
            defaultMessage: 'add',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.addConfigDescription', {
            defaultMessage: 'Add a panel to the dashboard',
        }),
        testId: 'dashboardAddPanelButton',
        run: action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getCreateNewConfig(action) {
    return {
        emphasize: true,
        iconType: 'plusInCircle',
        id: 'addNew',
        label: i18n_1.i18n.translate('dashboard.topNave.addNewButtonAriaLabel', {
            defaultMessage: 'Create new',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.addNewConfigDescription', {
            defaultMessage: 'Create a new panel on this dashboard',
        }),
        testId: 'dashboardAddNewPanelButton',
        run: action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getShareConfig(action) {
    return {
        id: 'share',
        label: i18n_1.i18n.translate('dashboard.topNave.shareButtonAriaLabel', {
            defaultMessage: 'share',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.shareConfigDescription', {
            defaultMessage: 'Share Dashboard',
        }),
        testId: 'shareTopNavButton',
        run: action,
        // disable the Share button if no action specified
        disableButton: !action,
    };
}
/**
 * @returns {kbnTopNavConfig}
 */
function getOptionsConfig(action) {
    return {
        id: 'options',
        label: i18n_1.i18n.translate('dashboard.topNave.optionsButtonAriaLabel', {
            defaultMessage: 'options',
        }),
        description: i18n_1.i18n.translate('dashboard.topNave.optionsConfigDescription', {
            defaultMessage: 'Options',
        }),
        testId: 'dashboardOptionsButton',
        run: action,
    };
}
