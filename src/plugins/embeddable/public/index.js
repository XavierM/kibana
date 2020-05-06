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
require("./index.scss");
const plugin_1 = require("./plugin");
var lib_1 = require("./lib");
exports.ACTION_ADD_PANEL = lib_1.ACTION_ADD_PANEL;
exports.AddPanelAction = lib_1.AddPanelAction;
exports.ACTION_APPLY_FILTER = lib_1.ACTION_APPLY_FILTER;
exports.Container = lib_1.Container;
exports.CONTEXT_MENU_TRIGGER = lib_1.CONTEXT_MENU_TRIGGER;
exports.contextMenuTrigger = lib_1.contextMenuTrigger;
exports.ACTION_EDIT_PANEL = lib_1.ACTION_EDIT_PANEL;
exports.EditPanelAction = lib_1.EditPanelAction;
exports.Embeddable = lib_1.Embeddable;
exports.EmbeddableChildPanel = lib_1.EmbeddableChildPanel;
exports.EmbeddableFactoryNotFoundError = lib_1.EmbeddableFactoryNotFoundError;
exports.EmbeddableFactoryRenderer = lib_1.EmbeddableFactoryRenderer;
exports.EmbeddablePanel = lib_1.EmbeddablePanel;
exports.EmbeddableRoot = lib_1.EmbeddableRoot;
exports.ErrorEmbeddable = lib_1.ErrorEmbeddable;
exports.isErrorEmbeddable = lib_1.isErrorEmbeddable;
exports.openAddPanelFlyout = lib_1.openAddPanelFlyout;
exports.PANEL_BADGE_TRIGGER = lib_1.PANEL_BADGE_TRIGGER;
exports.panelBadgeTrigger = lib_1.panelBadgeTrigger;
exports.PanelNotFoundError = lib_1.PanelNotFoundError;
exports.ViewMode = lib_1.ViewMode;
exports.withEmbeddableSubscription = lib_1.withEmbeddableSubscription;
exports.isSavedObjectEmbeddableInput = lib_1.isSavedObjectEmbeddableInput;
function plugin(initializerContext) {
    return new plugin_1.EmbeddablePublicPlugin(initializerContext);
}
exports.plugin = plugin;
