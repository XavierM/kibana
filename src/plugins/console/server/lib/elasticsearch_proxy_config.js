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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const http_1 = tslib_1.__importDefault(require("http"));
const https_1 = tslib_1.__importDefault(require("https"));
const url_1 = tslib_1.__importDefault(require("url"));
const createAgent = (legacyConfig) => {
    const target = url_1.default.parse(lodash_1.default.head(legacyConfig.hosts));
    if (!/^https/.test(target.protocol || ''))
        return new http_1.default.Agent();
    const agentOptions = {};
    const verificationMode = legacyConfig.ssl && legacyConfig.ssl.verificationMode;
    switch (verificationMode) {
        case 'none':
            agentOptions.rejectUnauthorized = false;
            break;
        case 'certificate':
            agentOptions.rejectUnauthorized = true;
            // by default, NodeJS is checking the server identify
            agentOptions.checkServerIdentity = lodash_1.default.noop;
            break;
        case 'full':
            agentOptions.rejectUnauthorized = true;
            break;
        default:
            throw new Error(`Unknown ssl verificationMode: ${verificationMode}`);
    }
    agentOptions.ca = legacyConfig.ssl?.certificateAuthorities;
    const ignoreCertAndKey = !legacyConfig.ssl?.alwaysPresentCertificate;
    if (!ignoreCertAndKey && legacyConfig.ssl?.certificate && legacyConfig.ssl?.key) {
        agentOptions.cert = legacyConfig.ssl.certificate;
        agentOptions.key = legacyConfig.ssl.key;
        agentOptions.passphrase = legacyConfig.ssl.keyPassphrase;
    }
    return new https_1.default.Agent(agentOptions);
};
exports.getElasticsearchProxyConfig = (legacyConfig) => {
    return {
        timeout: legacyConfig.requestTimeout.asMilliseconds(),
        agent: createAgent(legacyConfig),
    };
};
