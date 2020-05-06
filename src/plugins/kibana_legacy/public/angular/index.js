"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
// @ts-ignore
var promises_1 = require("./promises");
exports.PromiseServiceCreator = promises_1.PromiseServiceCreator;
// @ts-ignore
var watch_multi_1 = require("./watch_multi");
exports.watchMultiDecorator = watch_multi_1.watchMultiDecorator;
tslib_1.__exportStar(require("./angular_config"), exports);
// @ts-ignore
var kbn_top_nav_1 = require("./kbn_top_nav");
exports.createTopNavDirective = kbn_top_nav_1.createTopNavDirective;
exports.createTopNavHelper = kbn_top_nav_1.createTopNavHelper;
exports.loadKbnTopNavDirectives = kbn_top_nav_1.loadKbnTopNavDirectives;
var subscribe_with_scope_1 = require("./subscribe_with_scope");
exports.subscribeWithScope = subscribe_with_scope_1.subscribeWithScope;
