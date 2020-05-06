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
const lib_1 = require("../lib");
exports.registerScrollForExportRoute = (router) => {
    router.post({
        path: '/api/kibana/management/saved_objects/scroll/export',
        validate: {
            body: config_schema_1.schema.object({
                typesToInclude: config_schema_1.schema.arrayOf(config_schema_1.schema.string()),
            }),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const { client } = context.core.savedObjects;
        const objects = await lib_1.findAll(client, {
            perPage: 1000,
            type: req.body.typesToInclude,
        });
        return res.ok({
            body: objects.map(hit => {
                return {
                    _id: hit.id,
                    _source: hit.attributes,
                    _meta: {
                        savedObjectVersion: 2,
                    },
                    _migrationVersion: hit.migrationVersion,
                    _references: hit.references || [],
                };
            }),
        });
    }));
};
