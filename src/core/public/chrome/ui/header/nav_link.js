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
const eui_1 = require("@elastic/eui");
function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function LinkIcon({ url }) {
    return react_1.default.createElement(eui_1.EuiImage, { size: "s", alt: "", "aria-hidden": true, url: url });
}
function euiNavLink(navLink, legacyMode, currentAppId, basePath, navigateToApp) {
    const { legacy, url, active, baseUrl, id, title, disabled, euiIconType, icon, category, order, tooltip, } = navLink;
    let href = navLink.url ?? navLink.baseUrl;
    if (legacy) {
        href = url && !active ? url : baseUrl;
    }
    return {
        category,
        key: id,
        label: tooltip ?? title,
        href,
        onClick(event) {
            if (!legacyMode && // ignore when in legacy mode
                !legacy && // ignore links to legacy apps
                !event.defaultPrevented && // onClick prevented default
                event.button === 0 && // ignore everything but left clicks
                !isModifiedEvent(event) // ignore clicks with modifier keys
            ) {
                event.preventDefault();
                navigateToApp(navLink.id);
            }
        },
        // Legacy apps use `active` property, NP apps should match the current app
        isActive: active || currentAppId === id,
        isDisabled: disabled,
        iconType: euiIconType,
        icon: !euiIconType && icon ? react_1.default.createElement(LinkIcon, { url: basePath.prepend(`/${icon}`) }) : undefined,
        order,
        'data-test-subj': 'navDrawerAppsMenuLink',
    };
}
exports.euiNavLink = euiNavLink;
