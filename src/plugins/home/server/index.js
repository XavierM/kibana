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
const plugin_1 = require("./plugin");
const config_1 = require("../config");
exports.config = {
    exposeToBrowser: {
        disableWelcomeScreen: true,
    },
    schema: config_1.configSchema,
    deprecations: ({ renameFromRoot }) => [
        renameFromRoot('kibana.disableWelcomeScreen', 'home.disableWelcomeScreen'),
    ],
};
exports.plugin = (initContext) => new plugin_1.HomeServerPlugin(initContext);
var instruction_variant_1 = require("../common/instruction_variant");
exports.INSTRUCTION_VARIANT = instruction_variant_1.INSTRUCTION_VARIANT;
var tutorials_1 = require("./services/tutorials");
exports.TutorialsCategory = tutorials_1.TutorialsCategory;
