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
function VegaHelpMenu() {
    const [isPopoverOpen, setIsPopoverOpen] = react_1.useState(false);
    const onButtonClick = react_1.useCallback(() => setIsPopoverOpen(!isPopoverOpen), [isPopoverOpen]);
    const closePopover = react_1.useCallback(() => setIsPopoverOpen(false), []);
    const button = (react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "questionInCircle", onClick: onButtonClick, "aria-label": i18n_1.i18n.translate('visTypeVega.editor.vegaHelpButtonAriaLabel', {
            defaultMessage: 'Vega help',
        }) }));
    const items = [
        react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "vegaHelp", href: "https://www.elastic.co/guide/en/kibana/master/vega-graph.html", target: "_blank", onClick: closePopover },
            react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVega.editor.vegaHelpLinkText", defaultMessage: "Kibana Vega help" })),
        react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "vegaLiteDocs", href: "https://vega.github.io/vega-lite/docs/", target: "_blank", onClick: closePopover },
            react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVega.editor.vegaLiteDocumentationLinkText", defaultMessage: "Vega-Lite documentation" })),
        react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "vegaDoc", href: "https://vega.github.io/vega/docs/", target: "_blank", onClick: closePopover },
            react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVega.editor.vegaDocumentationLinkText", defaultMessage: "Vega documentation" })),
    ];
    return (react_1.default.createElement(eui_1.EuiPopover, { id: "helpMenu", button: button, isOpen: isPopoverOpen, closePopover: closePopover, panelPaddingSize: "none", anchorPosition: "downLeft" },
        react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: items })));
}
exports.VegaHelpMenu = VegaHelpMenu;
