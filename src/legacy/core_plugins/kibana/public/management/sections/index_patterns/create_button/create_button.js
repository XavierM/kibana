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
// @ts-ignore
const eui_theme_light_json_1 = require("@elastic/eui/dist/eui_theme_light.json");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const react_3 = require("ui/capabilities/react");
class CreateButtonComponent extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isPopoverOpen: false,
        };
        this.togglePopover = () => {
            this.setState({
                isPopoverOpen: !this.state.isPopoverOpen,
            });
        };
        this.closePopover = () => {
            this.setState({
                isPopoverOpen: false,
            });
        };
        this.renderBetaBadge = () => {
            return (react_1.default.createElement(eui_1.EuiBadge, { color: eui_theme_light_json_1.euiColorAccent },
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.indexPatternList.createButton.betaLabel", defaultMessage: "Beta" })));
        };
    }
    render() {
        const { options, children, uiCapabilities } = this.props;
        const { isPopoverOpen } = this.state;
        if (!options || !options.length) {
            return null;
        }
        if (!uiCapabilities.indexPatterns.save) {
            return null;
        }
        if (options.length === 1) {
            return (react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "createIndexPatternButton", fill: true, onClick: options[0].onClick, iconType: "plusInCircle" }, children));
        }
        const button = (react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "createIndexPatternButton", fill: true, size: "s", iconType: "arrowDown", iconSide: "right", onClick: this.togglePopover }, children));
        if (options.length > 1) {
            return (react_1.default.createElement(eui_1.EuiPopover, { id: "singlePanel", button: button, isOpen: isPopoverOpen, closePopover: this.closePopover, panelPaddingSize: "none", anchorPosition: "downLeft" },
                react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: options.map(option => {
                        return (react_1.default.createElement(eui_1.EuiContextMenuItem, { key: option.text, onClick: option.onClick, "data-test-subj": option.testSubj },
                            react_1.default.createElement(eui_1.EuiDescriptionList, { style: { whiteSpace: 'nowrap' } },
                                react_1.default.createElement(eui_1.EuiDescriptionListTitle, null,
                                    option.text,
                                    option.isBeta ? react_1.default.createElement(react_1.Fragment, null,
                                        " ",
                                        this.renderBetaBadge()) : null),
                                react_1.default.createElement(eui_1.EuiDescriptionListDescription, null, option.description))));
                    }) })));
        }
    }
}
exports.CreateButton = react_3.injectUICapabilities(CreateButtonComponent);
