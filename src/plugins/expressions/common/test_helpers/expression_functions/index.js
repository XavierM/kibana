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
const access_1 = require("./access");
const add_1 = require("./add");
const error_1 = require("./error");
const introspect_context_1 = require("./introspect_context");
const mult_1 = require("./mult");
const sleep_1 = require("./sleep");
exports.functionTestSpecs = [
    access_1.access,
    add_1.add,
    error_1.error,
    introspect_context_1.introspectContext,
    mult_1.mult,
    sleep_1.sleep,
];
