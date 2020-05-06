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
class ConsoleMenu extends react_1.Component {
    constructor(props) {
        super(props);
        this.mouseEnter = () => {
            if (this.state.isPopoverOpen)
                return;
            this.props.getCurl().then(text => {
                this.setState({ curlCode: text });
            });
        };
        this.onButtonClick = () => {
            this.setState(prevState => ({
                isPopoverOpen: !prevState.isPopoverOpen,
            }));
        };
        this.closePopover = () => {
            this.setState({
                isPopoverOpen: false,
            });
        };
        this.openDocs = async () => {
            this.closePopover();
            const documentation = await this.props.getDocumentation();
            if (!documentation) {
                return;
            }
            window.open(documentation, '_blank');
        };
        // Using `any` here per this issue: https://github.com/elastic/eui/issues/2265
        this.autoIndent = (event) => {
            this.closePopover();
            this.props.autoIndent(event);
        };
        this.state = {
            curlCode: '',
            isPopoverOpen: false,
        };
    }
    copyAsCurl() {
        this.copyText(this.state.curlCode);
        const { addNotification } = this.props;
        if (addNotification) {
            addNotification({
                title: i18n_1.i18n.translate('console.consoleMenu.copyAsCurlMessage', {
                    defaultMessage: 'Request copied as cURL',
                }),
            });
        }
    }
    copyText(text) {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    }
    render() {
        const button = (react_1.default.createElement("button", { className: "euiButtonIcon--primary", onClick: this.onButtonClick, "data-test-subj": "toggleConsoleMenu", "aria-label": i18n_1.i18n.translate('console.requestOptionsButtonAriaLabel', {
                defaultMessage: 'Request options',
            }) },
            react_1.default.createElement(eui_1.EuiIcon, { type: "wrench" })));
        const items = [
            react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "Copy as cURL", id: "ConCopyAsCurl", disabled: !document.queryCommandSupported('copy'), onClick: () => {
                    this.closePopover();
                    this.copyAsCurl();
                } },
                react_1.default.createElement(react_2.FormattedMessage, { id: "console.requestOptions.copyAsUrlButtonLabel", defaultMessage: "Copy as cURL" })),
            react_1.default.createElement(eui_1.EuiContextMenuItem, { key: "Open documentation", "data-test-subj": "consoleMenuOpenDocs", onClick: () => {
                    this.openDocs();
                } },
                react_1.default.createElement(react_2.FormattedMessage, { id: "console.requestOptions.openDocumentationButtonLabel", defaultMessage: "Open documentation" })),
            react_1.default.createElement(eui_1.EuiContextMenuItem, { "data-test-subj": "consoleMenuAutoIndent", key: "Auto indent", onClick: this.autoIndent },
                react_1.default.createElement(react_2.FormattedMessage, { id: "console.requestOptions.autoIndentButtonLabel", defaultMessage: "Auto indent" })),
        ];
        return (react_1.default.createElement("span", { onMouseEnter: this.mouseEnter },
            react_1.default.createElement(eui_1.EuiPopover, { id: "contextMenu", button: button, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, panelPaddingSize: "none", anchorPosition: "downLeft" },
                react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: items }))));
    }
}
exports.ConsoleMenu = ConsoleMenu;
