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
const hello_world_1 = require("./hello_world");
const todo_1 = require("./todo");
const multi_task_todo_1 = require("./multi_task_todo");
const searchable_list_container_1 = require("./searchable_list_container");
const list_container_1 = require("./list_container");
const create_sample_data_1 = require("./create_sample_data");
const todo_ref_embeddable_1 = require("./todo/todo_ref_embeddable");
const todo_ref_embeddable_factory_1 = require("./todo/todo_ref_embeddable_factory");
class EmbeddableExamplesPlugin {
    setup(core, deps) {
        deps.embeddable.registerEmbeddableFactory(hello_world_1.HELLO_WORLD_EMBEDDABLE, new hello_world_1.HelloWorldEmbeddableFactory());
        deps.embeddable.registerEmbeddableFactory(multi_task_todo_1.MULTI_TASK_TODO_EMBEDDABLE, new multi_task_todo_1.MultiTaskTodoEmbeddableFactory());
        deps.embeddable.registerEmbeddableFactory(searchable_list_container_1.SEARCHABLE_LIST_CONTAINER, new searchable_list_container_1.SearchableListContainerFactory(async () => ({
            embeddableServices: (await core.getStartServices())[1].embeddable,
        })));
        deps.embeddable.registerEmbeddableFactory(list_container_1.LIST_CONTAINER, new list_container_1.ListContainerFactory(async () => ({
            embeddableServices: (await core.getStartServices())[1].embeddable,
        })));
        deps.embeddable.registerEmbeddableFactory(todo_1.TODO_EMBEDDABLE, new todo_1.TodoEmbeddableFactory(async () => ({
            openModal: (await core.getStartServices())[0].overlays.openModal,
        })));
        deps.embeddable.registerEmbeddableFactory(todo_ref_embeddable_1.TODO_REF_EMBEDDABLE, new todo_ref_embeddable_factory_1.TodoRefEmbeddableFactory(async () => ({
            savedObjectsClient: (await core.getStartServices())[0].savedObjects.client,
            getEmbeddableFactory: (await core.getStartServices())[1].embeddable.getEmbeddableFactory,
        })));
    }
    start(core, deps) {
        return {
            createSampleData: () => create_sample_data_1.createSampleData(core.savedObjects.client),
        };
    }
    stop() { }
}
exports.EmbeddableExamplesPlugin = EmbeddableExamplesPlugin;
