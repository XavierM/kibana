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
const contact_card_embeddable_1 = require("./contact_card_embeddable");
const contact_card_embeddable_factory_1 = require("./contact_card_embeddable_factory");
class SlowContactCardEmbeddableFactory {
    constructor(options) {
        this.options = options;
        this.loadTickCount = 0;
        this.type = contact_card_embeddable_factory_1.CONTACT_CARD_EMBEDDABLE;
        this.create = async (initialInput, parent) => {
            for (let i = 0; i < this.loadTickCount; i++) {
                await Promise.resolve();
            }
            return new contact_card_embeddable_1.ContactCardEmbeddable(initialInput, { execAction: this.options.execAction }, parent);
        };
        if (options.loadTickCount) {
            this.loadTickCount = options.loadTickCount;
        }
    }
    async isEditable() {
        return true;
    }
    getDisplayName() {
        return 'slow to load contact card';
    }
}
exports.SlowContactCardEmbeddableFactory = SlowContactCardEmbeddableFactory;
