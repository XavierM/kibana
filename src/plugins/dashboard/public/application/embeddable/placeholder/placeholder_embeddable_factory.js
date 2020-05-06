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
const placeholder_embeddable_1 = require("./placeholder_embeddable");
class PlaceholderEmbeddableFactory {
    constructor() {
        this.type = placeholder_embeddable_1.PLACEHOLDER_EMBEDDABLE;
    }
    async isEditable() {
        return false;
    }
    canCreateNew() {
        return false;
    }
    async create(initialInput, parent) {
        return new placeholder_embeddable_1.PlaceholderEmbeddable(initialInput, parent);
    }
    getDisplayName() {
        return i18n_1.i18n.translate('dashboard.placeholder.factory.displayName', {
            defaultMessage: 'placeholder',
        });
    }
}
exports.PlaceholderEmbeddableFactory = PlaceholderEmbeddableFactory;
