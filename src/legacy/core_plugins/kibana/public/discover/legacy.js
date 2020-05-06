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
const new_platform_1 = require("ui/new_platform");
const index_1 = require("./index");
// Legacy compatibility part - to be removed at cutover, replaced by a kibana.json file
exports.pluginInstance = index_1.plugin({});
exports.setup = exports.pluginInstance.setup(new_platform_1.npSetup.core, new_platform_1.npSetup.plugins);
exports.start = exports.pluginInstance.start(new_platform_1.npStart.core, new_platform_1.npStart.plugins);
