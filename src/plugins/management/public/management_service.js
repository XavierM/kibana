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
const management_section_1 = require("./management_section");
class ManagementService {
    constructor() {
        this.sections = [];
        this.sharedInterface = {
            getSection: this.getSection.bind(this),
            getSectionsEnabled: this.getSectionsEnabled.bind(this),
            getAllSections: this.getAllSections.bind(this),
        };
    }
    register(registerLegacyApp, getLegacyManagement, getStartServices) {
        return (section) => {
            if (this.getSection(section.id)) {
                throw Error(`ManagementSection '${section.id}' already registered`);
            }
            const newSection = new management_section_1.ManagementSection(section, this.getSectionsEnabled.bind(this), registerLegacyApp, getLegacyManagement, getStartServices);
            this.sections.push(newSection);
            return newSection;
        };
    }
    getSection(sectionId) {
        return this.sections.find(section => section.id === sectionId);
    }
    getAllSections() {
        return this.sections;
    }
    getSectionsEnabled() {
        return this.sections
            .filter(section => section.getAppsEnabled().length > 0)
            .sort((a, b) => a.order - b.order);
    }
    setup(kibanaLegacy, getLegacyManagement, getStartServices) {
        const register = this.register.bind(this)(kibanaLegacy.registerLegacyApp, getLegacyManagement, getStartServices);
        register({ id: 'kibana', title: 'Kibana', order: 30, euiIconType: 'logoKibana' });
        register({
            id: 'elasticsearch',
            title: 'Elasticsearch',
            order: 20,
            euiIconType: 'logoElasticsearch',
        });
        return {
            register,
            ...this.sharedInterface,
        };
    }
    start(navigateToApp) {
        return {
            navigateToApp,
            ...this.sharedInterface,
        };
    }
}
exports.ManagementService = ManagementService;
