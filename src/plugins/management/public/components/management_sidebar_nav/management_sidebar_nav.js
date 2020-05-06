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
const react_1 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const react_2 = tslib_1.__importDefault(require("react"));
const managementSectionOrAppToNav = (appOrSection) => ({
    id: appOrSection.id,
    name: appOrSection.title,
    'data-test-subj': appOrSection.id,
    order: appOrSection.order,
});
const managementSectionToNavSection = (section) => {
    const iconType = section.euiIconType
        ? section.euiIconType
        : section.icon
            ? section.icon
            : 'empty';
    return {
        icon: react_2.default.createElement(eui_1.EuiIcon, { type: iconType, size: "m" }),
        ...managementSectionOrAppToNav(section),
    };
};
const managementAppToNavItem = (selectedId, parentId) => (app) => ({
    isSelected: selectedId === app.id,
    href: `#/management/${parentId}/${app.id}`,
    ...managementSectionOrAppToNav(app),
});
const legacySectionToNavSection = (section) => ({
    name: section.display,
    id: section.id,
    icon: section.icon ? react_2.default.createElement(eui_1.EuiIcon, { type: section.icon }) : null,
    items: [],
    'data-test-subj': section.id,
    // @ts-ignore
    order: section.order,
});
const legacyAppToNavItem = (app, selectedId) => ({
    isSelected: selectedId === app.id,
    name: app.display,
    id: app.id,
    href: app.url,
    'data-test-subj': app.id,
    // @ts-ignore
    order: app.order,
});
const sectionVisible = (section) => !section.disabled && section.visible;
const sideNavItems = (sections, selectedId) => sections.map(section => ({
    items: section.getAppsEnabled().map(managementAppToNavItem(selectedId, section.id)),
    ...managementSectionToNavSection(section),
}));
const findOrAddSection = (navItems, legacySection) => {
    const foundSection = navItems.find(sec => sec.id === legacySection.id);
    if (foundSection) {
        return foundSection;
    }
    else {
        const newSection = legacySectionToNavSection(legacySection);
        navItems.push(newSection);
        navItems.sort((a, b) => a.order - b.order); // only needed while merging platform and legacy
        return newSection;
    }
};
exports.mergeLegacyItems = (navItems, legacySections, selectedId) => {
    const filteredLegacySections = legacySections
        .filter(sectionVisible)
        .filter(section => section.visibleItems.length);
    filteredLegacySections.forEach(legacySection => {
        const section = findOrAddSection(navItems, legacySection);
        legacySection.visibleItems.forEach(app => {
            section.items.push(legacyAppToNavItem(app, selectedId));
            return section.items.sort((a, b) => a.order - b.order);
        });
    });
    return navItems;
};
const sectionsToItems = (sections, legacySections, selectedId) => {
    const navItems = sideNavItems(sections, selectedId);
    return exports.mergeLegacyItems(navItems, legacySections, selectedId);
};
class ManagementSidebarNav extends react_2.default.Component {
    constructor(props) {
        super(props);
        this.toggleOpenOnMobile = () => {
            this.setState({
                isSideNavOpenOnMobile: !this.state.isSideNavOpenOnMobile,
            });
        };
        this.state = {
            isSideNavOpenOnMobile: false,
        };
    }
    render() {
        const HEADER_ID = 'stack-management-nav-header';
        return (react_2.default.createElement(react_2.default.Fragment, null,
            react_2.default.createElement(eui_1.EuiScreenReaderOnly, null,
                react_2.default.createElement("h2", { id: HEADER_ID }, i18n_1.i18n.translate('management.nav.label', {
                    defaultMessage: 'Management',
                }))),
            react_2.default.createElement(eui_1.EuiSideNav, { "aria-labelledby": HEADER_ID, mobileTitle: this.renderMobileTitle(), isOpenOnMobile: this.state.isSideNavOpenOnMobile, toggleOpenOnMobile: this.toggleOpenOnMobile, items: sectionsToItems(this.props.getSections(), this.props.legacySections, this.props.selectedId), className: "mgtSideBarNav" })));
    }
    renderMobileTitle() {
        return react_2.default.createElement(react_1.FormattedMessage, { id: "management.nav.menu", defaultMessage: "Management menu" });
    }
}
exports.ManagementSidebarNav = ManagementSidebarNav;
