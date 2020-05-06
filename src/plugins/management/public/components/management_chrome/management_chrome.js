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
const React = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const management_sidebar_nav_1 = require("../management_sidebar_nav");
class ManagementChrome extends React.Component {
    constructor() {
        super(...arguments);
        this.container = React.createRef();
    }
    componentDidMount() {
        if (this.container.current) {
            this.props.onMounted(this.container.current);
        }
    }
    render() {
        return (React.createElement(react_1.I18nProvider, null,
            React.createElement(eui_1.EuiPage, null,
                React.createElement(eui_1.EuiPageSideBar, null,
                    React.createElement(management_sidebar_nav_1.ManagementSidebarNav, { getSections: this.props.getSections, legacySections: this.props.legacySections, selectedId: this.props.selectedId })),
                React.createElement(eui_1.EuiPageBody, { restrictWidth: true, className: "mgtPage__body" },
                    React.createElement("div", { ref: this.container })))));
    }
}
exports.ManagementChrome = ManagementChrome;
