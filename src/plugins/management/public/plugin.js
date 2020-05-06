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
const management_service_1 = require("./management_service");
const public_1 = require("../../home/public");
// @ts-ignore
const legacy_1 = require("./legacy");
class ManagementPlugin {
    constructor() {
        this.managementSections = new management_service_1.ManagementService();
        this.legacyManagement = new legacy_1.LegacyManagementAdapter();
    }
    setup(core, { kibanaLegacy, home }) {
        home.featureCatalogue.register({
            id: 'stack-management',
            title: i18n_1.i18n.translate('management.displayName', {
                defaultMessage: 'Management',
            }),
            description: i18n_1.i18n.translate('management.stackManagement.managementDescription', {
                defaultMessage: 'Your center console for managing the Elastic Stack.',
            }),
            icon: 'managementApp',
            path: '/app/kibana#/management',
            showOnHomePage: false,
            category: public_1.FeatureCatalogueCategory.ADMIN,
        });
        return {
            sections: this.managementSections.setup(kibanaLegacy, this.legacyManagement.getManagement, core.getStartServices),
        };
    }
    start(core) {
        return {
            sections: this.managementSections.start(core.application.navigateToApp),
            legacy: this.legacyManagement.init(core.application.capabilities),
        };
    }
}
exports.ManagementPlugin = ManagementPlugin;
