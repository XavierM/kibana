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
const stream_1 = require("stream");
const delimiter = '\n';
exports.createNDJSONStream = (payload, handler, logger) => {
    const stream = new stream_1.PassThrough();
    const results = handler.getResponseStream(payload);
    results.subscribe({
        next: (message) => {
            try {
                const line = JSON.stringify(message);
                stream.write(`${line}${delimiter}`);
            }
            catch (error) {
                logger.error('Could not serialize or stream a message.');
                logger.error(error);
            }
        },
        error: error => {
            stream.end();
            logger.error(error);
        },
        complete: () => stream.end(),
    });
    return stream;
};
