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
const config_schema_1 = require("@kbn/config-schema");
const rxjs_1 = require("rxjs");
const common_1 = require("../common");
const streaming_1 = require("./streaming");
class BfetchServerPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
        this.addStreamingResponseRoute = ({ router, logger, }) => (path, handler) => {
            router.post({
                path: `/${common_1.removeLeadingSlash(path)}`,
                validate: {
                    body: config_schema_1.schema.any(),
                },
            }, async (context, request, response) => {
                const handlerInstance = handler(request);
                const data = request.body;
                const headers = {
                    'Content-Type': 'application/x-ndjson',
                    Connection: 'keep-alive',
                    'Transfer-Encoding': 'chunked',
                };
                return response.ok({
                    headers,
                    body: streaming_1.createNDJSONStream(data, handlerInstance, logger),
                });
            });
        };
        this.addBatchProcessingRoute = (addStreamingResponseRoute) => (path, handler) => {
            addStreamingResponseRoute(path, request => {
                const handlerInstance = handler(request);
                return {
                    getResponseStream: ({ batch }) => {
                        const subject = new rxjs_1.Subject();
                        let cnt = batch.length;
                        batch.forEach(async (batchItem, id) => {
                            try {
                                const result = await handlerInstance.onBatchItem(batchItem);
                                subject.next({ id, result });
                            }
                            catch (err) {
                                const error = common_1.normalizeError(err);
                                subject.next({ id, error });
                            }
                            finally {
                                cnt--;
                                if (!cnt)
                                    subject.complete();
                            }
                        });
                        return subject;
                    },
                };
            });
        };
    }
    setup(core, plugins) {
        const logger = this.initializerContext.logger.get();
        const router = core.http.createRouter();
        const addStreamingResponseRoute = this.addStreamingResponseRoute({ router, logger });
        const addBatchProcessingRoute = this.addBatchProcessingRoute(addStreamingResponseRoute);
        return {
            addBatchProcessingRoute,
            addStreamingResponseRoute,
        };
    }
    start(core, plugins) {
        return {};
    }
    stop() { }
}
exports.BfetchServerPlugin = BfetchServerPlugin;
