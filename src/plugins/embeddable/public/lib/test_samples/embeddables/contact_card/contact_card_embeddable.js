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
const embeddables_1 = require("../../../embeddables");
const contact_card_embeddable_factory_1 = require("./contact_card_embeddable_factory");
const contact_card_1 = require("./contact_card");
function getFullName(input) {
    const { nameTitle, firstName, lastName } = input;
    const nameParts = [nameTitle, firstName, lastName].filter(name => name !== undefined);
    return nameParts.join(' ');
}
class ContactCardEmbeddable extends embeddables_1.Embeddable {
    constructor(initialInput, options, parent) {
        super(initialInput, {
            fullName: getFullName(initialInput),
            originalLastName: initialInput.lastName,
            defaultTitle: `Hello ${getFullName(initialInput)}`,
        }, parent);
        this.options = options;
        this.type = contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE;
        this.subscription = this.getInput$().subscribe(() => {
            const fullName = getFullName(this.input);
            this.updateOutput({
                fullName,
                defaultTitle: `Hello ${fullName}`,
            });
        });
    }
    render(node) {
        this.node = node;
        react_dom_1.default.render(react_1.default.createElement(contact_card_1.ContactCardEmbeddableComponent, { embeddable: this, execTrigger: this.options.execAction }), node);
    }
    destroy() {
        super.destroy();
        this.subscription.unsubscribe();
        if (this.node) {
            react_dom_1.default.unmountComponentAtNode(this.node);
        }
    }
    reload() { }
}
exports.ContactCardEmbeddable = ContactCardEmbeddable;
exports.CONTACT_USER_TRIGGER = 'CONTACT_USER_TRIGGER';
