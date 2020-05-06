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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
exports.PanelOptionsMenu = ({ panelDescriptor, close, isViewMode, title, }) => {
    const [open, setOpen] = react_1.useState(false);
    react_1.useEffect(() => {
        if (!close)
            setOpen(false);
    }, [close]);
    const handleContextMenuClick = () => {
        setOpen(isOpen => !isOpen);
    };
    const handlePopoverClose = () => {
        setOpen(false);
    };
    const enhancedAriaLabel = i18n_1.i18n.translate('embeddableApi.panel.optionsMenu.panelOptionsButtonEnhancedAriaLabel', {
        defaultMessage: 'Panel options for {title}',
        values: { title },
    });
    const ariaLabelWithoutTitle = i18n_1.i18n.translate('embeddableApi.panel.optionsMenu.panelOptionsButtonAriaLabel', {
        defaultMessage: 'Panel options',
    });
    const button = (react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: isViewMode ? 'boxesHorizontal' : 'gear', color: "text", className: "embPanel__optionsMenuButton", "aria-label": title ? enhancedAriaLabel : ariaLabelWithoutTitle, "data-test-subj": "embeddablePanelToggleMenuIcon", onClick: handleContextMenuClick }));
    return (react_1.default.createElement(eui_1.EuiPopover, { button: button, isOpen: open, closePopover: handlePopoverClose, panelPaddingSize: "none", anchorPosition: "downRight", "data-test-subj": open ? 'embeddablePanelContextMenuOpen' : 'embeddablePanelContextMenuClosed', withTitle: true },
        react_1.default.createElement(eui_1.EuiContextMenu, { initialPanelId: "mainMenu", panels: panelDescriptor ? [panelDescriptor] : [] })));
};
