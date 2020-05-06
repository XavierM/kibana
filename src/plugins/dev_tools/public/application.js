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
const react_1 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const react_router_dom_1 = require("react-router-dom");
const React = tslib_1.__importStar(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_2 = require("react");
function DevToolsWrapper({ devTools, activeDevTool, appMountContext, updateRoute, }) {
    const mountedTool = react_2.useRef(null);
    react_2.useEffect(() => () => {
        if (mountedTool.current) {
            mountedTool.current.unmountHandler();
        }
    }, []);
    return (React.createElement("main", { className: "devApp" },
        React.createElement(eui_1.EuiTabs, null, devTools.map(currentDevTool => (React.createElement(eui_1.EuiToolTip, { content: currentDevTool.tooltipContent, key: currentDevTool.id },
            React.createElement(eui_1.EuiTab, { disabled: currentDevTool.disabled, isSelected: currentDevTool === activeDevTool, onClick: () => {
                    if (!currentDevTool.disabled) {
                        updateRoute(`/dev_tools/${currentDevTool.id}`);
                    }
                } }, currentDevTool.title))))),
        React.createElement("div", { className: "devApp__container", role: "tabpanel", "data-test-subj": activeDevTool.id, ref: async (element) => {
                if (element &&
                    (mountedTool.current === null ||
                        mountedTool.current.devTool !== activeDevTool ||
                        mountedTool.current.mountpoint !== element)) {
                    if (mountedTool.current) {
                        mountedTool.current.unmountHandler();
                    }
                    const params = {
                        element,
                        appBasePath: '',
                        onAppLeave: () => undefined,
                        // TODO: adapt to use Core's ScopedHistory
                        history: {},
                    };
                    const unmountHandler = isAppMountDeprecated(activeDevTool.mount)
                        ? await activeDevTool.mount(appMountContext, params)
                        : await activeDevTool.mount(params);
                    mountedTool.current = {
                        devTool: activeDevTool,
                        mountpoint: element,
                        unmountHandler,
                    };
                }
            } })));
}
function redirectOnMissingCapabilities(appMountContext) {
    if (!appMountContext.core.application.capabilities.dev_tools.show) {
        window.location.hash = '/home';
        return true;
    }
    return false;
}
function setBadge(appMountContext) {
    if (appMountContext.core.application.capabilities.dev_tools.save) {
        return;
    }
    appMountContext.core.chrome.setBadge({
        text: i18n_1.i18n.translate('devTools.badge.readOnly.text', {
            defaultMessage: 'Read only',
        }),
        tooltip: i18n_1.i18n.translate('devTools.badge.readOnly.tooltip', {
            defaultMessage: 'Unable to save',
        }),
        iconType: 'glasses',
    });
}
function setBreadcrumbs(appMountContext) {
    appMountContext.core.chrome.setBreadcrumbs([
        {
            text: i18n_1.i18n.translate('devTools.k7BreadcrumbsDevToolsLabel', {
                defaultMessage: 'Dev Tools',
            }),
            href: '#/dev_tools',
        },
    ]);
}
function renderApp(element, appMountContext, basePath, devTools) {
    if (redirectOnMissingCapabilities(appMountContext)) {
        return () => { };
    }
    setBadge(appMountContext);
    setBreadcrumbs(appMountContext);
    react_dom_1.default.render(React.createElement(react_1.I18nProvider, null,
        React.createElement(react_router_dom_1.HashRouter, null,
            React.createElement(react_router_dom_1.Switch, null,
                devTools.map(devTool => (React.createElement(react_router_dom_1.Route, { key: devTool.id, path: `/dev_tools/${devTool.id}`, exact: !devTool.enableRouting, render: props => (React.createElement(DevToolsWrapper, { updateRoute: props.history.push, activeDevTool: devTool, devTools: devTools, appMountContext: appMountContext })) }))),
                React.createElement(react_router_dom_1.Route, { path: "/dev_tools" },
                    React.createElement(react_router_dom_1.Redirect, { to: `/dev_tools/${devTools[0].id}` }))))), element);
    return () => react_dom_1.default.unmountComponentAtNode(element);
}
exports.renderApp = renderApp;
function isAppMountDeprecated(mount) {
    // Mount functions with two arguments are assumed to expect deprecated `context` object.
    return mount.length === 2;
}
