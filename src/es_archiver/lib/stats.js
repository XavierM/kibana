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
function createStats(name, log) {
    const info = (msg, ...args) => log.info(`[${name}] ${msg}`, ...args);
    const debug = (msg, ...args) => log.debug(`[${name}] ${msg}`, ...args);
    const indices = {};
    const getOrCreate = (index) => {
        if (!indices[index]) {
            indices[index] = {
                skipped: false,
                deleted: false,
                created: false,
                archived: false,
                waitForSnapshot: 0,
                configDocs: {
                    upgraded: 0,
                    tagged: 0,
                    upToDate: 0,
                },
                docs: {
                    indexed: 0,
                    archived: 0,
                },
            };
        }
        return indices[index];
    };
    return new (class Stats {
        /**
         * Record that an index was not restored because it already existed
         * @param index
         */
        skippedIndex(index) {
            getOrCreate(index).skipped = true;
            info('Skipped restore for existing index %j', index);
        }
        /**
         * Record that the esArchiver waited for an index that was in the middle of being snapshotted
         * @param index
         */
        waitingForInProgressSnapshot(index) {
            getOrCreate(index).waitForSnapshot += 1;
            info('Waiting for snapshot of %j to complete', index);
        }
        /**
         * Record that an index was deleted
         * @param index
         */
        deletedIndex(index) {
            getOrCreate(index).deleted = true;
            info('Deleted existing index %j', index);
        }
        /**
         * Record that an index was created
         * @param index
         */
        createdIndex(index, metadata = {}) {
            getOrCreate(index).created = true;
            info('Created index %j', index);
            Object.keys(metadata).forEach(key => {
                debug('%j %s %j', index, key, metadata[key]);
            });
        }
        /**
         * Record that an index was written to the archives
         * @param index
         */
        archivedIndex(index, metadata = {}) {
            getOrCreate(index).archived = true;
            info('Archived %j', index);
            Object.keys(metadata).forEach(key => {
                debug('%j %s %j', index, key, metadata[key]);
            });
        }
        /**
         * Record that a document was written to elasticsearch
         * @param index
         */
        indexedDoc(index) {
            getOrCreate(index).docs.indexed += 1;
        }
        /**
         * Record that a document was added to the archives
         * @param index
         */
        archivedDoc(index) {
            getOrCreate(index).docs.archived += 1;
        }
        /**
         * Get a plain object version of the stats by index
         */
        toJSON() {
            return lodash_1.cloneDeep(indices);
        }
        /**
         * Iterate the status for each index
         * @param fn
         */
        forEachIndex(fn) {
            const clone = this.toJSON();
            Object.keys(clone).forEach(index => {
                fn(index, clone[index]);
            });
        }
    })();
}
exports.createStats = createStats;
