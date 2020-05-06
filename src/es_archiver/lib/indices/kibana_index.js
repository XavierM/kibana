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
const delete_index_1 = require("./delete_index");
/**
 * Deletes all indices that start with `.kibana`
 */
async function deleteKibanaIndices({ client, stats, log, }) {
    const indexNames = await fetchKibanaIndices(client);
    if (!indexNames.length) {
        return;
    }
    await client.indices.putSettings({
        index: indexNames,
        body: { index: { blocks: { read_only: false } } },
    });
    await delete_index_1.deleteIndex({
        client,
        stats,
        index: indexNames,
        log,
    });
    return indexNames;
}
exports.deleteKibanaIndices = deleteKibanaIndices;
/**
 * Given an elasticsearch client, and a logger, migrates the `.kibana` index. This
 * builds up an object that implements just enough of the kbnMigrations interface
 * as is required by migrations.
 */
async function migrateKibanaIndex({ client, kbnClient, }) {
    // we allow dynamic mappings on the index, as some interceptors are accessing documents before
    // the migration is actually performed. The migrator will put the value back to `strict` after migration.
    await client.indices.putMapping({
        index: '.kibana',
        body: {
            dynamic: true,
        },
    });
    return await kbnClient.savedObjects.migrate();
}
exports.migrateKibanaIndex = migrateKibanaIndex;
/**
 * Migrations mean that the Kibana index will look something like:
 * .kibana, .kibana_1, .kibana_323, etc. This finds all indices starting
 * with .kibana, then filters out any that aren't actually Kibana's core
 * index (e.g. we don't want to remove .kibana_task_manager or the like).
 */
async function fetchKibanaIndices(client) {
    const kibanaIndices = await client.cat.indices({ index: '.kibana*', format: 'json' });
    const isKibanaIndex = (index) => /^\.kibana(:?_\d*)?$/.test(index);
    return kibanaIndices.map((x) => x.index).filter(isKibanaIndex);
}
async function cleanKibanaIndices({ client, stats, log, kibanaPluginIds, }) {
    if (!kibanaPluginIds.includes('spaces')) {
        return await deleteKibanaIndices({
            client,
            stats,
            log,
        });
    }
    while (true) {
        const resp = await client.deleteByQuery({
            index: `.kibana`,
            body: {
                query: {
                    bool: {
                        must_not: {
                            ids: {
                                values: ['space:default'],
                            },
                        },
                    },
                },
            },
            ignore: [409],
        });
        if (resp.total !== resp.deleted) {
            log.warning('delete by query deleted %d of %d total documents, trying again', resp.deleted, resp.total);
            continue;
        }
        break;
    }
    log.warning(`since spaces are enabled, all objects other than the default space were deleted from ` +
        `.kibana rather than deleting the whole index`);
    stats.deletedIndex('.kibana');
}
exports.cleanKibanaIndices = cleanKibanaIndices;
async function createDefaultSpace({ index, client }) {
    await client.create({
        index,
        id: 'space:default',
        ignore: 409,
        body: {
            type: 'space',
            updated_at: new Date().toISOString(),
            space: {
                name: 'Default Space',
                description: 'This is the default space',
                disabledFeatures: [],
                _reserved: true,
            },
        },
    });
}
exports.createDefaultSpace = createDefaultSpace;
