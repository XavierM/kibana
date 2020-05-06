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
const encryption_1 = require("./encryption");
class TelemetryCollectionManagerPlugin {
    constructor(initializerContext) {
        this.collections = [];
        this.usageGetterMethodPriority = -1;
        this.getOptInStatsForCollection = async (collection, optInStatus, statsCollectionConfig) => {
            const context = {
                logger: this.logger.get(collection.title),
                version: this.version,
                ...collection.customContext,
            };
            const clustersDetails = await collection.clusterDetailsGetter(statsCollectionConfig, context);
            return clustersDetails.map(({ clusterUuid }) => ({
                cluster_uuid: clusterUuid,
                opt_in_status: optInStatus,
            }));
        };
        this.logger = initializerContext.logger.get();
        this.isDistributable = initializerContext.env.packageInfo.dist;
        this.version = initializerContext.env.packageInfo.version;
    }
    setup(core, { usageCollection }) {
        this.usageCollection = usageCollection;
        return {
            setCollection: this.setCollection.bind(this),
            getOptInStats: this.getOptInStats.bind(this),
            getStats: this.getStats.bind(this),
        };
    }
    start(core) {
        return {
            setCollection: this.setCollection.bind(this),
            getOptInStats: this.getOptInStats.bind(this),
            getStats: this.getStats.bind(this),
        };
    }
    stop() { }
    setCollection(collectionConfig) {
        const { title, priority, esCluster, statsGetter, clusterDetailsGetter, licenseGetter, } = collectionConfig;
        if (typeof priority !== 'number') {
            throw new Error('priority must be set.');
        }
        if (priority === this.usageGetterMethodPriority) {
            throw new Error(`A Usage Getter with the same priority is already set.`);
        }
        if (priority > this.usageGetterMethodPriority) {
            if (!statsGetter) {
                throw Error('Stats getter method not set.');
            }
            if (!esCluster) {
                throw Error('esCluster name must be set for the getCluster method.');
            }
            if (!clusterDetailsGetter) {
                throw Error('Cluster UUIds method is not set.');
            }
            if (!licenseGetter) {
                throw Error('License getter method not set.');
            }
            this.collections.unshift({
                licenseGetter,
                statsGetter,
                clusterDetailsGetter,
                esCluster,
                title,
            });
            this.usageGetterMethodPriority = priority;
        }
    }
    getStatsCollectionConfig(config, collection, usageCollection) {
        const { start, end, request } = config;
        const callCluster = config.unencrypted
            ? collection.esCluster.asScoped(request).callAsCurrentUser
            : collection.esCluster.callAsInternalUser;
        return { callCluster, start, end, usageCollection };
    }
    async getOptInStats(optInStatus, config) {
        if (!this.usageCollection) {
            return [];
        }
        for (const collection of this.collections) {
            const statsCollectionConfig = this.getStatsCollectionConfig(config, collection, this.usageCollection);
            try {
                const optInStats = await this.getOptInStatsForCollection(collection, optInStatus, statsCollectionConfig);
                if (optInStats && optInStats.length) {
                    this.logger.debug(`Got Opt In stats using ${collection.title} collection.`);
                    if (config.unencrypted) {
                        return optInStats;
                    }
                    return encryption_1.encryptTelemetry(optInStats, { useProdKey: this.isDistributable });
                }
            }
            catch (err) {
                this.logger.debug(`Failed to collect any opt in stats with registered collections.`);
                // swallow error to try next collection;
            }
        }
        return [];
    }
    async getStats(config) {
        if (!this.usageCollection) {
            return [];
        }
        for (const collection of this.collections) {
            const statsCollectionConfig = this.getStatsCollectionConfig(config, collection, this.usageCollection);
            try {
                const usageData = await this.getUsageForCollection(collection, statsCollectionConfig);
                if (usageData.length) {
                    this.logger.debug(`Got Usage using ${collection.title} collection.`);
                    if (config.unencrypted) {
                        return usageData;
                    }
                    return encryption_1.encryptTelemetry(usageData, { useProdKey: this.isDistributable });
                }
            }
            catch (err) {
                this.logger.debug(`Failed to collect any usage with registered collection ${collection.title}.`);
                // swallow error to try next collection;
            }
        }
        return [];
    }
    async getUsageForCollection(collection, statsCollectionConfig) {
        const context = {
            logger: this.logger.get(collection.title),
            version: this.version,
            ...collection.customContext,
        };
        const clustersDetails = await collection.clusterDetailsGetter(statsCollectionConfig, context);
        if (clustersDetails.length === 0) {
            // don't bother doing a further lookup, try next collection.
            return [];
        }
        const [stats, licenses] = await Promise.all([
            collection.statsGetter(clustersDetails, statsCollectionConfig, context),
            collection.licenseGetter(clustersDetails, statsCollectionConfig, context),
        ]);
        return stats.map(stat => {
            const license = licenses[stat.cluster_uuid];
            return {
                ...(license ? { license } : {}),
                ...stat,
                collectionSource: collection.title,
            };
        });
    }
}
exports.TelemetryCollectionManagerPlugin = TelemetryCollectionManagerPlugin;
