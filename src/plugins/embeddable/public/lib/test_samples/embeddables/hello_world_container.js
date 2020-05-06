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
const react_2 = require("@kbn/i18n/react");
const __1 = require("../..");
const hello_world_container_component_1 = require("./hello_world_container_component");
exports.HELLO_WORLD_CONTAINER = 'HELLO_WORLD_CONTAINER';
class HelloWorldContainer extends __1.Container {
    constructor(input, options) {
        super(input, { embeddableLoaded: {} }, options.getEmbeddableFactory);
        this.options = options;
        this.type = exports.HELLO_WORLD_CONTAINER;
    }
    getInheritedInput(id) {
        return {
            id,
            viewMode: this.input.viewMode || __1.ViewMode.EDIT,
            lastName: this.input.lastName || 'foo',
        };
    }
    render(node) {
        react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(hello_world_container_component_1.HelloWorldContainerComponent, { container: this, getActions: this.options.getActions, getAllEmbeddableFactories: this.options.getAllEmbeddableFactories, getEmbeddableFactory: this.options.getEmbeddableFactory, overlays: this.options.overlays, application: this.options.application, notifications: this.options.notifications, inspector: this.options.inspector, SavedObjectFinder: this.options.SavedObjectFinder })), node);
    }
}
exports.HelloWorldContainer = HelloWorldContainer;
