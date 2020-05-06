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
const eui_1 = require("@elastic/eui");
const components_1 = require("../../components");
const public_1 = require("../../../../../kibana_react/public");
const console_editor_1 = require("./legacy/console_editor");
const services_1 = require("../../../services");
const contexts_1 = require("../../contexts");
const INITIAL_PANEL_WIDTH = 50;
const PANEL_MIN_WIDTH = '100px';
exports.Editor = react_1.memo(({ loading }) => {
    const { services: { storage }, } = contexts_1.useServicesContext();
    const { currentTextObject } = contexts_1.useEditorReadContext();
    const { requestInFlight } = contexts_1.useRequestReadContext();
    const [firstPanelWidth, secondPanelWidth] = storage.get(services_1.StorageKeys.WIDTH, [
        INITIAL_PANEL_WIDTH,
        INITIAL_PANEL_WIDTH,
    ]);
    const onPanelWidthChange = react_1.useCallback(lodash_1.debounce((widths) => {
        storage.set(services_1.StorageKeys.WIDTH, widths);
    }, 300), []);
    if (!currentTextObject)
        return null;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        requestInFlight ? (react_1.default.createElement("div", { className: "conApp__requestProgressBarContainer" },
            react_1.default.createElement(eui_1.EuiProgress, { size: "xs", color: "accent", position: "absolute" }))) : null,
        react_1.default.createElement(public_1.PanelsContainer, { onPanelWidthChange: onPanelWidthChange, resizerClassName: "conApp__resizer" },
            react_1.default.createElement(public_1.Panel, { style: { height: '100%', position: 'relative', minWidth: PANEL_MIN_WIDTH }, initialWidth: firstPanelWidth }, loading ? (react_1.default.createElement(components_1.EditorContentSpinner, null)) : (react_1.default.createElement(console_editor_1.Editor, { initialTextValue: currentTextObject.text }))),
            react_1.default.createElement(public_1.Panel, { style: { height: '100%', position: 'relative', minWidth: PANEL_MIN_WIDTH }, initialWidth: secondPanelWidth }, loading ? react_1.default.createElement(components_1.EditorContentSpinner, null) : react_1.default.createElement(console_editor_1.EditorOutput, null)))));
});
