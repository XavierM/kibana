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
const i18n_1 = require("@kbn/i18n");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const ui_actions_plugin_1 = require("../../ui_actions_plugin");
const embeddable_plugin_1 = require("../../embeddable_plugin");
const public_1 = require("../../../../embeddable/public");
const dashboard_panel_placement_1 = require("../embeddable/panel/dashboard_panel_placement");
const __1 = require("..");
exports.ACTION_CLONE_PANEL = 'clonePanel';
class ClonePanelAction {
    constructor(core) {
        this.core = core;
        this.type = exports.ACTION_CLONE_PANEL;
        this.id = exports.ACTION_CLONE_PANEL;
        this.order = 11;
    }
    getDisplayName({ embeddable }) {
        if (!embeddable.getRoot() || !embeddable.getRoot().isContainer) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        return i18n_1.i18n.translate('dashboard.panel.clonePanel', {
            defaultMessage: 'Clone panel',
        });
    }
    getIconType({ embeddable }) {
        if (!embeddable.getRoot() || !embeddable.getRoot().isContainer) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        return 'copy';
    }
    async isCompatible({ embeddable }) {
        return Boolean(embeddable.getInput()?.viewMode !== embeddable_plugin_1.ViewMode.VIEW &&
            embeddable.getRoot() &&
            embeddable.getRoot().isContainer &&
            embeddable.getRoot().type === __1.DASHBOARD_CONTAINER_TYPE);
    }
    async execute({ embeddable }) {
        if (!embeddable.getRoot() || !embeddable.getRoot().isContainer) {
            throw new ui_actions_plugin_1.IncompatibleActionError();
        }
        const dashboard = embeddable.getRoot();
        const panelToClone = dashboard.getInput().panels[embeddable.id];
        if (!panelToClone) {
            throw new public_1.PanelNotFoundError();
        }
        dashboard.showPlaceholderUntil(this.cloneEmbeddable(panelToClone, embeddable.type), dashboard_panel_placement_1.placePanelBeside, {
            width: panelToClone.gridData.w,
            height: panelToClone.gridData.h,
            currentPanels: dashboard.getInput().panels,
            placeBesideId: panelToClone.explicitInput.id,
        });
    }
    async getUniqueTitle(rawTitle, embeddableType) {
        const clonedTag = i18n_1.i18n.translate('dashboard.panel.title.clonedTag', {
            defaultMessage: 'copy',
        });
        const cloneRegex = new RegExp(`\\(${clonedTag}\\)`, 'g');
        const cloneNumberRegex = new RegExp(`\\(${clonedTag} [0-9]+\\)`, 'g');
        const baseTitle = rawTitle
            .replace(cloneNumberRegex, '')
            .replace(cloneRegex, '')
            .trim();
        const similarSavedObjects = await this.core.savedObjects.client.find({
            type: embeddableType,
            perPage: 0,
            fields: ['title'],
            searchFields: ['title'],
            search: `"${baseTitle}"`,
        });
        const similarBaseTitlesCount = similarSavedObjects.total - 1;
        return similarBaseTitlesCount <= 0
            ? baseTitle + ` (${clonedTag})`
            : baseTitle + ` (${clonedTag} ${similarBaseTitlesCount})`;
    }
    async cloneEmbeddable(panelToClone, embeddableType) {
        const panelState = {
            type: embeddableType,
            explicitInput: {
                ...panelToClone.explicitInput,
                id: uuid_1.default.v4(),
            },
        };
        let newTitle = '';
        if (panelToClone.explicitInput.savedObjectId) {
            // Fetch existing saved object
            const savedObjectToClone = await this.core.savedObjects.client.get(embeddableType, panelToClone.explicitInput.savedObjectId);
            // Clone the saved object
            newTitle = await this.getUniqueTitle(savedObjectToClone.attributes.title, embeddableType);
            const clonedSavedObject = await this.core.savedObjects.client.create(embeddableType, {
                ..._.cloneDeep(savedObjectToClone.attributes),
                title: newTitle,
            }, { references: _.cloneDeep(savedObjectToClone.references) });
            panelState.explicitInput.savedObjectId = clonedSavedObject.id;
        }
        this.core.notifications.toasts.addSuccess({
            title: i18n_1.i18n.translate('dashboard.panel.clonedToast', {
                defaultMessage: 'Cloned panel',
            }),
            'data-test-subj': 'addObjectToContainerSuccess',
        });
        return panelState;
    }
}
exports.ClonePanelAction = ClonePanelAction;
