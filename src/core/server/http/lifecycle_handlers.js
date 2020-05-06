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
const router_1 = require("./router");
const VERSION_HEADER = 'kbn-version';
const XSRF_HEADER = 'kbn-xsrf';
const KIBANA_NAME_HEADER = 'kbn-name';
exports.createXsrfPostAuthHandler = (config) => {
    const { whitelist, disableProtection } = config.xsrf;
    return (request, response, toolkit) => {
        if (disableProtection ||
            whitelist.includes(request.route.path) ||
            request.route.options.xsrfRequired === false) {
            return toolkit.next();
        }
        const hasVersionHeader = VERSION_HEADER in request.headers;
        const hasXsrfHeader = XSRF_HEADER in request.headers;
        if (!router_1.isSafeMethod(request.route.method) && !hasVersionHeader && !hasXsrfHeader) {
            return response.badRequest({ body: `Request must contain a ${XSRF_HEADER} header.` });
        }
        return toolkit.next();
    };
};
exports.createVersionCheckPostAuthHandler = (kibanaVersion) => {
    return (request, response, toolkit) => {
        const requestVersion = request.headers[VERSION_HEADER];
        if (requestVersion && requestVersion !== kibanaVersion) {
            return response.badRequest({
                body: {
                    message: `Browser client is out of date, please refresh the page ` +
                        `("${VERSION_HEADER}" header was "${requestVersion}" but should be "${kibanaVersion}")`,
                    attributes: {
                        expected: kibanaVersion,
                        got: requestVersion,
                    },
                },
            });
        }
        return toolkit.next();
    };
};
exports.createCustomHeadersPreResponseHandler = (config) => {
    const serverName = config.name;
    const customHeaders = config.customResponseHeaders;
    return (request, response, toolkit) => {
        const additionalHeaders = {
            ...customHeaders,
            [KIBANA_NAME_HEADER]: serverName,
        };
        return toolkit.next({ headers: additionalHeaders });
    };
};
exports.registerCoreHandlers = (registrar, config, env) => {
    registrar.registerOnPreResponse(exports.createCustomHeadersPreResponseHandler(config));
    registrar.registerOnPostAuth(exports.createXsrfPostAuthHandler(config));
    registrar.registerOnPostAuth(exports.createVersionCheckPostAuthHandler(env.packageInfo.version));
};
