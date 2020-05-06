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
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
function VegaActionsMenu({ formatHJson, formatJson }) {
    const [isPopoverOpen, setIsPopoverOpen] = react_1.useState(false);
    const onButtonClick = react_1.useCallback(() => setIsPopoverOpen(isOpen => !isOpen), []);
    const onHJsonCLick = react_1.useCallback(() => {
        formatHJson();
        setIsPopoverOpen(false);
    }, [formatHJson]);
    const onJsonCLick = react_1.useCallback(() => {
        formatJson();
        setIsPopoverOpen(false);
    }, [formatJson]);
    const closePopover = react_1.useCallback(() => setIsPopoverOpen(false), []);
    const button = (react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "wrench", onClick: onButtonClick, "aria-label": i18n_1.i18n.translate('visTypeVega.editor.vegaEditorOptionsButtonAriaLabel', {
            defaultMessage: 'Vega editor options',
        }) }));
    const items = [
        react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "hjson", onClick: onHJsonCLick },
            react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVega.editor.reformatAsHJSONButtonLabel", defaultMessage: "Reformat as HJSON" })),
        react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "json", onClick: onJsonCLick },
            react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVega.editor.reformatAsJSONButtonLabel", defaultMessage: "Reformat as JSON, delete comments" })),
    ];
    return (react_1.default.createElement(eui_1.EuiPopover, { id: "helpMenu", button: button, isOpen: isPopoverOpen, closePopover: closePopover, panelPaddingSize: "none", anchorPosition: "downLeft" },
        react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: items })));
}
exports.VegaActionsMenu = VegaActionsMenu;
