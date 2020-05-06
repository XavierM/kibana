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
const lodash_1 = require("lodash");
const url_1 = require("url");
const https_1 = require("https");
const wildcard_matcher_1 = require("./wildcard_matcher");
class ProxyConfig {
    constructor(config) {
        config = {
            ...config,
        };
        // -----
        // read "match" info
        // -----
        const rawMatches = {
            ...config.match,
        };
        this.id =
            url_1.format({
                protocol: rawMatches.protocol,
                hostname: rawMatches.host,
                port: rawMatches.port,
                pathname: rawMatches.path,
            }) || '*';
        this.matchers = {
            protocol: new wildcard_matcher_1.WildcardMatcher(rawMatches.protocol),
            host: new wildcard_matcher_1.WildcardMatcher(rawMatches.host),
            port: new wildcard_matcher_1.WildcardMatcher(rawMatches.port),
            path: new wildcard_matcher_1.WildcardMatcher(rawMatches.path, '/'),
        };
        // -----
        // read config vars
        // -----
        this.timeout = config.timeout;
        this.sslAgent = this._makeSslAgent(config);
    }
    _makeSslAgent(config) {
        const ssl = config.ssl || {};
        this.verifySsl = ssl.verify;
        const sslAgentOpts = {
            ca: ssl.ca,
            cert: ssl.cert,
            key: ssl.key,
        };
        if (lodash_1.values(sslAgentOpts).filter(Boolean).length) {
            sslAgentOpts.rejectUnauthorized = this.verifySsl == null ? true : this.verifySsl;
            return new https_1.Agent(sslAgentOpts);
        }
    }
    getForParsedUri({ protocol, hostname, port, pathname, }) {
        let match = this.matchers.protocol.match(protocol.slice(0, -1));
        match = match && this.matchers.host.match(hostname);
        match = match && this.matchers.port.match(port);
        match = match && this.matchers.path.match(pathname);
        if (!match)
            return {};
        return {
            timeout: this.timeout,
            rejectUnauthorized: this.sslAgent ? undefined : this.verifySsl,
            agent: protocol === 'https:' ? this.sslAgent : undefined,
        };
    }
}
exports.ProxyConfig = ProxyConfig;
