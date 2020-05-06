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
const todo_ref_component_1 = require("./todo_ref_component");
// Notice this is not the same value as the 'todo' saved object type. Many of our
// cases in prod today use the same value, but this is unnecessary.
exports.TODO_REF_EMBEDDABLE = 'TODO_REF_EMBEDDABLE';
/**
 * Returns whether any attributes contain the search string.  If search is empty, true is returned. If
 * there are no savedAttributes, false is returned.
 * @param search - the search string
 * @param savedAttributes - the saved object attributes for the saved object with id `input.savedObjectId`
 */
function getHasMatch(search, savedAttributes) {
    if (!search)
        return true;
    if (!savedAttributes)
        return false;
    return Boolean((savedAttributes.task && savedAttributes.task.match(search)) ||
        (savedAttributes.title && savedAttributes.title.match(search)));
}
/**
 * This is an example of an embeddable that is backed by a saved object. It's essentially the
 * same as `TodoEmbeddable` but that is "by value", while this is "by reference".
 */
class TodoRefEmbeddable extends public_1.Embeddable {
    constructor(initialInput, { parent, savedObjectsClient, }) {
        super(initialInput, { hasMatch: false }, parent);
        this.type = exports.TODO_REF_EMBEDDABLE;
        this.savedObjectsClient = savedObjectsClient;
        this.subscription = this.getInput$().subscribe(async () => {
            // There is a little more work today for this embeddable because it has
            // more output it needs to update in response to input state changes.
            let savedAttributes;
            // Since this is an expensive task, we save a local copy of the previous
            // savedObjectId locally and only retrieve the new saved object if the id
            // actually changed.
            if (this.savedObjectId !== this.input.savedObjectId) {
                this.savedObjectId = this.input.savedObjectId;
                const todoSavedObject = await this.savedObjectsClient.get('todo', this.input.savedObjectId);
                savedAttributes = todoSavedObject?.attributes;
            }
            // The search string might have changed as well so we need to make sure we recalculate
            // hasMatch.
            this.updateOutput({
                hasMatch: getHasMatch(this.input.search, savedAttributes),
                savedAttributes,
            });
        });
    }
    render(node) {
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
        this.node = node;
        react_dom_1.default.render(react_1.default.createElement(todo_ref_component_1.TodoRefEmbeddableComponent, { embeddable: this }), node);
    }
    /**
     * Lets re-sync our saved object to make sure it's up to date!
     */
    async reload() {
        this.savedObjectId = this.input.savedObjectId;
        const todoSavedObject = await this.savedObjectsClient.get('todo', this.input.savedObjectId);
        const savedAttributes = todoSavedObject?.attributes;
        this.updateOutput({
            hasMatch: getHasMatch(this.input.search, savedAttributes),
            savedAttributes,
        });
    }
    destroy() {
        super.destroy();
        this.subscription.unsubscribe();
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
    }
}
exports.TodoRefEmbeddable = TodoRefEmbeddable;
