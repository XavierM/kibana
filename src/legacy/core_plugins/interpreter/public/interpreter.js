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
require("uiExports/interpreter");
// @ts-ignore
const common_1 = require("@kbn/interpreter/common");
const new_platform_1 = require("ui/new_platform");
const registries_1 = require("./registries");
// Expose kbnInterpreter.register(specs) and kbnInterpreter.registries() globally so that plugins
// can register without a transpile step.
// TODO: This will be left behind in then legacy platform?
global.kbnInterpreter = Object.assign(global.kbnInterpreter || {}, common_1.registryFactory(registries_1.registries));
// TODO: This function will be left behind in the legacy platform.
let executorPromise;
exports.getInterpreter = async () => {
    if (!executorPromise) {
        const executor = new_platform_1.npSetup.plugins.expressions.__LEGACY.getExecutor();
        executorPromise = Promise.resolve(executor);
    }
    return await executorPromise;
};
// TODO: This function will be left behind in the legacy platform.
exports.interpretAst = async (ast, context, handlers) => {
    const { interpreter } = await exports.getInterpreter();
    return await interpreter.interpretAst(ast, context, handlers);
};
