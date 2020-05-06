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
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
class OptionsMenu extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            useMargins: this.props.useMargins,
            hidePanelTitles: this.props.hidePanelTitles,
        };
        this.handleUseMarginsChange = (evt) => {
            const isChecked = evt.target.checked;
            this.props.onUseMarginsChange(isChecked);
            this.setState({ useMargins: isChecked });
        };
        this.handleHidePanelTitlesChange = (evt) => {
            const isChecked = !evt.target.checked;
            this.props.onHidePanelTitlesChange(isChecked);
            this.setState({ hidePanelTitles: isChecked });
        };
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiForm, { "data-test-subj": "dashboardOptionsMenu" },
            react_1.default.createElement(eui_1.EuiFormRow, null,
                react_1.default.createElement(eui_1.EuiSwitch, { label: i18n_1.i18n.translate('dashboard.topNav.options.useMarginsBetweenPanelsSwitchLabel', {
                        defaultMessage: 'Use margins between panels',
                    }), checked: this.state.useMargins, onChange: this.handleUseMarginsChange, "data-test-subj": "dashboardMarginsCheckbox" })),
            react_1.default.createElement(eui_1.EuiFormRow, null,
                react_1.default.createElement(eui_1.EuiSwitch, { label: i18n_1.i18n.translate('dashboard.topNav.options.hideAllPanelTitlesSwitchLabel', {
                        defaultMessage: 'Show panel titles',
                    }), checked: !this.state.hidePanelTitles, onChange: this.handleHidePanelTitlesChange, "data-test-subj": "dashboardPanelTitlesCheckbox" }))));
    }
}
exports.OptionsMenu = OptionsMenu;
