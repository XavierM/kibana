"use strict";
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
const operators_1 = require("rxjs/operators");
const console_legacy_1 = require("../../../legacy/core_plugins/console_legacy");
const lib_1 = require("./lib");
const services_1 = require("./services");
const proxy_1 = require("./routes/api/console/proxy");
const spec_definitions_1 = require("./routes/api/console/spec_definitions");
class ConsoleServerPlugin {
    constructor(ctx) {
        this.ctx = ctx;
        this.specDefinitionsService = new services_1.SpecDefinitionsService();
        this.log = this.ctx.logger.get();
    }
    async setup({ http, capabilities, getStartServices }) {
        capabilities.registerProvider(() => ({
            dev_tools: {
                show: true,
                save: true,
            },
        }));
        const config = await this.ctx.config
            .create()
            .pipe(operators_1.first())
            .toPromise();
        const { elasticsearch } = await this.ctx.config.legacy.globalConfig$.pipe(operators_1.first()).toPromise();
        const proxyPathFilters = config.proxyFilter.map((str) => new RegExp(str));
        const router = http.createRouter();
        proxy_1.registerProxyRoute({
            log: this.log,
            proxyConfigCollection: new lib_1.ProxyConfigCollection(config.proxyConfig),
            readLegacyESConfig: () => {
                const legacyConfig = console_legacy_1.readLegacyEsConfig();
                return {
                    ...elasticsearch,
                    ...legacyConfig,
                };
            },
            pathFilters: proxyPathFilters,
            router,
        });
        spec_definitions_1.registerSpecDefinitionsRoute({
            router,
            services: { specDefinitions: this.specDefinitionsService },
        });
        return {
            ...this.specDefinitionsService.setup(),
        };
    }
    start() {
        return {
            ...this.specDefinitionsService.start(),
        };
    }
}
exports.ConsoleServerPlugin = ConsoleServerPlugin;
