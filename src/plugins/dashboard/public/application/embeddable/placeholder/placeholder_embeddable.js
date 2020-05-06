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
const eui_1 = require("@elastic/eui");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const embeddable_plugin_1 = require("../../../embeddable_plugin");
exports.PLACEHOLDER_EMBEDDABLE = 'placeholder';
class PlaceholderEmbeddable extends embeddable_plugin_1.Embeddable {
    constructor(initialInput, parent) {
        super(initialInput, {}, parent);
        this.type = exports.PLACEHOLDER_EMBEDDABLE;
        this.input = initialInput;
    }
    render(node) {
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
        this.node = node;
        const classes = classnames_1.default('embPanel', 'embPanel-isLoading');
        react_dom_1.default.render(react_1.default.createElement("div", { className: classes },
            react_1.default.createElement(eui_1.EuiLoadingChart, { size: "l", mono: true })), node);
    }
    reload() { }
}
exports.PlaceholderEmbeddable = PlaceholderEmbeddable;
