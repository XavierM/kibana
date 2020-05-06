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
const types_1 = require("../types");
const errors_1 = require("../errors");
exports.ACTION_EDIT_PANEL = 'editPanel';
class EditPanelAction {
    constructor(getEmbeddableFactory, application) {
        this.getEmbeddableFactory = getEmbeddableFactory;
        this.application = application;
        this.type = exports.ACTION_EDIT_PANEL;
        this.id = exports.ACTION_EDIT_PANEL;
        this.order = 15;
    }
    getDisplayName({ embeddable }) {
        const factory = this.getEmbeddableFactory(embeddable.type);
        if (!factory) {
            throw new errors_1.EmbeddableFactoryNotFoundError(embeddable.type);
        }
        return i18n_1.i18n.translate('embeddableApi.panel.editPanel.displayName', {
            defaultMessage: 'Edit {value}',
            values: {
                value: factory.getDisplayName(),
            },
        });
    }
    getIconType() {
        return 'pencil';
    }
    async isCompatible({ embeddable }) {
        const canEditEmbeddable = Boolean(embeddable &&
            embeddable.getOutput().editable &&
            (embeddable.getOutput().editUrl ||
                (embeddable.getOutput().editApp && embeddable.getOutput().editPath)));
        const inDashboardEditMode = embeddable.getInput().viewMode === types_1.ViewMode.EDIT;
        return Boolean(canEditEmbeddable && inDashboardEditMode);
    }
    async execute(context) {
        const appTarget = this.getAppTarget(context);
        if (appTarget) {
            await this.application.navigateToApp(appTarget.app, { path: appTarget.path });
            return;
        }
        const href = await this.getHref(context);
        if (href) {
            window.location.href = href;
            return;
        }
    }
    getAppTarget({ embeddable }) {
        const app = embeddable ? embeddable.getOutput().editApp : undefined;
        const path = embeddable ? embeddable.getOutput().editPath : undefined;
        if (app && path) {
            return { app, path };
        }
    }
    async getHref({ embeddable }) {
        const editUrl = embeddable ? embeddable.getOutput().editUrl : undefined;
        return editUrl ? editUrl : '';
    }
}
exports.EditPanelAction = EditPanelAction;
