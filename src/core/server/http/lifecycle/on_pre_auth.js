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
const router_1 = require("../router");
var ResultType;
(function (ResultType) {
    ResultType["next"] = "next";
    ResultType["rewriteUrl"] = "rewriteUrl";
})(ResultType || (ResultType = {}));
const preAuthResult = {
    next() {
        return { type: ResultType.next };
    },
    rewriteUrl(url) {
        return { type: ResultType.rewriteUrl, url };
    },
    isNext(result) {
        return result && result.type === ResultType.next;
    },
    isRewriteUrl(result) {
        return result && result.type === ResultType.rewriteUrl;
    },
};
const toolkit = {
    next: preAuthResult.next,
    rewriteUrl: preAuthResult.rewriteUrl,
};
/**
 * @public
 * Adopt custom request interceptor to Hapi lifecycle system.
 * @param fn - an extension point allowing to perform custom logic for
 * incoming HTTP requests.
 */
function adoptToHapiOnPreAuthFormat(fn, log) {
    return async function interceptPreAuthRequest(request, responseToolkit) {
        const hapiResponseAdapter = new router_1.HapiResponseAdapter(responseToolkit);
        try {
            const result = await fn(router_1.KibanaRequest.from(request), router_1.lifecycleResponseFactory, toolkit);
            if (result instanceof router_1.KibanaResponse) {
                return hapiResponseAdapter.handle(result);
            }
            if (preAuthResult.isNext(result)) {
                return responseToolkit.continue;
            }
            if (preAuthResult.isRewriteUrl(result)) {
                const { url } = result;
                request.setUrl(url);
                // We should update raw request as well since it can be proxied to the old platform
                request.raw.req.url = url;
                return responseToolkit.continue;
            }
            throw new Error(`Unexpected result from OnPreAuth. Expected OnPreAuthResult or KibanaResponse, but given: ${result}.`);
        }
        catch (error) {
            log.error(error);
            return hapiResponseAdapter.toInternalError();
        }
    };
}
exports.adoptToHapiOnPreAuthFormat = adoptToHapiOnPreAuthFormat;
