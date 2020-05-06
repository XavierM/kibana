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
const ui_actions_plugin_1 = require("../../ui_actions_plugin");
const embeddable_1 = require("../embeddable");
exports.ACTION_EXPAND_PANEL = 'togglePanel';
function isDashboard(embeddable) {
    return embeddable.type === embeddable_1.DASHBOARD_CONTAINER_TYPE;
}
function isExpanded(embeddable) {
    if (!embeddable.parent || !isDashboard(embeddable.parent)) {
        throw new ui_actions_plugin_1.IncompatibleActionError();
    }
    return embeddable.id === embeddable.parent.getInput().expandedPanelId;
}
class ExpandPanelAction {
    constructor() {
        this.type = exports.ACTION_EXPAND_PANEL;
        this.id = exports.ACTION_EXPAND_PANEL;
        this.order = 7;
    }
    getDisplayName({ embeddable }) {
        if (!embeddable.parent || !isDashboard(embeddable.parent)) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        return isExpanded(embeddable)
            ? i18n_1.i18n.translate('dashboard.actions.toggleExpandPanelMenuItem.expandedDisplayName', {
                defaultMessage: 'Minimize',
            })
            : i18n_1.i18n.translate('dashboard.actions.toggleExpandPanelMenuItem.notExpandedDisplayName', {
                defaultMessage: 'Full screen',
            });
    }
    getIconType({ embeddable }) {
        if (!embeddable.parent || !isDashboard(embeddable.parent)) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        // TODO: use 'minimize' when an eui-icon of such is available.
        return isExpanded(embeddable) ? 'expand' : 'expand';
    }
    async isCompatible({ embeddable }) {
        return Boolean(embeddable.parent && isDashboard(embeddable.parent));
    }
    async execute({ embeddable }) {
        if (!embeddable.parent || !isDashboard(embeddable.parent)) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        const newValue = isExpanded(embeddable) ? undefined : embeddable.id;
        embeddable.parent.updateInput({
            expandedPanelId: newValue,
        });
    }
}
exports.ExpandPanelAction = ExpandPanelAction;
