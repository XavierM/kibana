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
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importStar(require("react"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Rx = tslib_1.__importStar(require("rxjs"));
const header_badge_1 = require("./header_badge");
const header_breadcrumbs_1 = require("./header_breadcrumbs");
const header_help_menu_1 = require("./header_help_menu");
const header_nav_controls_1 = require("./header_nav_controls");
const nav_link_1 = require("./nav_link");
const header_logo_1 = require("./header_logo");
const nav_drawer_1 = require("./nav_drawer");
class Header extends react_1.Component {
    constructor(props) {
        super(props);
        this.navDrawerRef = react_1.createRef();
        let isLocked = false;
        props.isLocked$.subscribe(initialIsLocked => (isLocked = initialIsLocked));
        this.state = {
            appTitle: 'Kibana',
            isVisible: true,
            navLinks: [],
            recentlyAccessed: [],
            forceNavigation: false,
            navControlsLeft: [],
            navControlsRight: [],
            currentAppId: '',
            isLocked,
        };
    }
    componentDidMount() {
        this.subscription = Rx.combineLatest(this.props.appTitle$, this.props.isVisible$, this.props.forceAppSwitcherNavigation$, this.props.navLinks$, this.props.recentlyAccessed$, 
        // Types for combineLatest only handle up to 6 inferred types so we combine these separately.
        Rx.combineLatest(this.props.navControlsLeft$, this.props.navControlsRight$, this.props.application.currentAppId$, this.props.isLocked$)).subscribe({
            next: ([appTitle, isVisible, forceNavigation, navLinks, recentlyAccessed, [navControlsLeft, navControlsRight, currentAppId, isLocked],]) => {
                this.setState({
                    appTitle,
                    isVisible,
                    forceNavigation,
                    navLinks: navLinks.filter(navLink => !navLink.hidden),
                    recentlyAccessed,
                    navControlsLeft,
                    navControlsRight,
                    currentAppId,
                    isLocked,
                });
            },
        });
    }
    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    renderMenuTrigger() {
        return (react_1.default.createElement(eui_1.EuiHeaderSectionItemButton, { "aria-label": i18n_1.i18n.translate('core.ui.chrome.headerGlobalNav.toggleSideNavAriaLabel', {
                defaultMessage: 'Toggle side navigation',
            }), onClick: () => this.navDrawerRef.current.toggleOpen() },
            react_1.default.createElement(eui_1.EuiIcon, { type: "apps", size: "m" })));
    }
    render() {
        const { appTitle, isVisible, navControlsLeft, navControlsRight } = this.state;
        const { badge$, breadcrumbs$, helpExtension$, helpSupportUrl$, kibanaDocLink, kibanaVersion, } = this.props;
        const navLinks = this.state.navLinks.map(link => nav_link_1.euiNavLink(link, this.props.legacyMode, this.state.currentAppId, this.props.basePath, this.props.application.navigateToApp));
        if (!isVisible) {
            return null;
        }
        const className = classnames_1.default('chrHeaderWrapper', {
            'chrHeaderWrapper--navIsLocked': this.state.isLocked,
        }, 'hide-for-sharing');
        return (react_1.default.createElement("header", { className: className, "data-test-subj": "headerGlobalNav" },
            react_1.default.createElement(eui_1.EuiHeader, null,
                react_1.default.createElement(eui_1.EuiHeaderSection, { grow: false },
                    react_1.default.createElement(eui_1.EuiShowFor, { sizes: ['xs', 's'] },
                        react_1.default.createElement(eui_1.EuiHeaderSectionItem, { border: "right" }, this.renderMenuTrigger())),
                    react_1.default.createElement(eui_1.EuiHeaderSectionItem, { border: "right" },
                        react_1.default.createElement(header_logo_1.HeaderLogo, { href: this.props.homeHref, forceNavigation: this.state.forceNavigation, navLinks: navLinks })),
                    react_1.default.createElement(header_nav_controls_1.HeaderNavControls, { side: "left", navControls: navControlsLeft })),
                react_1.default.createElement(header_breadcrumbs_1.HeaderBreadcrumbs, { appTitle: appTitle, "breadcrumbs$": breadcrumbs$ }),
                react_1.default.createElement(header_badge_1.HeaderBadge, { "badge$": badge$ }),
                react_1.default.createElement(eui_1.EuiHeaderSection, { side: "right" },
                    react_1.default.createElement(eui_1.EuiHeaderSectionItem, null,
                        react_1.default.createElement(header_help_menu_1.HeaderHelpMenu, Object.assign({}, {
                            helpExtension$,
                            helpSupportUrl$,
                            kibanaDocLink,
                            kibanaVersion,
                        }))),
                    react_1.default.createElement(header_nav_controls_1.HeaderNavControls, { side: "right", navControls: navControlsRight }))),
            react_1.default.createElement(nav_drawer_1.NavDrawer, { isLocked: this.state.isLocked, onIsLockedUpdate: this.props.onIsLockedUpdate, navLinks: navLinks, chromeNavLinks: this.state.navLinks, recentlyAccessedItems: this.state.recentlyAccessed, basePath: this.props.basePath, ref: this.navDrawerRef })));
    }
}
exports.Header = Header;
