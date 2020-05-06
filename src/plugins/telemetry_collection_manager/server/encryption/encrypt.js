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
const request_crypto_1 = require("@elastic/request-crypto");
const telemetry_jwks_1 = require("./telemetry_jwks");
function getKID(useProdKey = false) {
    return useProdKey ? 'kibana' : 'kibana_dev';
}
exports.getKID = getKID;
async function encryptTelemetry(payload, { useProdKey = false } = {}) {
    const kid = getKID(useProdKey);
    const encryptor = await request_crypto_1.createRequestEncryptor(telemetry_jwks_1.telemetryJWKS);
    const clusters = [].concat(payload);
    return Promise.all(clusters.map((cluster) => encryptor.encrypt(kid, cluster)));
}
exports.encryptTelemetry = encryptTelemetry;
