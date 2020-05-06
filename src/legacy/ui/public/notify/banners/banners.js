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
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const new_platform_1 = require("ui/new_platform");
const react_2 = require("@kbn/i18n/react");
const npBanners = new_platform_1.npStart.core.overlays.banners;
/** compatibility layer for new platform */
const mountForComponent = (component) => (element) => {
    react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null, component), element);
    return () => react_dom_1.default.unmountComponentAtNode(element);
};
/**
 * Banners represents a prioritized list of displayed components.
 */
class Banners {
    constructor() {
        /**
         * Add a new banner.
         *
         * @param {Object} component The React component to display.
         * @param {Number} priority The optional priority order to display this banner. Higher priority values are shown first.
         * @return {String} A newly generated ID. This value can be used to remove/replace the banner.
         */
        this.add = ({ component, priority }) => {
            return npBanners.add(mountForComponent(component), priority);
        };
        /**
         * Remove an existing banner.
         *
         * @param {String} id The ID of the banner to remove.
         * @return {Boolean} {@code true} if the ID is recognized and the banner is removed. {@code false} otherwise.
         */
        this.remove = (id) => {
            return npBanners.remove(id);
        };
        /**
         * Replace an existing banner by removing it, if it exists, and adding a new one in its place.
         *
         * This is similar to calling banners.remove, followed by banners.add, except that it only notifies the listener
         * after adding.
         *
         * @param {Object} component The React component to display.
         * @param {String} id The ID of the Banner to remove.
         * @param {Number} priority The optional priority order to display this banner. Higher priority values are shown first.
         * @return {String} A newly generated ID. This value can be used to remove/replace the banner.
         */
        this.set = ({ component, id, priority = 0, }) => {
            return npBanners.replace(id, mountForComponent(component), priority);
        };
    }
}
exports.Banners = Banners;
/**
 * A singleton instance meant to represent all Kibana banners.
 */
exports.banners = new Banners();
