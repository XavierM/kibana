"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const constants = tslib_1.__importStar(require("./dashboard_empty_screen_constants"));
function DashboardEmptyScreen({ showLinkToVisualize, onLinkClick, onVisualizeClick, uiSettings, http, isReadonlyMode, }) {
    const IS_DARK_THEME = uiSettings.get('theme:darkMode');
    const emptyStateGraphicURL = IS_DARK_THEME
        ? '/plugins/kibana/home/assets/welcome_graphic_dark_2x.png'
        : '/plugins/kibana/home/assets/welcome_graphic_light_2x.png';
    const linkToVisualizeParagraph = (react_1.default.createElement("p", { "data-test-subj": "linkToVisualizeParagraph" },
        react_1.default.createElement(eui_1.EuiButton, { iconSide: "left", size: "s", iconType: "plusInCircle", onClick: onVisualizeClick, "data-test-subj": "addVisualizationButton", "aria-label": constants.createNewVisualizationButtonAriaLabel }, constants.createNewVisualizationButton)));
    const paragraph = (description1, description2, linkText, ariaLabel, dataTestSubj) => {
        return (react_1.default.createElement(eui_1.EuiText, { size: "m", color: "subdued" },
            react_1.default.createElement("p", null,
                description1,
                description1 && react_1.default.createElement("span", null, "\u00A0"),
                react_1.default.createElement(eui_1.EuiLink, { onClick: onLinkClick, "aria-label": ariaLabel, "data-test-subj": dataTestSubj || '' }, linkText),
                react_1.default.createElement("span", null, "\u00A0"),
                description2)));
    };
    const enterEditModeParagraph = paragraph(constants.howToStartWorkingOnNewDashboardDescription1, constants.howToStartWorkingOnNewDashboardDescription2, constants.howToStartWorkingOnNewDashboardEditLinkText, constants.howToStartWorkingOnNewDashboardEditLinkAriaLabel);
    const enterViewModeParagraph = paragraph(null, constants.addNewVisualizationDescription, constants.addExistingVisualizationLinkText, constants.addExistingVisualizationLinkAriaLabel);
    const page = (mainText, showAdditionalParagraph, additionalText) => {
        return (react_1.default.createElement(eui_1.EuiPage, { className: "dshStartScreen", restrictWidth: "500px" },
            react_1.default.createElement(eui_1.EuiPageBody, null,
                react_1.default.createElement(eui_1.EuiPageContent, { verticalPosition: "center", horizontalPosition: "center", paddingSize: "none", className: "dshStartScreen__pageContent" },
                    react_1.default.createElement(eui_1.EuiImage, { url: http.basePath.prepend(emptyStateGraphicURL), alt: "" }),
                    react_1.default.createElement(eui_1.EuiText, { size: "m" },
                        react_1.default.createElement("p", { style: { fontWeight: 'bold' } }, mainText)),
                    additionalText ? (react_1.default.createElement(eui_1.EuiText, { size: "m", color: "subdued" }, additionalText)) : null,
                    showAdditionalParagraph ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                        react_1.default.createElement("div", { className: "dshStartScreen__panelDesc" }, enterEditModeParagraph))) : null))));
    };
    const readonlyMode = page(constants.emptyDashboardTitle, false, constants.emptyDashboardAdditionalPrivilege);
    const viewMode = page(constants.fillDashboardTitle, true);
    const editMode = (react_1.default.createElement("div", { "data-test-subj": "emptyDashboardWidget", className: "dshEmptyWidget" },
        enterViewModeParagraph,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
        linkToVisualizeParagraph));
    const actionableMode = showLinkToVisualize ? editMode : viewMode;
    return react_1.default.createElement(react_2.I18nProvider, null, isReadonlyMode ? readonlyMode : actionableMode);
}
exports.DashboardEmptyScreen = DashboardEmptyScreen;
