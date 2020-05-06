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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../home/public");
const services_1 = require("./services");
const register_services_1 = require("./register_services");
class SavedObjectsManagementPlugin {
    constructor() {
        this.actionService = new services_1.SavedObjectsManagementActionService();
        this.serviceRegistry = new services_1.SavedObjectsManagementServiceRegistry();
    }
    setup(core, { home, management }) {
        const actionSetup = this.actionService.setup();
        home.featureCatalogue.register({
            id: 'saved_objects',
            title: i18n_1.i18n.translate('savedObjectsManagement.objects.savedObjectsTitle', {
                defaultMessage: 'Saved Objects',
            }),
            description: i18n_1.i18n.translate('savedObjectsManagement.objects.savedObjectsDescription', {
                defaultMessage: 'Import, export, and manage your saved searches, visualizations, and dashboards.',
            }),
            icon: 'savedObjectsApp',
            path: '/app/kibana#/management/kibana/objects',
            showOnHomePage: true,
            category: public_1.FeatureCatalogueCategory.ADMIN,
        });
        const kibanaSection = management.sections.getSection('kibana');
        if (!kibanaSection) {
            throw new Error('`kibana` management section not found.');
        }
        kibanaSection.registerApp({
            id: 'objects',
            title: i18n_1.i18n.translate('savedObjectsManagement.managementSectionLabel', {
                defaultMessage: 'Saved Objects',
            }),
            order: 10,
            mount: async (mountParams) => {
                const { mountManagementSection } = await Promise.resolve().then(() => __importStar(require('./management_section')));
                return mountManagementSection({
                    core,
                    serviceRegistry: this.serviceRegistry,
                    mountParams,
                });
            },
        });
        // depends on `getStartServices`, should not be awaited
        register_services_1.registerServices(this.serviceRegistry, core.getStartServices);
        return {
            actions: actionSetup,
            serviceRegistry: this.serviceRegistry,
        };
    }
    start(core, { data }) {
        const actionStart = this.actionService.start();
        return {
            actions: actionStart,
        };
    }
}
exports.SavedObjectsManagementPlugin = SavedObjectsManagementPlugin;
