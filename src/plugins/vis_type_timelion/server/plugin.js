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
const i18n_1 = require("@kbn/i18n");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../../../src/core/utils");
const load_functions_1 = tslib_1.__importDefault(require("./lib/load_functions"));
const functions_1 = require("./routes/functions");
const validate_es_1 = require("./routes/validate_es");
const run_1 = require("./routes/run");
const config_manager_1 = require("./lib/config_manager");
/**
 * Represents Timelion Plugin instance that will be managed by the Kibana plugin system.
 */
class Plugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core) {
        const config = await this.initializerContext.config
            .create()
            .pipe(operators_1.first())
            .toPromise();
        const configManager = new config_manager_1.ConfigManager(this.initializerContext.config);
        const functions = load_functions_1.default('series_functions');
        const getFunction = (name) => {
            if (functions[name]) {
                return functions[name];
            }
            throw new Error(i18n_1.i18n.translate('timelion.noFunctionErrorMessage', {
                defaultMessage: 'No such function: {name}',
                values: { name },
            }));
        };
        const logger = this.initializerContext.logger.get('timelion');
        const router = core.http.createRouter();
        const deps = {
            configManager,
            functions,
            getFunction,
            logger,
        };
        functions_1.functionsRoute(router, deps);
        run_1.runRoute(router, deps);
        validate_es_1.validateEsRoute(router);
        return utils_1.deepFreeze({ uiEnabled: config.ui.enabled });
    }
    start() {
        this.initializerContext.logger.get().debug('Starting plugin');
    }
    stop() {
        this.initializerContext.logger.get().debug('Stopping plugin');
    }
}
exports.Plugin = Plugin;
