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
const multi_task_todo_component_1 = require("./multi_task_todo_component");
exports.MULTI_TASK_TODO_EMBEDDABLE = 'MULTI_TASK_TODO_EMBEDDABLE';
function getHasMatch(tasks, title, search) {
    if (search === undefined || search === '')
        return false;
    if (title && title.match(search))
        return true;
    const match = tasks.find(task => task.match(search));
    if (match)
        return true;
    return false;
}
function getOutput(input) {
    const hasMatch = getHasMatch(input.tasks, input.title, input.search);
    return { hasMatch };
}
class MultiTaskTodoEmbeddable extends public_1.Embeddable {
    constructor(initialInput, parent) {
        super(initialInput, getOutput(initialInput), parent);
        this.type = exports.MULTI_TASK_TODO_EMBEDDABLE;
        // If you have any output state that changes as a result of input state changes, you
        // should use an subcription.  Here, any time input tasks list, or the input filter
        // changes, we want to update the output tasks list as well as whether a match has
        // been found.
        this.subscription = this.getInput$().subscribe(() => {
            this.updateOutput(getOutput(this.input));
        });
    }
    render(node) {
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
        this.node = node;
        react_dom_1.default.render(react_1.default.createElement(multi_task_todo_component_1.MultiTaskTodoEmbeddableComponent, { embeddable: this }), node);
    }
    reload() { }
    destroy() {
        super.destroy();
        this.subscription.unsubscribe();
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
    }
}
exports.MultiTaskTodoEmbeddable = MultiTaskTodoEmbeddable;
