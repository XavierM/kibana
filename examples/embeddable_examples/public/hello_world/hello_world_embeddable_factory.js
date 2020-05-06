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
const i18n_1 = require("@kbn/i18n");
const hello_world_embeddable_1 = require("./hello_world_embeddable");
class HelloWorldEmbeddableFactory {
    constructor() {
        this.type = hello_world_embeddable_1.HELLO_WORLD_EMBEDDABLE;
    }
    /**
     * In our simple example, we let everyone have permissions to edit this. Most
     * embeddables should check the UI Capabilities service to be sure of
     * the right permissions.
     */
    async isEditable() {
        return true;
    }
    async create(initialInput, parent) {
        return new hello_world_embeddable_1.HelloWorldEmbeddable(initialInput, parent);
    }
    getDisplayName() {
        return i18n_1.i18n.translate('embeddableExamples.helloworld.displayName', {
            defaultMessage: 'hello world',
        });
    }
}
exports.HelloWorldEmbeddableFactory = HelloWorldEmbeddableFactory;
