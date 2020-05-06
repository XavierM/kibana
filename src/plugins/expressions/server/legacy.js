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
/* eslint-disable max-classes-per-file */
// TODO: Remove this file once https://github.com/elastic/kibana/issues/46906 is complete.
// @ts-ignore
const common_1 = require("@kbn/interpreter/common");
const boom_1 = tslib_1.__importDefault(require("boom"));
const config_schema_1 = require("@kbn/config-schema");
const common_2 = require("../common");
const common_3 = require("../common");
class TypesRegistry extends common_1.Registry {
    wrapper(obj) {
        return new common_2.ExpressionType(obj);
    }
}
exports.TypesRegistry = TypesRegistry;
class FunctionsRegistry extends common_1.Registry {
    wrapper(obj) {
        return new common_1.Fn(obj);
    }
}
exports.FunctionsRegistry = FunctionsRegistry;
exports.registries = {
    types: new TypesRegistry(),
    serverFunctions: new FunctionsRegistry(),
};
exports.createLegacyServerInterpreterApi = () => {
    const api = common_1.registryFactory(exports.registries);
    common_1.register(exports.registries, {
        types: common_2.typeSpecs,
    });
    return api;
};
exports.createLegacyServerEndpoints = (api, logger, core, plugins) => {
    const router = core.http.createRouter();
    /**
     * Register the endpoint that returns the list of server-only functions.
     */
    router.get({
        path: `/api/interpreter/fns`,
        validate: {
            body: config_schema_1.schema.any(),
        },
    }, async (context, request, response) => {
        const functions = api.registries().serverFunctions.toJS();
        const body = JSON.stringify(functions);
        return response.ok({
            body,
        });
    });
    /**
     * Run a single Canvas function.
     *
     * @param {*} server - The Kibana server object
     * @param {*} handlers - The Canvas handlers
     * @param {*} fnCall - Describes the function being run `{ functionName, args, context }`
     */
    async function runFunction(handlers, fnCall) {
        const { functionName, args, context } = fnCall;
        const { deserialize } = common_3.serializeProvider(exports.registries.types.toJS());
        const fnDef = exports.registries.serverFunctions.toJS()[functionName];
        if (!fnDef)
            throw boom_1.default.notFound(`Function "${functionName}" could not be found.`);
        const deserialized = deserialize(context);
        const result = fnDef.fn(deserialized, args, handlers);
        return result;
    }
    /**
     * Register an endpoint that executes a batch of functions, and streams the
     * results back using ND-JSON.
     */
    plugins.bfetch.addBatchProcessingRoute(`/api/interpreter/fns`, request => {
        return {
            onBatchItem: async (fnCall) => {
                const [coreStart] = await core.getStartServices();
                const handlers = {
                    environment: 'server',
                    elasticsearchClient: coreStart.elasticsearch.legacy.client.asScoped(request)
                        .callAsCurrentUser,
                };
                const result = await runFunction(handlers, fnCall);
                if (typeof result === 'undefined') {
                    throw new Error(`Function ${fnCall.functionName} did not return anything.`);
                }
                return result;
            },
        };
    });
};
