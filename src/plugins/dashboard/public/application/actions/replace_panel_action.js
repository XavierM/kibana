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
const embeddable_1 = require("../embeddable");
const ui_actions_plugin_1 = require("../../ui_actions_plugin");
const open_replace_panel_flyout_1 = require("./open_replace_panel_flyout");
exports.ACTION_REPLACE_PANEL = 'replacePanel';
function isDashboard(embeddable) {
    return embeddable.type === embeddable_1.DASHBOARD_CONTAINER_TYPE;
}
class ReplacePanelAction {
    constructor(core, savedobjectfinder, notifications, getEmbeddableFactories) {
        this.core = core;
        this.savedobjectfinder = savedobjectfinder;
        this.notifications = notifications;
        this.getEmbeddableFactories = getEmbeddableFactories;
        this.type = exports.ACTION_REPLACE_PANEL;
        this.id = exports.ACTION_REPLACE_PANEL;
        this.order = 11;
    }
    getDisplayName({ embeddable }) {
        if (!embeddable.parent || !isDashboard(embeddable.parent)) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        return i18n_1.i18n.translate('dashboard.panel.removePanel.replacePanel', {
            defaultMessage: 'Replace panel',
        });
    }
    getIconType({ embeddable }) {
        if (!embeddable.parent || !isDashboard(embeddable.parent)) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        return 'kqlOperand';
    }
    async isCompatible({ embeddable }) {
        if (embeddable.getInput().viewMode) {
            if (embeddable.getInput().viewMode === embeddable_plugin_1.ViewMode.VIEW) {
                return false;
            }
        }
        return Boolean(embeddable.parent && isDashboard(embeddable.parent));
    }
    async execute({ embeddable }) {
        if (!embeddable.parent || !isDashboard(embeddable.parent)) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        const view = embeddable;
        const dash = embeddable.parent;
        open_replace_panel_flyout_1.openReplacePanelFlyout({
            embeddable: dash,
            core: this.core,
            savedObjectFinder: this.savedobjectfinder,
            notifications: this.notifications,
            panelToRemove: view,
            getEmbeddableFactories: this.getEmbeddableFactories,
        });
    }
}
exports.ReplacePanelAction = ReplacePanelAction;
