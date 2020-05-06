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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../utils");
const cluster_client_1 = require("./cluster_client");
const elasticsearch_config_1 = require("./elasticsearch_config");
const ensure_es_version_1 = require("./version_check/ensure_es_version");
const status_1 = require("./status");
/** @internal */
class ElasticsearchService {
    constructor(coreContext) {
        this.coreContext = coreContext;
        this.stop$ = new rxjs_1.Subject();
        this.kibanaVersion = coreContext.env.packageInfo.version;
        this.log = coreContext.logger.get('elasticsearch-service');
        this.config$ = coreContext.configService
            .atPath('elasticsearch')
            .pipe(operators_1.map(rawConfig => new elasticsearch_config_1.ElasticsearchConfig(rawConfig)));
    }
    async setup(deps) {
        this.log.debug('Setting up elasticsearch service');
        const clients$ = this.config$.pipe(operators_1.filter(() => {
            if (this.subscription !== undefined) {
                this.log.error('Clients cannot be changed after they are created');
                return false;
            }
            return true;
        }), operators_1.switchMap(config => new rxjs_1.Observable(subscriber => {
            this.log.debug(`Creating elasticsearch clients`);
            const coreClients = {
                config,
                adminClient: this.createClusterClient('admin', config),
                dataClient: this.createClusterClient('data', config, deps.http.getAuthHeaders),
            };
            subscriber.next(coreClients);
            return () => {
                this.log.debug(`Closing elasticsearch clients`);
                coreClients.adminClient.close();
                coreClients.dataClient.close();
            };
        })), operators_1.publishReplay(1));
        this.subscription = clients$.connect();
        const config = await this.config$.pipe(operators_1.first()).toPromise();
        const adminClient$ = clients$.pipe(operators_1.map(clients => clients.adminClient));
        const dataClient$ = clients$.pipe(operators_1.map(clients => clients.dataClient));
        this.adminClient = {
            async callAsInternalUser(endpoint, clientParams = {}, options) {
                const client = await adminClient$.pipe(operators_1.take(1)).toPromise();
                return await client.callAsInternalUser(endpoint, clientParams, options);
            },
            asScoped: (request) => {
                return {
                    callAsInternalUser: this.adminClient.callAsInternalUser,
                    async callAsCurrentUser(endpoint, clientParams = {}, options) {
                        const client = await adminClient$.pipe(operators_1.take(1)).toPromise();
                        return await client
                            .asScoped(request)
                            .callAsCurrentUser(endpoint, clientParams, options);
                    },
                };
            },
        };
        const dataClient = {
            async callAsInternalUser(endpoint, clientParams = {}, options) {
                const client = await dataClient$.pipe(operators_1.take(1)).toPromise();
                return await client.callAsInternalUser(endpoint, clientParams, options);
            },
            asScoped(request) {
                return {
                    callAsInternalUser: dataClient.callAsInternalUser,
                    async callAsCurrentUser(endpoint, clientParams = {}, options) {
                        const client = await dataClient$.pipe(operators_1.take(1)).toPromise();
                        return await client
                            .asScoped(request)
                            .callAsCurrentUser(endpoint, clientParams, options);
                    },
                };
            },
        };
        const esNodesCompatibility$ = ensure_es_version_1.pollEsNodesVersion({
            callWithInternalUser: this.adminClient.callAsInternalUser,
            log: this.log,
            ignoreVersionMismatch: config.ignoreVersionMismatch,
            esVersionCheckInterval: config.healthCheckDelay.asMilliseconds(),
            kibanaVersion: this.kibanaVersion,
        }).pipe(operators_1.takeUntil(this.stop$), operators_1.shareReplay({ refCount: true, bufferSize: 1 }));
        this.createClient = (type, clientConfig = {}) => {
            const finalConfig = utils_1.merge({}, config, clientConfig);
            return this.createClusterClient(type, finalConfig, deps.http.getAuthHeaders);
        };
        return {
            legacy: { config$: clients$.pipe(operators_1.map(clients => clients.config)) },
            esNodesCompatibility$,
            adminClient: this.adminClient,
            dataClient,
            createClient: this.createClient,
            status$: status_1.calculateStatus$(esNodesCompatibility$),
        };
    }
    async start() {
        if (typeof this.adminClient === 'undefined' || typeof this.createClient === 'undefined') {
            throw new Error('ElasticsearchService needs to be setup before calling start');
        }
        else {
            return {
                legacy: {
                    client: this.adminClient,
                    createClient: this.createClient,
                },
            };
        }
    }
    async stop() {
        this.log.debug('Stopping elasticsearch service');
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
        this.stop$.next();
    }
    createClusterClient(type, config, getAuthHeaders) {
        return new cluster_client_1.ClusterClient(config, this.coreContext.logger.get('elasticsearch', type), getAuthHeaders);
    }
}
exports.ElasticsearchService = ElasticsearchService;
