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
class SavedObjectsManagement {
    constructor(registry) {
        this.registry = registry;
    }
    isImportAndExportable(type) {
        return this.registry.isImportableAndExportable(type);
    }
    getDefaultSearchField(type) {
        return this.registry.getType(type)?.management?.defaultSearchField;
    }
    getIcon(type) {
        return this.registry.getType(type)?.management?.icon;
    }
    getTitle(savedObject) {
        const getTitle = this.registry.getType(savedObject.type)?.management?.getTitle;
        return getTitle ? getTitle(savedObject) : undefined;
    }
    getEditUrl(savedObject) {
        const getEditUrl = this.registry.getType(savedObject.type)?.management?.getEditUrl;
        return getEditUrl ? getEditUrl(savedObject) : undefined;
    }
    getInAppUrl(savedObject) {
        const getInAppUrl = this.registry.getType(savedObject.type)?.management?.getInAppUrl;
        return getInAppUrl ? getInAppUrl(savedObject) : undefined;
    }
}
exports.SavedObjectsManagement = SavedObjectsManagement;
