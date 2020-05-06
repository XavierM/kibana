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
/* eslint-disable @kbn/eslint/no-restricted-paths */
const mocks_1 = require("../../../../../core/public/mocks");
const mocks_2 = require("../../../../../plugins/data/public/mocks");
const mocks_3 = require("../../../../../plugins/embeddable/public/mocks");
const mocks_4 = require("../../../../../plugins/navigation/public/mocks");
const mocks_5 = require("../../../../../plugins/expressions/public/mocks");
const mocks_6 = require("../../../../../plugins/inspector/public/mocks");
const mocks_7 = require("../../../../../plugins/ui_actions/public/mocks");
const mocks_8 = require("../../../../../plugins/management/public/mocks");
const mocks_9 = require("../../../../../plugins/usage_collection/public/mocks");
const mocks_10 = require("../../../../../plugins/kibana_legacy/public/mocks");
const mocks_11 = require("../../../../../plugins/charts/public/mocks");
const mocks_12 = require("../../../../../plugins/advanced_settings/public/mocks");
const mocks_13 = require("../../../../../plugins/saved_objects_management/public/mocks");
const mocks_14 = require("../../../../../plugins/visualizations/public/mocks");
/* eslint-enable @kbn/eslint/no-restricted-paths */
exports.pluginsMock = {
    createSetup: () => ({
        data: mocks_2.dataPluginMock.createSetupContract(),
        charts: mocks_11.chartPluginMock.createSetupContract(),
        navigation: mocks_4.navigationPluginMock.createSetupContract(),
        embeddable: mocks_3.embeddablePluginMock.createSetupContract(),
        inspector: mocks_6.inspectorPluginMock.createSetupContract(),
        expressions: mocks_5.expressionsPluginMock.createSetupContract(),
        uiActions: mocks_7.uiActionsPluginMock.createSetupContract(),
        usageCollection: mocks_9.usageCollectionPluginMock.createSetupContract(),
        advancedSettings: mocks_12.advancedSettingsMock.createSetupContract(),
        visualizations: mocks_14.visualizationsPluginMock.createSetupContract(),
        kibanaLegacy: mocks_10.kibanaLegacyPluginMock.createSetupContract(),
        savedObjectsManagement: mocks_13.savedObjectsManagementPluginMock.createSetupContract(),
    }),
    createStart: () => ({
        data: mocks_2.dataPluginMock.createStartContract(),
        charts: mocks_11.chartPluginMock.createStartContract(),
        navigation: mocks_4.navigationPluginMock.createStartContract(),
        embeddable: mocks_3.embeddablePluginMock.createStartContract(),
        inspector: mocks_6.inspectorPluginMock.createStartContract(),
        expressions: mocks_5.expressionsPluginMock.createStartContract(),
        uiActions: mocks_7.uiActionsPluginMock.createStartContract(),
        management: mocks_8.managementPluginMock.createStartContract(),
        advancedSettings: mocks_12.advancedSettingsMock.createStartContract(),
        visualizations: mocks_14.visualizationsPluginMock.createStartContract(),
        kibanaLegacy: mocks_10.kibanaLegacyPluginMock.createStartContract(),
        savedObjectsManagement: mocks_13.savedObjectsManagementPluginMock.createStartContract(),
    }),
};
exports.createUiNewPlatformMock = () => {
    const mock = {
        npSetup: {
            core: mocks_1.coreMock.createSetup(),
            plugins: exports.pluginsMock.createSetup(),
        },
        npStart: {
            core: mocks_1.coreMock.createStart(),
            plugins: exports.pluginsMock.createStart(),
        },
    };
    return mock;
};
