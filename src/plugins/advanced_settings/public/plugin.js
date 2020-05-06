"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const i18n_1 = require("@kbn/i18n");
const component_registry_1 = require("./component_registry");
const component = new component_registry_1.ComponentRegistry();
const title = i18n_1.i18n.translate('advancedSettings.advancedSettingsLabel', {
    defaultMessage: 'Advanced Settings',
});
class AdvancedSettingsPlugin {
    setup(core, { management }) {
        const kibanaSection = management.sections.getSection('kibana');
        if (!kibanaSection) {
            throw new Error('`kibana` management section not found.');
        }
        this.managementApp = kibanaSection.registerApp({
            id: 'settings',
            title,
            order: 20,
            async mount(params) {
                const { mountManagementSection } = await Promise.resolve().then(() => __importStar(require('./management_app/mount_management_section')));
                return mountManagementSection(core.getStartServices, params, component.start);
            },
        });
        return {
            component: component.setup,
        };
    }
    start(core) {
        if (!core.application.capabilities.management.kibana.settings) {
            this.managementApp.disable();
        }
        return {
            component: component.start,
        };
    }
}
exports.AdvancedSettingsPlugin = AdvancedSettingsPlugin;
