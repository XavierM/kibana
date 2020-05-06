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
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
const public_1 = require("../../../../src/plugins/embeddable/public");
function wrapSearchTerms(task, search) {
    if (!search)
        return task;
    const parts = task.split(new RegExp(`(${search})`, 'g'));
    return parts.map((part, i) => part === search ? (react_1.default.createElement("span", { key: i, style: { backgroundColor: 'yellow' } }, part)) : (part));
}
function renderTasks(tasks, search) {
    return tasks.map(task => (react_1.default.createElement(eui_2.EuiListGroupItem, { key: task, "data-test-subj": "multiTaskTodoTask", label: wrapSearchTerms(task, search) })));
}
function MultiTaskTodoEmbeddableComponentInner({ input: { title, icon, search, tasks }, }) {
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none" },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, icon ? react_1.default.createElement(eui_2.EuiIcon, { type: icon, size: "l" }) : react_1.default.createElement(eui_2.EuiAvatar, { name: title, size: "l" })),
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_2.EuiFlexGrid, { columns: 1, gutterSize: "none" },
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_2.EuiText, { "data-test-subj": "multiTaskTodoTitle" },
                        react_1.default.createElement("h3", null, wrapSearchTerms(title, search)))),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_2.EuiListGroup, { bordered: true }, renderTasks(tasks, search)))))));
}
exports.MultiTaskTodoEmbeddableComponentInner = MultiTaskTodoEmbeddableComponentInner;
exports.MultiTaskTodoEmbeddableComponent = public_1.withEmbeddableSubscription(MultiTaskTodoEmbeddableComponentInner);
