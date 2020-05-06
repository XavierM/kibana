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
const context_1 = require("../../../context");
const test_utils_1 = require("../../../http/test_utils");
const mocks_1 = require("../../../mocks");
const coreId = Symbol('core');
exports.setupServer = async () => {
    const coreContext = test_utils_1.createCoreContext({ coreId });
    const contextService = new context_1.ContextService(coreContext);
    const server = test_utils_1.createHttpServer(coreContext);
    const httpSetup = await server.setup({
        context: contextService.setup({ pluginDependencies: new Map() }),
    });
    const handlerContext = mocks_1.coreMock.createRequestHandlerContext();
    httpSetup.registerRouteHandlerContext(coreId, 'core', async (ctx, req, res) => {
        return handlerContext;
    });
    return {
        server,
        httpSetup,
        handlerContext,
    };
};
exports.createExportableType = (name) => {
    return {
        name,
        hidden: false,
        namespaceType: 'single',
        mappings: {
            properties: {},
        },
        management: {
            importableAndExportable: true,
        },
    };
};
