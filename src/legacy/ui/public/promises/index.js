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
const public_1 = require("../../../../plugins/kibana_legacy/public");
var defer_1 = require("./defer");
exports.createDefer = defer_1.createDefer;
// @ts-ignore
const modules_1 = require("../modules");
const module = modules_1.uiModules.get('kibana');
// Provides a tiny subset of the excellent API from
// bluebird, reimplemented using the $q service
module.service('Promise', public_1.PromiseServiceCreator);
