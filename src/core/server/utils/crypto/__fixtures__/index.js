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
const path_1 = require("path");
exports.NO_CA_PATH = path_1.resolve(__dirname, './no_ca.p12');
exports.NO_CERT_PATH = path_1.resolve(__dirname, './no_cert.p12');
exports.NO_KEY_PATH = path_1.resolve(__dirname, './no_key.p12');
exports.TWO_CAS_PATH = path_1.resolve(__dirname, './two_cas.p12');
exports.TWO_KEYS_PATH = path_1.resolve(__dirname, './two_keys.p12');
