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
const get_vis_data_1 = require("./lib/get_vis_data");
const validation_telemetry_1 = require("./validation_telemetry");
const vis_1 = require("./routes/vis");
// @ts-ignore
const fields_1 = require("./routes/fields");
const search_strategies_1 = require("./lib/search_strategies");
class VisTypeTimeseriesPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.initializerContext = initializerContext;
        this.validationTelementryService = new validation_telemetry_1.ValidationTelemetryService();
    }
    setup(core, plugins) {
        const logger = this.initializerContext.logger.get('visTypeTimeseries');
        const config$ = this.initializerContext.config.create();
        // Global config contains things like the ES shard timeout
        const globalConfig$ = this.initializerContext.config.legacy.globalConfig$;
        const router = core.http.createRouter();
        const searchStrategyRegistry = new search_strategies_1.SearchStrategyRegistry();
        const framework = {
            core,
            plugins,
            config$,
            globalConfig$,
            logger,
            router,
            searchStrategyRegistry,
        };
        (async () => {
            const validationTelemetry = await this.validationTelementryService.setup(core, {
                ...plugins,
                globalConfig$,
            });
            vis_1.visDataRoutes(router, framework, validationTelemetry);
            fields_1.fieldsRoutes(framework);
        })();
        return {
            getVisData: async (requestContext, fakeRequest, options) => {
                return await get_vis_data_1.getVisData(requestContext, { ...fakeRequest, body: options }, framework);
            },
            addSearchStrategy: searchStrategyRegistry.addStrategy.bind(searchStrategyRegistry),
        };
    }
    start(core) { }
}
exports.VisTypeTimeseriesPlugin = VisTypeTimeseriesPlugin;
