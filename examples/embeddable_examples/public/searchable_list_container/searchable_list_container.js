"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const public_1 = require("../../../../src/plugins/embeddable/public");
const searchable_list_container_component_1 = require("./searchable_list_container_component");
exports.SEARCHABLE_LIST_CONTAINER = 'SEARCHABLE_LIST_CONTAINER';
class SearchableListContainer extends public_1.Container {
    constructor(input, embeddableServices) {
        super(input, { embeddableLoaded: {} }, embeddableServices.getEmbeddableFactory);
        this.embeddableServices = embeddableServices;
        this.type = exports.SEARCHABLE_LIST_CONTAINER;
    }
    // TODO: add a more advanced example here where inherited child input is derived from container
    // input and not just an exact pass through.
    getInheritedInput(id) {
        return {
            id,
            search: this.getInput().search,
            viewMode: this.input.viewMode,
        };
    }
    render(node) {
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
        this.node = node;
        react_dom_1.default.render(react_1.default.createElement(searchable_list_container_component_1.SearchableListContainerComponent, { embeddable: this, embeddableServices: this.embeddableServices }), node);
    }
    destroy() {
        super.destroy();
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
    }
}
exports.SearchableListContainer = SearchableListContainer;
