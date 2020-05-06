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
const i18n_1 = require("@kbn/i18n");
// @ts-ignore
const eui_1 = require("@elastic/eui");
const recent_links_1 = require("./recent_links");
function navDrawerRenderer({ isLocked, onIsLockedUpdate, navLinks, chromeNavLinks, recentlyAccessedItems, basePath }, ref) {
    return (react_1.default.createElement(eui_1.EuiNavDrawer, { ref: ref, "data-test-subj": "navDrawer", isLocked: isLocked, onIsLockedUpdate: onIsLockedUpdate, "aria-label": i18n_1.i18n.translate('core.ui.primaryNav.screenReaderLabel', {
            defaultMessage: 'Primary',
        }) },
        recent_links_1.RecentLinks({
            recentlyAccessedItems,
            navLinks: chromeNavLinks,
            basePath,
        }),
        react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "none" }),
        react_1.default.createElement(eui_1.EuiNavDrawerGroup, { "data-test-subj": "navDrawerAppsMenu", listItems: navLinks, "aria-label": i18n_1.i18n.translate('core.ui.primaryNavList.screenReaderLabel', {
                defaultMessage: 'Primary navigation links',
            }) })));
}
exports.NavDrawer = react_1.default.forwardRef(navDrawerRenderer);
