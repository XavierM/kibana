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
const todo_component_1 = require("./todo_component");
exports.TODO_EMBEDDABLE = 'TODO_EMBEDDABLE';
function getOutput(input) {
    return {
        hasMatch: input.search
            ? Boolean(input.task.match(input.search) || (input.title && input.title.match(input.search)))
            : true,
    };
}
class TodoEmbeddable extends public_1.Embeddable {
    constructor(initialInput, parent) {
        super(initialInput, getOutput(initialInput), parent);
        // The type of this embeddable. This will be used to find the appropriate factory
        // to instantiate this kind of embeddable.
        this.type = exports.TODO_EMBEDDABLE;
        // If you have any output state that changes as a result of input state changes, you
        // should use an subcription.  Here, we use output to indicate whether this task
        // matches the search string.
        this.subscription = this.getInput$().subscribe(() => {
            this.updateOutput(getOutput(this.input));
        });
    }
    render(node) {
        this.node = node;
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
        react_dom_1.default.render(react_1.default.createElement(todo_component_1.TodoEmbeddableComponent, { embeddable: this }), node);
    }
    /**
     * Not relevant.
     */
    reload() { }
    destroy() {
        super.destroy();
        this.subscription.unsubscribe();
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
    }
}
exports.TodoEmbeddable = TodoEmbeddable;
