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
const joi_1 = tslib_1.__importDefault(require("joi"));
const sample_dataset_schema_1 = require("./lib/sample_dataset_schema");
const data_sets_1 = require("./data_sets");
const routes_1 = require("./routes");
const usage_1 = require("./usage");
const uninstall_1 = require("./routes/uninstall");
const flightsSampleDataset = data_sets_1.flightsSpecProvider();
const logsSampleDataset = data_sets_1.logsSpecProvider();
const ecommerceSampleDataset = data_sets_1.ecommerceSpecProvider();
class SampleDataRegistry {
    constructor(initContext) {
        this.initContext = initContext;
        this.sampleDatasets = [
            flightsSampleDataset,
            logsSampleDataset,
            ecommerceSampleDataset,
        ];
    }
    setup(core, usageCollections) {
        if (usageCollections) {
            usage_1.makeSampleDataUsageCollector(usageCollections, this.initContext);
        }
        const usageTracker = usage_1.usage(core.getStartServices().then(([coreStart]) => coreStart.savedObjects), this.initContext.logger.get('sample_data', 'telemetry'));
        const router = core.http.createRouter();
        routes_1.createListRoute(router, this.sampleDatasets);
        routes_1.createInstallRoute(router, this.sampleDatasets, this.initContext.logger.get('sampleData'), usageTracker);
        uninstall_1.createUninstallRoute(router, this.sampleDatasets, usageTracker);
        return {
            registerSampleDataset: (specProvider) => {
                const { error, value } = joi_1.default.validate(specProvider(), sample_dataset_schema_1.sampleDataSchema);
                if (error) {
                    throw new Error(`Unable to register sample dataset spec because it's invalid. ${error}`);
                }
                const defaultIndexSavedObjectJson = value.savedObjects.find((savedObjectJson) => {
                    return (savedObjectJson.type === 'index-pattern' && savedObjectJson.id === value.defaultIndex);
                });
                if (!defaultIndexSavedObjectJson) {
                    throw new Error(`Unable to register sample dataset spec, defaultIndex: "${value.defaultIndex}" does not exist in savedObjects list.`);
                }
                const dashboardSavedObjectJson = value.savedObjects.find((savedObjectJson) => {
                    return (savedObjectJson.type === 'dashboard' && savedObjectJson.id === value.overviewDashboard);
                });
                if (!dashboardSavedObjectJson) {
                    throw new Error(`Unable to register sample dataset spec, overviewDashboard: "${value.overviewDashboard}" does not exist in savedObject list.`);
                }
                this.sampleDatasets.push(value);
            },
            getSampleDatasets: () => this.sampleDatasets,
            addSavedObjectsToSampleDataset: (id, savedObjects) => {
                const sampleDataset = this.sampleDatasets.find(dataset => {
                    return dataset.id === id;
                });
                if (!sampleDataset) {
                    throw new Error(`Unable to find sample dataset with id: ${id}`);
                }
                sampleDataset.savedObjects = sampleDataset.savedObjects.concat(savedObjects);
            },
            addAppLinksToSampleDataset: (id, appLinks) => {
                const sampleDataset = this.sampleDatasets.find(dataset => {
                    return dataset.id === id;
                });
                if (!sampleDataset) {
                    throw new Error(`Unable to find sample dataset with id: ${id}`);
                }
                sampleDataset.appLinks = sampleDataset.appLinks
                    ? sampleDataset.appLinks.concat(appLinks)
                    : [];
            },
            replacePanelInSampleDatasetDashboard: ({ sampleDataId, dashboardId, oldEmbeddableId, embeddableId, embeddableType, embeddableConfig, }) => {
                const sampleDataset = this.sampleDatasets.find(dataset => {
                    return dataset.id === sampleDataId;
                });
                if (!sampleDataset) {
                    throw new Error(`Unable to find sample dataset with id: ${sampleDataId}`);
                }
                const dashboard = sampleDataset.savedObjects.find(savedObject => {
                    return savedObject.id === dashboardId && savedObject.type === 'dashboard';
                });
                if (!dashboard) {
                    throw new Error(`Unable to find dashboard with id: ${dashboardId}`);
                }
                try {
                    const reference = dashboard.references.find((referenceItem) => {
                        return referenceItem.id === oldEmbeddableId;
                    });
                    if (!reference) {
                        throw new Error(`Unable to find reference for embeddable: ${oldEmbeddableId}`);
                    }
                    reference.type = embeddableType;
                    reference.id = embeddableId;
                    const panels = JSON.parse(dashboard.attributes.panelsJSON);
                    const panel = panels.find((panelItem) => {
                        return panelItem.panelRefName === reference.name;
                    });
                    if (!panel) {
                        throw new Error(`Unable to find panel for reference: ${reference.name}`);
                    }
                    panel.embeddableConfig = embeddableConfig;
                    dashboard.attributes.panelsJSON = JSON.stringify(panels);
                }
                catch (error) {
                    throw new Error(`Unable to replace panel with embeddable ${oldEmbeddableId}, error: ${error}`);
                }
            },
        };
    }
    start() {
        return {};
    }
}
exports.SampleDataRegistry = SampleDataRegistry;
