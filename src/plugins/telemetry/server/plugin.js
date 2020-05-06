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
const server_1 = require("../../../core/server");
const routes_1 = require("./routes");
const telemetry_collection_1 = require("./telemetry_collection");
const collectors_1 = require("./collectors");
const fetcher_1 = require("./fetcher");
const handle_old_settings_1 = require("./handle_old_settings");
class TelemetryPlugin {
    constructor(initializerContext) {
        this.logger = initializerContext.logger.get();
        this.isDev = initializerContext.env.mode.dev;
        this.currentKibanaVersion = initializerContext.env.packageInfo.version;
        this.config$ = initializerContext.config.create();
        this.legacyConfig$ = initializerContext.config.legacy.globalConfig$;
        this.fetcherTask = new fetcher_1.FetcherTask({
            ...initializerContext,
            logger: this.logger,
        });
    }
    async setup({ elasticsearch, http, savedObjects, metrics }, { usageCollection, telemetryCollectionManager }) {
        const currentKibanaVersion = this.currentKibanaVersion;
        const config$ = this.config$;
        const isDev = this.isDev;
        telemetry_collection_1.registerCollection(telemetryCollectionManager, elasticsearch.dataClient);
        const router = http.createRouter();
        routes_1.registerRoutes({
            config$,
            currentKibanaVersion,
            isDev,
            router,
            telemetryCollectionManager,
        });
        this.registerMappings(opts => savedObjects.registerType(opts));
        this.registerUsageCollectors(usageCollection, metrics, opts => savedObjects.registerType(opts));
    }
    async start(core, { telemetryCollectionManager }) {
        const { savedObjects, uiSettings } = core;
        this.savedObjectsClient = savedObjects.createInternalRepository();
        const savedObjectsClient = new server_1.SavedObjectsClient(this.savedObjectsClient);
        this.uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);
        try {
            await handle_old_settings_1.handleOldSettings(savedObjectsClient, this.uiSettingsClient);
        }
        catch (error) {
            this.logger.warn('Unable to update legacy telemetry configs.');
        }
        this.fetcherTask.start(core, { telemetryCollectionManager });
    }
    registerMappings(registerType) {
        registerType({
            name: 'telemetry',
            hidden: false,
            namespaceType: 'agnostic',
            mappings: {
                properties: {
                    enabled: {
                        type: 'boolean',
                    },
                    sendUsageFrom: {
                        type: 'keyword',
                    },
                    lastReported: {
                        type: 'date',
                    },
                    lastVersionChecked: {
                        type: 'keyword',
                    },
                    userHasSeenNotice: {
                        type: 'boolean',
                    },
                    reportFailureCount: {
                        type: 'integer',
                    },
                    reportFailureVersion: {
                        type: 'keyword',
                    },
                    allowChangingOptInStatus: {
                        type: 'boolean',
                    },
                },
            },
        });
    }
    registerUsageCollectors(usageCollection, metrics, registerType) {
        const getSavedObjectsClient = () => this.savedObjectsClient;
        const getUiSettingsClient = () => this.uiSettingsClient;
        collectors_1.registerOpsStatsCollector(usageCollection, metrics.getOpsMetrics$());
        collectors_1.registerKibanaUsageCollector(usageCollection, this.legacyConfig$);
        collectors_1.registerTelemetryPluginUsageCollector(usageCollection, {
            currentKibanaVersion: this.currentKibanaVersion,
            config$: this.config$,
            getSavedObjectsClient,
        });
        collectors_1.registerTelemetryUsageCollector(usageCollection, this.config$);
        collectors_1.registerManagementUsageCollector(usageCollection, getUiSettingsClient);
        collectors_1.registerUiMetricUsageCollector(usageCollection, registerType, getSavedObjectsClient);
        collectors_1.registerApplicationUsageCollector(usageCollection, registerType, getSavedObjectsClient);
    }
}
exports.TelemetryPlugin = TelemetryPlugin;
