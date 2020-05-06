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
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_2 = require("@kbn/i18n/react");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const embeddable_plugin_1 = require("../../embeddable_plugin");
const dashboard_constants_1 = require("./dashboard_constants");
const panel_1 = require("./panel");
const dashboard_viewport_1 = require("./viewport/dashboard_viewport");
const public_1 = require("../../../../kibana_react/public");
const placeholder_1 = require("./placeholder");
class DashboardContainer extends embeddable_plugin_1.Container {
    constructor(initialInput, options, parent) {
        super({
            panels: {},
            isFullScreenMode: false,
            filters: [],
            useMargins: true,
            ...initialInput,
        }, { embeddableLoaded: {} }, options.embeddable.getEmbeddableFactory, parent);
        this.options = options;
        this.type = dashboard_constants_1.DASHBOARD_CONTAINER_TYPE;
    }
    createNewPanelState(factory, partial = {}) {
        const panelState = super.createNewPanelState(factory, partial);
        return panel_1.createPanelState(panelState, this.input.panels);
    }
    showPlaceholderUntil(newStateComplete, placementMethod, placementArgs) {
        const originalPanelState = {
            type: placeholder_1.PLACEHOLDER_EMBEDDABLE,
            explicitInput: {
                id: uuid_1.default.v4(),
                disabledActions: [
                    'ACTION_CUSTOMIZE_PANEL',
                    'CUSTOM_TIME_RANGE',
                    'clonePanel',
                    'replacePanel',
                    'togglePanel',
                ],
            },
        };
        const placeholderPanelState = panel_1.createPanelState(originalPanelState, this.input.panels, placementMethod, placementArgs);
        this.updateInput({
            panels: {
                ...this.input.panels,
                [placeholderPanelState.explicitInput.id]: placeholderPanelState,
            },
        });
        newStateComplete.then((newPanelState) => {
            const finalPanels = { ...this.input.panels };
            delete finalPanels[placeholderPanelState.explicitInput.id];
            const newPanelId = newPanelState.explicitInput?.id
                ? newPanelState.explicitInput.id
                : uuid_1.default.v4();
            finalPanels[newPanelId] = {
                ...placeholderPanelState,
                ...newPanelState,
                gridData: {
                    ...placeholderPanelState.gridData,
                    i: newPanelId,
                },
                explicitInput: {
                    ...newPanelState.explicitInput,
                    id: newPanelId,
                },
            };
            this.updateInput({
                panels: finalPanels,
            });
        });
    }
    render(dom) {
        react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(public_1.KibanaContextProvider, { services: this.options },
                react_1.default.createElement(dashboard_viewport_1.DashboardViewport, { renderEmpty: this.renderEmpty, container: this }))), dom);
    }
    getInheritedInput(id) {
        const { viewMode, refreshConfig, timeRange, query, hidePanelTitles, filters } = this.input;
        return {
            filters,
            hidePanelTitles,
            query,
            timeRange,
            refreshConfig,
            viewMode,
            id,
        };
    }
}
exports.DashboardContainer = DashboardContainer;
