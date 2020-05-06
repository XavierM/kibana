"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const i18n_1 = require("@kbn/i18n");
const todo_ref_embeddable_1 = require("./todo_ref_embeddable");
class TodoRefEmbeddableFactory {
    constructor(getStartServices) {
        this.getStartServices = getStartServices;
        this.type = todo_ref_embeddable_1.TODO_REF_EMBEDDABLE;
        this.savedObjectMetaData = {
            name: 'Todo',
            includeFields: ['task', 'icon', 'title'],
            type: 'todo',
            getIconForSavedObject: () => 'pencil',
        };
        this.createFromSavedObject = (savedObjectId, input, parent) => {
            return this.create({ ...input, savedObjectId }, parent);
        };
    }
    async isEditable() {
        return true;
    }
    async create(input, parent) {
        const { savedObjectsClient } = await this.getStartServices();
        return new todo_ref_embeddable_1.TodoRefEmbeddable(input, {
            parent,
            savedObjectsClient,
        });
    }
    getDisplayName() {
        return i18n_1.i18n.translate('embeddableExamples.todo.displayName', {
            defaultMessage: 'Todo (by reference)',
        });
    }
}
exports.TodoRefEmbeddableFactory = TodoRefEmbeddableFactory;
