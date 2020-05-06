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
const legacy_1 = require("./legacy");
const common_1 = require("../common");
class ExpressionsServerPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.expressions = new common_1.ExpressionsService();
    }
    setup(core, plugins) {
        const logger = this.initializerContext.logger.get();
        const { expressions } = this;
        const { executor } = expressions;
        executor.extendContext({
            environment: 'server',
        });
        const legacyApi = legacy_1.createLegacyServerInterpreterApi();
        legacy_1.createLegacyServerEndpoints(legacyApi, logger, core, plugins);
        const setup = {
            ...this.expressions.setup(),
            __LEGACY: legacyApi,
        };
        return Object.freeze(setup);
    }
    start(core, plugins) {
        const start = this.expressions.start();
        return Object.freeze(start);
    }
    stop() {
        this.expressions.stop();
    }
}
exports.ExpressionsServerPlugin = ExpressionsServerPlugin;
