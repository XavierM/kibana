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
const moment_1 = tslib_1.__importDefault(require("moment"));
const operators_1 = require("rxjs/operators");
// @ts-ignore
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const server_1 = require("../../../core/server");
const telemetry_config_1 = require("../common/telemetry_config");
const telemetry_repository_1 = require("./telemetry_repository");
const constants_1 = require("../common/constants");
class FetcherTask {
    constructor(initializerContext) {
        this.initialCheckDelayMs = 60 * 1000 * 5;
        this.checkIntervalMs = 60 * 1000 * 60 * 12;
        this.isSending = false;
        this.config$ = initializerContext.config.create();
        this.currentKibanaVersion = initializerContext.env.packageInfo.version;
        this.logger = initializerContext.logger.get('fetcher');
    }
    start({ savedObjects, elasticsearch }, { telemetryCollectionManager }) {
        this.internalRepository = new server_1.SavedObjectsClient(savedObjects.createInternalRepository());
        this.telemetryCollectionManager = telemetryCollectionManager;
        this.elasticsearchClient = elasticsearch.legacy.createClient('telemetry-fetcher');
        setTimeout(() => {
            this.sendIfDue();
            this.intervalId = setInterval(() => this.sendIfDue(), this.checkIntervalMs);
        }, this.initialCheckDelayMs);
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.elasticsearchClient) {
            this.elasticsearchClient.close();
        }
    }
    async sendIfDue() {
        if (this.isSending) {
            return;
        }
        const telemetryConfig = await this.getCurrentConfigs();
        if (!this.shouldSendReport(telemetryConfig)) {
            return;
        }
        try {
            this.isSending = true;
            const clusters = await this.fetchTelemetry();
            const { telemetryUrl } = telemetryConfig;
            for (const cluster of clusters) {
                await this.sendTelemetry(telemetryUrl, cluster);
            }
            await this.updateLastReported();
        }
        catch (err) {
            await this.updateReportFailure(telemetryConfig);
            this.logger.warn(`Error sending telemetry usage data: ${err}`);
        }
        this.isSending = false;
    }
    async getCurrentConfigs() {
        const telemetrySavedObject = await telemetry_repository_1.getTelemetrySavedObject(this.internalRepository);
        const config = await this.config$.pipe(operators_1.take(1)).toPromise();
        const currentKibanaVersion = this.currentKibanaVersion;
        const configTelemetrySendUsageFrom = config.sendUsageFrom;
        const allowChangingOptInStatus = config.allowChangingOptInStatus;
        const configTelemetryOptIn = typeof config.optIn === 'undefined' ? null : config.optIn;
        const telemetryUrl = config.url;
        const { failureCount, failureVersion } = telemetry_config_1.getTelemetryFailureDetails({
            telemetrySavedObject,
        });
        return {
            telemetryOptIn: telemetry_config_1.getTelemetryOptIn({
                currentKibanaVersion,
                telemetrySavedObject,
                allowChangingOptInStatus,
                configTelemetryOptIn,
            }),
            telemetrySendUsageFrom: telemetry_config_1.getTelemetrySendUsageFrom({
                telemetrySavedObject,
                configTelemetrySendUsageFrom,
            }),
            telemetryUrl,
            failureCount,
            failureVersion,
        };
    }
    async updateLastReported() {
        this.lastReported = Date.now();
        telemetry_repository_1.updateTelemetrySavedObject(this.internalRepository, {
            reportFailureCount: 0,
            lastReported: this.lastReported,
        });
    }
    async updateReportFailure({ failureCount }) {
        telemetry_repository_1.updateTelemetrySavedObject(this.internalRepository, {
            reportFailureCount: failureCount + 1,
            reportFailureVersion: this.currentKibanaVersion,
        });
    }
    shouldSendReport({ telemetryOptIn, telemetrySendUsageFrom, reportFailureCount, currentVersion, reportFailureVersion, }) {
        if (reportFailureCount > 2 && reportFailureVersion === currentVersion) {
            return false;
        }
        if (telemetryOptIn && telemetrySendUsageFrom === 'server') {
            if (!this.lastReported || Date.now() - this.lastReported > constants_1.REPORT_INTERVAL_MS) {
                return true;
            }
        }
        return false;
    }
    async fetchTelemetry() {
        return await this.telemetryCollectionManager.getStats({
            unencrypted: false,
            start: moment_1.default()
                .subtract(20, 'minutes')
                .toISOString(),
            end: moment_1.default().toISOString(),
        });
    }
    async sendTelemetry(url, cluster) {
        this.logger.debug(`Sending usage stats.`);
        /**
         * send OPTIONS before sending usage data.
         * OPTIONS is less intrusive as it does not contain any payload and is used here to check if the endpoint is reachable.
         */
        await node_fetch_1.default(url, {
            method: 'options',
        });
        await node_fetch_1.default(url, {
            method: 'post',
            body: cluster,
        });
    }
}
exports.FetcherTask = FetcherTask;
