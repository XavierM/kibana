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
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../../kibana_react/public");
const contact_card_embeddable_1 = require("./contact_card_embeddable");
const contact_card_initializer_1 = require("./contact_card_initializer");
exports.CONTACT_CARD_EMBEDDABLE = 'CONTACT_CARD_EMBEDDABLE';
class ContactCardEmbeddableFactory {
    constructor(execTrigger, overlays) {
        this.execTrigger = execTrigger;
        this.overlays = overlays;
        this.type = exports.CONTACT_CARD_EMBEDDABLE;
        this.getExplicitInput = () => {
            return new Promise(resolve => {
                const modalSession = this.overlays.openModal(public_1.toMountPoint(react_1.default.createElement(contact_card_initializer_1.ContactCardInitializer, { onCancel: () => {
                        modalSession.close();
                        resolve(undefined);
                    }, onCreate: (input) => {
                        modalSession.close();
                        resolve(input);
                    } })), {
                    'data-test-subj': 'createContactCardEmbeddable',
                });
            });
        };
        this.create = async (initialInput, parent) => {
            return new contact_card_embeddable_1.ContactCardEmbeddable(initialInput, {
                execAction: this.execTrigger,
            }, parent);
        };
    }
    async isEditable() {
        return true;
    }
    getDisplayName() {
        return i18n_1.i18n.translate('embeddableApi.samples.contactCard.displayName', {
            defaultMessage: 'contact card',
        });
    }
}
exports.ContactCardEmbeddableFactory = ContactCardEmbeddableFactory;
