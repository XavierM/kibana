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
const sinon_1 = tslib_1.__importDefault(require("sinon"));
exports.functionsRegistry = {};
exports.renderersRegistry = {};
exports.typesRegistry = {};
exports.registries = {
    browserFunctions: exports.functionsRegistry,
    renderers: exports.renderersRegistry,
    types: exports.typesRegistry,
    loadLegacyServerFunctionWrappers: () => Promise.resolve(),
};
const resetRegistry = (registry) => {
    registry.wrapper = sinon_1.default.stub();
    registry.register = sinon_1.default.stub();
    registry.toJS = sinon_1.default.stub();
    registry.toArray = sinon_1.default.stub();
    registry.get = sinon_1.default.stub();
    registry.getProp = sinon_1.default.stub();
    registry.reset = sinon_1.default.stub();
};
const resetAll = () => Object.values(exports.registries).forEach(resetRegistry);
resetAll();
afterEach(resetAll);
