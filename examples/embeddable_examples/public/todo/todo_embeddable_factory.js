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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const eui_2 = require("@elastic/eui");
const eui_3 = require("@elastic/eui");
const public_1 = require("../../../../src/plugins/kibana_react/public");
const todo_embeddable_1 = require("./todo_embeddable");
function TaskInput({ onSave }) {
    const [task, setTask] = react_1.useState('');
    return (react_1.default.createElement(eui_1.EuiModalBody, null,
        react_1.default.createElement(eui_2.EuiFieldText, { "data-test-subj": "taskInputField", value: task, placeholder: "Enter task here", onChange: e => setTask(e.target.value) }),
        react_1.default.createElement(eui_3.EuiButton, { "data-test-subj": "createTodoEmbeddable", onClick: () => onSave(task) }, "Save")));
}
class TodoEmbeddableFactory {
    constructor(getStartServices) {
        this.getStartServices = getStartServices;
        this.type = todo_embeddable_1.TODO_EMBEDDABLE;
        /**
         * This function is used when dynamically creating a new embeddable to add to a
         * container. Some input may be inherited from the container, but not all. This can be
         * used to collect specific embeddable input that the container will not provide, like
         * in this case, the task string.
         */
        this.getExplicitInput = async () => {
            const { openModal } = await this.getStartServices();
            return new Promise(resolve => {
                const onSave = (task) => resolve({ task });
                const overlay = openModal(public_1.toMountPoint(react_1.default.createElement(TaskInput, { onSave: (task) => {
                        onSave(task);
                        overlay.close();
                    } })));
            });
        };
    }
    async isEditable() {
        return true;
    }
    async create(initialInput, parent) {
        return new todo_embeddable_1.TodoEmbeddable(initialInput, parent);
    }
    getDisplayName() {
        return i18n_1.i18n.translate('embeddableExamples.todo.displayName', {
            defaultMessage: 'Todo item',
        });
    }
}
exports.TodoEmbeddableFactory = TodoEmbeddableFactory;
