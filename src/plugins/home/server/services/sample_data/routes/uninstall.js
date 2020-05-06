"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const config_schema_1 = require("@kbn/config-schema");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const create_index_name_1 = require("../lib/create_index_name");
function createUninstallRoute(router, sampleDatasets, usageTracker) {
    router.delete({
        path: '/api/sample_data/{id}',
        validate: {
            params: config_schema_1.schema.object({ id: config_schema_1.schema.string() }),
        },
    }, async ({ core: { elasticsearch: { dataClient: { callAsCurrentUser }, }, savedObjects: { client: savedObjectsClient }, }, }, request, response) => {
        const sampleDataset = sampleDatasets.find(({ id }) => id === request.params.id);
        if (!sampleDataset) {
            return response.notFound();
        }
        for (let i = 0; i < sampleDataset.dataIndices.length; i++) {
            const dataIndexConfig = sampleDataset.dataIndices[i];
            const index = create_index_name_1.createIndexName(sampleDataset.id, dataIndexConfig.id);
            try {
                await callAsCurrentUser('indices.delete', { index });
            }
            catch (err) {
                return response.customError({
                    statusCode: err.status,
                    body: {
                        message: `Unable to delete sample data index "${index}", error: ${err.message}`,
                    },
                });
            }
        }
        const deletePromises = sampleDataset.savedObjects.map(({ type, id }) => savedObjectsClient.delete(type, id));
        try {
            await Promise.all(deletePromises);
        }
        catch (err) {
            // ignore 404s since users could have deleted some of the saved objects via the UI
            if (lodash_1.default.get(err, 'output.statusCode') !== 404) {
                return response.customError({
                    statusCode: err.status,
                    body: {
                        message: `Unable to delete sample dataset saved objects, error: ${err.message}`,
                    },
                });
            }
        }
        // track the usage operation in a non-blocking way
        usageTracker.addUninstall(request.params.id);
        return response.noContent();
    });
}
exports.createUninstallRoute = createUninstallRoute;
