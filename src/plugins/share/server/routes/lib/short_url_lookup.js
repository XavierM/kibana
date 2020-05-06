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
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const lodash_1 = require("lodash");
function shortUrlLookupProvider({ logger }) {
    async function updateMetadata(doc, { savedObjects }) {
        try {
            await savedObjects.update('url', doc.id, {
                accessDate: new Date().valueOf(),
                accessCount: lodash_1.get(doc, 'attributes.accessCount', 0) + 1,
            });
        }
        catch (error) {
            logger.warn('Warning: Error updating url metadata');
            logger.warn(error);
            // swallow errors. It isn't critical if there is no update.
        }
    }
    return {
        async generateUrlId(url, { savedObjects }) {
            const id = crypto_1.default
                .createHash('md5')
                .update(url)
                .digest('hex');
            const { isConflictError } = savedObjects.errors;
            try {
                const doc = await savedObjects.create('url', {
                    url,
                    accessCount: 0,
                    createDate: new Date().valueOf(),
                    accessDate: new Date().valueOf(),
                }, { id });
                return doc.id;
            }
            catch (error) {
                if (isConflictError(error)) {
                    return id;
                }
                throw error;
            }
        },
        async getUrl(id, { savedObjects }) {
            const doc = await savedObjects.get('url', id);
            updateMetadata(doc, { savedObjects });
            return doc.attributes.url;
        },
    };
}
exports.shortUrlLookupProvider = shortUrlLookupProvider;
