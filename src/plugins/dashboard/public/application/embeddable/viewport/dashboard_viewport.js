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
const grid_1 = require("../grid");
const public_1 = require("../../../../../kibana_react/public");
class DashboardViewport extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.onExitFullScreenMode = () => {
            this.props.container.updateInput({
                isFullScreenMode: false,
            });
        };
        const { isFullScreenMode, panels, useMargins, title, isEmptyState, } = this.props.container.getInput();
        this.state = {
            isFullScreenMode,
            panels,
            useMargins,
            title,
            isEmptyState,
        };
    }
    componentDidMount() {
        this.mounted = true;
        this.subscription = this.props.container.getInput$().subscribe(() => {
            const { isFullScreenMode, useMargins, title, description, isEmptyState, } = this.props.container.getInput();
            if (this.mounted) {
                this.setState({
                    isFullScreenMode,
                    description,
                    useMargins,
                    title,
                    isEmptyState,
                });
            }
        });
    }
    componentWillUnmount() {
        this.mounted = false;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    renderEmptyScreen() {
        const { renderEmpty } = this.props;
        const { isFullScreenMode } = this.state;
        return (react_1.default.createElement("div", { className: "dshDashboardEmptyScreen" },
            isFullScreenMode && (react_1.default.createElement(this.context.services.ExitFullScreenButton, { onExitFullScreenMode: this.onExitFullScreenMode })),
            renderEmpty && renderEmpty()));
    }
    renderContainerScreen() {
        const { container } = this.props;
        const { isFullScreenMode, panels, title, description, useMargins } = this.state;
        return (react_1.default.createElement("div", { "data-shared-items-count": Object.values(panels).length, "data-shared-items-container": true, "data-title": title, "data-description": description, className: useMargins ? 'dshDashboardViewport-withMargins' : 'dshDashboardViewport' },
            isFullScreenMode && (react_1.default.createElement(this.context.services.ExitFullScreenButton, { onExitFullScreenMode: this.onExitFullScreenMode })),
            react_1.default.createElement(grid_1.DashboardGrid, { container: container })));
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            this.state.isEmptyState ? this.renderEmptyScreen() : null,
            this.renderContainerScreen()));
    }
}
exports.DashboardViewport = DashboardViewport;
DashboardViewport.contextType = public_1.context;
